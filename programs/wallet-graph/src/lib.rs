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

    pub fn revoke_connection(_ctx: Context<RevokeConnection>, _connection_bump: u8) -> ProgramResult {
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
        bump, //canonical bump enforced on init
        payer = from
    )]
    connection: Account<'info, Connection>,
    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(connection_bump: u8)]
pub struct RevokeConnection<'info> {
    from: Signer<'info>,
    to: AccountInfo<'info>,
    #[account(
        mut,
        seeds = [CONNECTION_SEED, from.key().as_ref(), to.key().as_ref()],
        bump = connection_bump,
        close = from
    )]
    connection: Account<'info, Connection>,
}

#[account]
#[derive(Default)]
pub struct Connection {
    from: Pubkey,
    to: Pubkey,
}
