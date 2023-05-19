import { DefaultChainInfo } from "../../../../config";

let English = {
  translations: {
    HOME_PAGE_TEXT: `Securely store, transfer and stake your  ${DefaultChainInfo.currency.coinDenom} tokens with the Persistence Wallet`,
    HOME_PAGE_SUB_TEXT: `Earn upto 35% annual rewards by staking your  ${DefaultChainInfo.currency.coinDenom}`,
    CREATE_WALLET: "Create Wallet",
    IMPORT_EXISTS_WALLET: "Import an existing wallet",
    SIGN_IN: "Sign In",
    LEARN_MORE: "Learn More",
    HELP: "Help",
    STAKING_NOTE:
      "Don’t provide any sensitive information such as password or mnemonic in this Memo field. Centralized exchanges use this info to identify a transaction when crediting to an account.",
    WALLET: "Wallet",
    IMPORT_WALLET: "Import Wallet",
    FAQ: "Frequently Asked Questions",
    USE_KEPLR: "Use Keplr",
    CONTINUE_WITH_ADDRESS: "Continue with Address",
    USE_KEPLR_BROWSER_EXTENSION: "Use Keplr Browser Extension",
    CONNECT: "Connect",
    KEPLR_ERROR: "There was an error connecting to the Keplr extension:",
    KEPLR_ACCOUNT_NOTE:
      "\n" + "Below account we've received from the Keplr browser extension.",
    USE: "Use",
    KEPLR_INSTALL_NOTE:
      "Please Install the Keplr browser extension to start using Keplr",
    ADDRESS: "Address",
    SUBMIT: "Submit",
    NEXT: "Next",
    ENTER_ADDRESS: "Enter Address",
    ABOUT_WALLET: "About Persistence Wallet",
    SIGNUP_NOTE_HEADING:
      "Take a moment to read through this content for your own safety",
    SIGNUP_NOTE_TEXT1:
      "Users need to securely store their Mnemonic (seed phrase) to prevent loss of funds. Losing or exposing this phrase could potentially lead to users' funds being stolen.",
    SIGNUP_NOTE_TEXT2:
      "Users can view and save their mnemonic while creating a wallet.",
    ALREADY_HAVE_WALLET: "Already Have a wallet ?",
    MNEMONIC: "Mnemonic",
    SEED_PHRASE: "Seed Phrase",
    SEED_WARNING: "Please securely store the mnemonic for future use",
    GENERATE_KEY_STORE: "Generate KeyStore File",
    ADVANCED: "Advanced",
    ACCOUNT: "Account",
    ACCOUNT_NUMBER: "Account Number",
    ACCOUNT_INDEX: "Account Index",
    BIP_PASSPHRASE: "bip39Passphrase",
    ENTER_BIP_PASSPHRASE: "Enter bip39Passphrase (Optional)",
    BIP_PASSPHRASE_ERROR: "Length should be below 50 characters",
    OPTIONAL: "Optional",
    WALLET_PATH: "Wallet path",
    ORIGINAL_ADDRESS: "Original address",
    NEW_ADDRESS: "New address",
    WALLET_PATH_WARNING: "Please securely store the wallet path for future use",
    USE_PRIVATE_KEY: "Use Private Key",
    ENTER_MNEMONIC: "Enter Mnemonic (Seed Phrase)",
    USE_MNEMONIC: "Use Mnemonic",
    PASSWORD: "Password",
    ENTER_PASSWORD: "Enter Password",
    KEY_STORE_FILE: "KeyStore file",
    DONE: "Done",
    PRIVATE_KEY_WARNING: "Password decrypts your Private Key (KeyStore file).",
    PRIVATE_KEY_PASSWORD_NOTE:
      "Password encrypts your seed phrase. This password does not help you generate your seed phrase.",
    KEYSTORE_FILE_NOTE:
      "This is your KeyStore json file. Please secure in a safe place",
    STAKING: "Staking",
    EXPLORER: "Explorer",
    CLOSE_WALLET: "Close Wallet",
    WALLET_ADDRESS: "Wallet Address",
    TOTAL_BALANCE: "Total Balance",
    DELEGATED: "Delegated",
    DELEGATABLE: "Delegatable",
    CURRENT_PRICE: `Current Price per ${DefaultChainInfo.currency.coinDenom}`,
    CURRENT_VALUE: "Current Value",
    AMOUNT_UNDER_VESTING: "Vesting Balance",
    TRANSFERABLE_AMOUNT: "Transferable Amount",
    REWARDS: "Rewards",
    UNBONDING: "Unbonding",
    AVAILABLE_DELEGATE_AMOUNT: "Delegatable Balance",
    DELEGATED_AMOUNT: "Delegated Amount",
    CLAIM: "Claim",
    CLAIMING_REWARDS: "Claiming Rewards",
    SELECT_VALIDATOR: "Select Validator",
    TOTAL_AVAILABLE: "Total Available",
    TOTAL_AVAILABLE_BALANCE: "Total Available Amount",
    TOTAL_AVAILABLE_XPRT_REWARDS: "Total Available XPRT Rewards",
    MEMO: "Memo",
    ENTER_MEMO: "Enter Memo(Optional)",
    SET_WITHDRAW_ADDRESS: "Setup Address for Rewards Withdrawal",
    WITHDRAW_ADDRESS: "Withdraw Address",
    ENTER_WITHDRAW_ADDRESS: "Enter Withdraw Address",
    SET_REWARDS_WITHDRAW_ADDRESS: "Set Rewards Withdraw Address",
    WITHDRAWAL_ADDRESS: "Withdrawal Address",
    ENTER_WITHDRAWAL_ADDRESS: "Enter Withdrawal Address",
    SEND: "Send",
    RECEIVE: "Receive",
    TRANSACTIONS: "Transactions",
    RECIPIENT_ADDRESS: "Recipient Address",
    SELECTED_VALIDATORS: "Selected Validators",
    DELEGATE_TOKENS: "Delegated Tokens",
    SEND_AMOUNT: "Send Amount",
    RECEIVED: "Received",
    CHOOSE_VALIDATOR: "Choose a Validator",
    ACTIVE: "Active",
    IN_ACTIVE: "Inactive",
    CLAIM_STAKING_REWARDS: "Claim Rewards",
    AVAILABLE: "Available",
    SUCCESSFULLY_CLAIMED: "Successfully Claimed Rewards!",
    FAILED_CLAIMING: "Failed to Claim Rewards",
    SUCCESSFULLY_ADDRESS_CHANGED: "Successfully Address Changed!",
    FAILED_ADDRESS_CHANGE: "Failed to Address Change",
    COMMISSION: "Commission",
    WEBSITE: "Website",
    DESCRIPTION: "Description",
    CLAIM_REWARDS: "Claim Rewards",
    UNBOND: "Unbond",
    REDELEGATE: "Redelegate",
    DELEGATE: "Delegate",
    BALANCE: "Balance",
    SUCCESSFULL_DELEGATED: "Successfully Delegated!",
    FAILED_DELEGATE: "Failed to Delegate",
    SUCCESSFULL_REDELEGATED: "Successfully Redelegated!",
    FAILED_REDELEGATE: "Failed to Redelegate",
    SUCCESSFULL_UNBOND: "Successfully Unbonded!",
    FAILED_UNBOND: "Failed to Unbond",
    SUCCESSFUL_SEND: "Successfully Sent!",
    FAILED_SEND: "Failed to Send",
    DELEGATION_AMOUNT: "Delegation Amount",
    REDELEGATION_AMOUNT: "Redelegation Amount",
    AMOUNT: "Amount",
    UNBOND_AMOUNT: " Unbond Amount",
    MEMO_NOTE:
      "Do not provide any sensitive information such as password or mnemonic in this field. Centralized exchanges use this info to identify a transaction when crediting to an account.",
    VESTING_NOTE:
      "Maximum amount that can be locked as per the vesting schedule. You may want to delegate or un-delegate the vested balance but you can’t transfer it until it’s vested (unlocked).",
    DELEGATABLE_NOTE:
      "Sum of all balances that are yet to be delegated. (Transferable or Vested Balance + Vesting Amount) - (Delegated + Unbonding Amount)",
    TRANSFERABLE_NOTE: "Amount that can be transferred.",
    SETUP_ADDRESS_NOTE: "Claim your staking rewards to another wallet address.",
    ADDRESS_NOT_MATCHED_ERROR:
      "Your sign in address and keystore file don’t match. Please try again or else sign in again.",
    KEY_STORE_PASSWORD: "KeyStore file password",
    AMOUNT_ERROR_MESSAGE:
      "Insufficient wallet balance to process the transaction.",
    MAX_AMOUNT_ERROR: "Insufficient funds to pay fee",
    AMOUNT_WARNING_MESSAGE:
      "Insufficient wallet balance for your future transactions",
    TOTAL_BALANCE_NOTE: `Delegatable ${DefaultChainInfo.currency.coinDenom} + Delegated ${DefaultChainInfo.currency.coinDenom} + Unbonded ${DefaultChainInfo.currency.coinDenom}`,
    MEMO_MNEMONIC_CHECK_ERROR:
      "Entered secret passphrase(mnemonic) in memo field. Don't input any secrete information.",
    NO_INTERNET: "No Internet",
    NO_INTERNET_NOTE1: "Checking the network cables, modem and router",
    NO_INTERNET_NOTE2: "Reconnecting to Wi-Fi",
    INSTALL_CHROME: "Install for Chrome",
    KEPLR_INSTALLED_WARNING: "Already Installed Restart the Application ?",
    ERROR_MNEMONIC_EXPECT_STRING: "Mnemonic expects a string",
    ERROR_MNEMONIC_INVALID_SECTION: "Mnemonic phrases have invalid checksums",
    DELEGATE_HEADER_HINT: `Delegate your ${DefaultChainInfo.currency.coinDenom} and earn staking rewards.`,
    DELEGATE_HEADER_HINT_NOTE: "Unstaking or unbonding period: 21 days",
    FAQS: "FAQ",
    SELECT_CHAIN: "Select Chain",
    CHAIN: "Chain",
    GAS: "Gas",
    ENTER_GAS: "Enter Gas",
    ADDING_CHANNEL: "Adding Channel",
    ZERO_FEE_WARNING:
      "Zero fees has only been enabled temperory so people can do transcations to have some tokens left inside the wallet to do proper fee transactions.",
    TOKEN: "Token",
    GAS_WARNING: "Enter Gas between 80000 to 2000000",
    SEND_TOKEN: "Send Token",
    CUSTOM: "Custom",
    PORT: "Port",
    CHANNEL: "Channel",
    ENTER_PORT: "Enter port",
    ENTER_CHANNEL: "Enter Channel",
    SETUP_WITHDRAWAL_ADDRESS: "Setup Rewards Withdrawal Address",
    CURRENT_ADDRESS: "Current Address",
    ENTER_CURRENT_ADDRESS: "Enter Current Address",
    REVISED_ADDRESS: "Revised Address",
    DELEGATIONS: "Delegations",
    VALIDATOR: "Validator",
    AVAILABLE_REWARDS: "Available Rewards",
    RECEIVED_IBC_TOKENS: "Tokens received via IBC",
    VIEW: "View",
    VIEW_UNBOND_SCHEDULE: `View Unbonding ${DefaultChainInfo.currency.coinDenom} Schedule`,
    UNBONDING_AMOUNT: "Unbonding Amount",
    DATE: "Date",
    VESTING_SCHEDULE: "Vesting Schedule",
    UNLOCKING_TOKENS: "Unlocking Tokens",
    FROM_DATE: "From Date",
    TO_DATE: "To Date",
    CONTINUE_WITH_LEDGER: "Continue With Ledger",
    USE_LEDGER: "Use Ledger",
    USE_COSMO_LEDGER: "Use Cosmos Ledger",
    USE_PERSISTENCE_LEDGER: "Use Persistence Ledger",
    VIEW_DELEGATIONS: "View Delegations",
    MONIKER: "Moniker",
    VALIDATOR_ADDRESS: "Validator Address",
    STATUS: "Status",
    CHANGE_KEY_STORE: "Change Keystore file",
    ALL_VALIDATORS: "All Validators",
    TRANSFER: "Transfer",
    TRANSFER_AMOUNT: "Transfer Amount",
    ACTIONS: "Actions",
    VOTING_POWER: "Voting Power",
    UN_BONDING_NOTE:
      "Are you sure you want to unbond your staked tokens, it will take 21 days ?",
    LOGIN_WITH_KEYSTORE: "Login With KeyStore",
    CURRENT_PASSWORD: "Current Password",
    KEYSTORE_PASSWORD_RESET: "KeyStore Password Reset",
    CHANGE_KEYSTORE_PASSWORD: "Change KeyStore Password",
    ENTER_NEW_PASSWORD: "Enter New Password",
    CHOOSE_FILE: "Choose File",
    KEYSTORE_DOWNLOADED_SUCCESSFULLY: "Keystore Successfully downloaded",
    FETCHING_ADDRESS: "Fetching Address",
    RECIPIENT_ADDRESS_EXAMPLE:
      "Recipient’s address starts with persistence; for example: " +
      "persistence14zmyw2q8keywcwhpttfr0d4xpggylsrmd4caf4",
    VALIDATORS_SELECTION_WARNING:
      "Warning:  Recommend 3 or fewer validators to avoid potential issues.",
    FOUNDATION_NODE_WARNING:
      "Warning: Foundation Nodes operate at 100%" +
      " commission, you will not be receiving any staking rewards.",
    VERIFY: "Verify",
    TRANSFERABLE_BALANCE: "Transferable Balance",
    GENERATE_KEYSTORE: "Generate KeyStore",
    LOGOUT: "Logout",
    DASHBOARD: "Dashboard",
    DELEGATED_MODAL_VIEW: "Delegated tokens modal",
    CLICK_DELEGATED_MODAL_VIEW: "Delegated tokens modal",
    UNBONDING_MODAL_VIEW: "Unbonding tokens modal",
    CLICK_UNBONDING_MODAL_VIEW: "Clicked on Unbonding tokens modal",
    TOTAL_TOKENS_MODAL_VIEW: "Total tokens modal",
    CLICK_TOTAL_TOKENS_MODAL_VIEW: "Clicked on Total tokens modal",
    IBC_REWARDS: "IBC Rewards",
    DECRYPT_KEY_STORE: "Decrypt KeyStore",
    MIGRATE_TOKENS: "Migrate Tokens From 750 wallet to 118 wallet"
  }
};

export default English;
