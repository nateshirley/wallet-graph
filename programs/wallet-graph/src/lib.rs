use anchor_lang::prelude::*;

declare_id!("EtwuAvVdSA5W63ayt43PrggcijdcPXd5ntygh1LnKyz5");

const CONNECTION_SEED: &[u8] = b"connection";

#[program]
pub mod wallet_graph {
    use super::*;
    pub fn make_connection(ctx: Context<MakeConnection>) -> ProgramResult {
        ctx.accounts.connection.from = ctx.accounts.from.key();
        ctx.accounts.connection.to = ctx.accounts.to.key();
        Ok(())
    }
}


#[derive(Accounts)]
pub struct MakeConnection<'info> {
    from: Signer<'info>,
    to: AccountInfo<'info>,
    #[account(
        init, 
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.key().as_ref()],
        bump,
        payer = from
    )]
    connection: Account<'info, Connection>,
    system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct Connection {
    from: Pubkey,
    to: Pubkey,
}
