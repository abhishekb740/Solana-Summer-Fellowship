
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
    system_instruction,
    program::invoke_signed,
    sysvar::{rent::Rent, Sysvar},
    msg,
};
use borsh::{BorshDeserialize, BorshSerialize};
use std::mem;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Vault {
    pub owner: Pubkey,
    pub total_deposits: u64,
    pub total_withdrawn: u64,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = instruction_data[0];

    match instruction {
        0 => initialize_vault(program_id, accounts),
        1 => deposit_sol(program_id, accounts),
        2 => withdraw_sol(program_id, accounts),
        _ => Err(ProgramError::InvalidInstructionData),
    }
}

pub fn initialize_vault(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let vault_account = next_account_info(account_info_iter)?;
    let owner_account = next_account_info(account_info_iter)?;

    if vault_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    let rent = Rent::get()?;
    let required_lamports = rent.minimum_balance(mem::size_of::<Vault>());

    if vault_account.lamports() < required_lamports {
        return Err(ProgramError::InsufficientFunds);
    }

    let vault = Vault {
        owner: *owner_account.key,
        total_deposits: 0,
        total_withdrawn: 0,
    };

    vault.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;

    Ok(())
}

pub fn deposit_sol(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let vault_account = next_account_info(account_info_iter)?;
    let depositor_account = next_account_info(account_info_iter)?;

    if vault_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if !depositor_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut vault = Vault::try_from_slice(&vault_account.data.borrow())?;
    let deposit_amount = depositor_account.lamports();

    let seeds = &[program_id.as_ref()];
    let signer_seeds = &[&seeds[..]];

    invoke_signed(
        &system_instruction::transfer(depositor_account.key, vault_account.key, deposit_amount),
        &[
            depositor_account.clone(),
            vault_account.clone(),
        ],
        signer_seeds,
    )?;

    vault.total_deposits += deposit_amount;
    vault.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;

    Ok(())
}

pub fn withdraw_sol(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let vault_account = next_account_info(account_info_iter)?;
    let withdrawer_account = next_account_info(account_info_iter)?;

    if vault_account.owner != program_id {
        return Err(ProgramError::IncorrectProgramId);
    }

    if !withdrawer_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }

    let mut vault = Vault::try_from_slice(&vault_account.data.borrow())?;

    if vault.owner != *withdrawer_account.key {
        return Err(ProgramError::IllegalOwner);
    }

    let available_withdraw = vault.total_deposits / 10;

    if available_withdraw > vault_account.lamports() {
        return Err(ProgramError::InsufficientFunds);
    }

    let seeds = &[program_id.as_ref()];
    let signer_seeds = &[&seeds[..]];

    invoke_signed(
        &system_instruction::transfer(vault_account.key, withdrawer_account.key, available_withdraw),
        &[
            vault_account.clone(),
            withdrawer_account.clone(),
        ],
        signer_seeds,
    )?;

    vault.total_withdrawn += available_withdraw;
    vault.total_deposits -= available_withdraw;
    vault.serialize(&mut &mut vault_account.data.borrow_mut()[..])?;

    Ok(())
}
