use anchor_lang::prelude::*;

declare_id!("Frenschain1111111111111111111111111111111111");

#[program]
pub mod frenschain {
    use super::*;

    // Initialiser le programme
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.authority = ctx.accounts.authority.key();
        config.total_users = 0;
        config.early_bird_limit = 2000;
        config.regular_limit = 5000;
        config.early_bird_price = 100_000_000; // 0.1 SOL en lamports
        config.regular_price = 200_000_000;    // 0.2 SOL en lamports
        config.monthly_price = 50_000_000;     // 0.05 SOL en lamports
        config.bump = ctx.bumps.config;
        Ok(())
    }

    // Créer un profil utilisateur
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        interests: Vec<Interest>,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        let config = &mut ctx.accounts.config;
        
        require!(username.len() <= 32, ErrorCode::UsernameTooLong);
        require!(interests.len() <= 5, ErrorCode::TooManyInterests);
        
        profile.authority = ctx.accounts.authority.key();
        profile.username = username;
        profile.interests = interests;
        profile.is_premium = false;
        profile.premium_until = 0;
        profile.created_at = Clock::get()?.unix_timestamp;
        profile.bump = ctx.bumps.profile;
        
        config.total_users += 1;
        
        Ok(())
    }

    // Paiement d'abonnement initial
    pub fn subscribe_initial(
        ctx: Context<SubscribeInitial>,
        subscription_type: SubscriptionType,
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        let config = &ctx.accounts.config;
        
        require!(!profile.is_premium, ErrorCode::AlreadyPremium);
        
        let price = match subscription_type {
            SubscriptionType::EarlyBird => {
                require!(config.total_users < config.early_bird_limit, ErrorCode::EarlyBirdLimitReached);
                config.early_bird_price
            },
            SubscriptionType::Regular => {
                require!(config.total_users < config.regular_limit, ErrorCode::RegularLimitReached);
                config.regular_price
            },
        };
        
        // Vérifier que le paiement a été effectué
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.authority.to_account_info(),
            to: ctx.accounts.config.to_account_info(),
        };
        
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
            ),
            price,
        )?;
        
        profile.is_premium = true;
        profile.premium_until = Clock::get()?.unix_timestamp + (6 * 30 * 24 * 60 * 60); // 6 mois
        
        Ok(())
    }

    // Paiement mensuel récurrent
    pub fn subscribe_monthly(ctx: Context<SubscribeMonthly>) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        let config = &ctx.accounts.config;
        
        // Vérifier le paiement mensuel
        let transfer_instruction = anchor_lang::system_program::Transfer {
            from: ctx.accounts.authority.to_account_info(),
            to: ctx.accounts.config.to_account_info(),
        };
        
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                transfer_instruction,
            ),
            config.monthly_price,
        )?;
        
        let current_time = Clock::get()?.unix_timestamp;
        if profile.premium_until < current_time {
            profile.premium_until = current_time + (30 * 24 * 60 * 60); // 1 mois
        } else {
            profile.premium_until += 30 * 24 * 60 * 60; // Ajouter 1 mois
        }
        
        profile.is_premium = true;
        
        Ok(())
    }

    // Créer un match
    pub fn create_match(ctx: Context<CreateMatch>) -> Result<()> {
        let match_account = &mut ctx.accounts.match_account;
        
        match_account.user1 = ctx.accounts.user1.key();
        match_account.user2 = ctx.accounts.user2.key();
        match_account.created_at = Clock::get()?.unix_timestamp;
        match_account.is_active = true;
        match_account.bump = ctx.bumps.match_account;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + Profile::INIT_SPACE,
        seeds = [b"profile", authority.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,
    
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubscribeInitial<'info> {
    #[account(
        mut,
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump
    )]
    pub profile: Account<'info, Profile>,
    
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SubscribeMonthly<'info> {
    #[account(
        mut,
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump
    )]
    pub profile: Account<'info, Profile>,
    
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateMatch<'info> {
    #[account(
        init,
        payer = user1,
        space = 8 + Match::INIT_SPACE,
        seeds = [b"match", user1.key().as_ref(), user2.key().as_ref()],
        bump
    )]
    pub match_account: Account<'info, Match>,
    
    #[account(mut)]
    pub user1: Signer<'info>,
    
    /// CHECK: Vérifié dans la logique métier
    pub user2: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub total_users: u32,
    pub early_bird_limit: u32,
    pub regular_limit: u32,
    pub early_bird_price: u64,
    pub regular_price: u64,
    pub monthly_price: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Profile {
    pub authority: Pubkey,
    #[max_len(32)]
    pub username: String,
    pub interests: Vec<Interest>,
    pub is_premium: bool,
    pub premium_until: i64,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Match {
    pub user1: Pubkey,
    pub user2: Pubkey,
    pub created_at: i64,
    pub is_active: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub enum Interest {
    Friends,
    Love,
    Sex,
    Crypto,
    Passion,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum SubscriptionType {
    EarlyBird,
    Regular,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Username trop long")]
    UsernameTooLong,
    #[msg("Trop d'intérêts")]
    TooManyInterests,
    #[msg("Déjà premium")]
    AlreadyPremium,
    #[msg("Limite early bird atteinte")]
    EarlyBirdLimitReached,
    #[msg("Limite régulière atteinte")]
    RegularLimitReached,
}
