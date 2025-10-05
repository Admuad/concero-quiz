// questions.js

const questions = [
  // --- Concero ---
  {
    question: "How fast can Concero complete a cross-chain transfer?",
    options: ["Under a minute", "Around 1 hour", "24 hours", "3 days"],
    answer: "Under a minute",
  },
  {
    question: "On average, how long does Concero settlement through Chainlink CCIP take?",
    options: ["1 minute", "24 minutes", "2 hours", "1 day"],
    answer: "24 minutes",
  },
  {
    question: "What is the Concero protocol fee per transaction?",
    options: ["0.01%", "0.05%", "0.1%", "1%"],
    answer: "0.1%",
  },
  {
    question: "What asset is primarily used for liquidity pools in Concero v1?",
    options: ["ETH", "USDC", "LINK", "BTC"],
    answer: "USDC",
  },
  {
    question: "Liquidity providers on Concero earn fees in what token (v1)?",
    options: ["ETH", "LINK", "USDC", "Concero token"],
    answer: "USDC",
  },
  {
    question: "How long is the cooldown period for withdrawing liquidity on Concero?",
    options: ["1 day", "3 days", "7 days", "14 days"],
    answer: "7 days",
  },
  {
    question: "Why is Concero’s gas abstraction feature important for users?",
    options: [
      "It lowers internet costs",
      "Users don’t need destination chain gas",
      "It makes graphics better",
      "It removes passwords",
    ],
    answer: "Users don’t need destination chain gas",
  },
  {
    question: "What are the three main attributes Concero was designed around?",
    options: [
      "Speed, Security, Ease of Use",
      "Price, Marketing, Team",
      "NFTs, DeFi, Gaming",
      "Community, Branding, Treasury",
    ],
    answer: "Speed, Security, Ease of Use",
  },
  {
    question: "What technology does Concero use to secure cross-chain messages?",
    options: ["Chainlink CCIP", "WhatsApp", "Polygon SDK", "Solana Bridge"],
    answer: "Chainlink CCIP",
  },
  {
    question: "Concero guarantees finality of transactions by relying on ___?",
    options: ["Validators", "Chainlink nodes", "Oracle reports", "Manual checks"],
    answer: "Chainlink nodes",
  },
  {
    question: "Which stablecoin does Concero v1 rely on for its liquidity pool?",
    options: ["DAI", "USDC", "Tether (USDT)", "BUSD"],
    answer: "USDC",
  },
  {
    question: "What is the minimum gas requirement for users on Concero?",
    options: [
      "Only on the origin chain",
      "Both chains",
      "Destination chain only",
      "No gas required anywhere",
    ],
    answer: "Only on the origin chain",
  },
  {
    question: "Concero aims to solve which major blockchain problem?",
    options: [
      "Internet speed",
      "Cross-chain fragmentation",
      "Phone storage",
      "Social media spam",
    ],
    answer: "Cross-chain fragmentation",
  },
  {
    question: "Concero transactions can often be completed in how long?",
    options: ["Less than a minute", "About 1 hour", "3 hours", "1 day"],
    answer: "Less than a minute",
  },
  {
    question: "What do liquidity providers contribute to Concero pools?",
    options: ["Memecoins", "Stablecoins like USDC", "ETH only", "NFTs"],
    answer: "Stablecoins like USDC",
  },
  {
    question: "How often can liquidity providers withdraw rewards?",
    options: ["Instantly", "After 7-day cooldown", "Once a year", "Never"],
    answer: "After 7-day cooldown",
  },
  {
    question: "How does Concero achieve fast cross-chain transfers?",
    options: [
      "By guessing transactions",
      "Using Chainlink CCIP messaging",
      "By sending screenshots",
      "By using email servers",
    ],
    answer: "Using Chainlink CCIP messaging",
  },
  {
    question: "What ensures that Concero transfers are secure?",
    options: [
      "A single server",
      "Chainlink decentralized oracle network",
      "Twitter bots",
      "VPNs",
    ],
    answer: "Chainlink decentralized oracle network",
  },
  {
    question: "Concero abstracts gas fees by allowing users to ___?",
    options: [
      "Borrow free gas from banks",
      "Only pay gas on the origin chain",
      "Avoid gas completely",
      "Pay gas in Bitcoin",
    ],
    answer: "Only pay gas on the origin chain",
  },
  {
    question: "What happens if a Concero transfer fails?",
    options: [
      "Tokens are locked forever",
      "Funds are returned to the origin chain",
      "Tokens are given to random users",
      "No one knows",
    ],
    answer: "Funds are returned to the origin chain",
  },
  {
    question: "Concero’s liquidity pools reduce risk by using which token standard?",
    options: ["Volatile memecoins", "Stablecoins like USDC", "NFTs", "ETH only"],
    answer: "Stablecoins like USDC",
  },
  {
    question: "Why is Concero faster than traditional bridges?",
    options: [
      "Because it uses centralized custody",
      "It relies on decentralized messaging & instant liquidity",
      "It skips blockchain verification",
      "It’s only marketing",
    ],
    answer: "It relies on decentralized messaging & instant liquidity",
  },
  {
    question: "Concero’s settlement delay (24 minutes) is due to what factor?",
    options: [
      "Chainlink oracle reporting interval",
      "Slow internet",
      "Lack of validators",
      "User error",
    ],
    answer: "Chainlink oracle reporting interval",
  },
  {
    question: "How does Concero keep fees predictable?",
    options: [
      "Fixed 0.1% protocol fee",
      "Random charges",
      "Depending on user mood",
      "No fees at all",
    ],
    answer: "Fixed 0.1% protocol fee",
  },
  {
    question: "Concero’s architecture is designed to remove which common issue in cross-chain swaps?",
    options: [
      "Double spending & bridge hacks",
      "Phone overheating",
      "Gasless wallets",
      "Password resets",
    ],
    answer: "Double spending & bridge hacks",
  },
  {
    question: "Concero liquidity providers earn a share of ___?",
    options: [
      "Protocol fees in USDC",
      "Gas rebates in ETH",
      "Free NFTs",
      "Node rewards in SOL",
    ],
    answer: "Protocol fees in USDC",
  },

  // --- Lanca ---
  {
    question: "What is Lanca mainly used for?",
    options: [
      "Social app",
      "Multichain DEX & bridging",
      "File storage",
      "NFT marketplace",
    ],
    answer: "Multichain DEX & bridging",
  },
  {
    question: "Which blockchains does Lanca currently support?",
    options: [
      "Base, Optimism, Arbitrum, Polygon, Avalanche",
      "Bitcoin & Solana only",
      "Only Ethereum",
      "None",
    ],
    answer: "Base, Optimism, Arbitrum, Polygon, Avalanche",
  },
  {
    question: "Lanca is powered by which messaging system?",
    options: ["Telegram", "Concero Messaging", "Discord", "WhatsApp"],
    answer: "Concero Messaging",
  },
  {
    question: "What can you do with Lanca?",
    options: ["Trade tokens across blockchains", "Order food", "Play games", "Book hotels"],
    answer: "Trade tokens across blockchains",
  },
  {
    question: "Which chain is NOT supported on Lanca right now?",
    options: ["Optimism", "Avalanche", "Solana", "Polygon"],
    answer: "Solana",
  },
  {
    question: "Lanca can best be described as a ___?",
    options: ["Bank", "Multichain DEX", "Social media platform", "Photo editor"],
    answer: "Multichain DEX",
  },
  {
    question: "Why is Lanca useful for crypto users?",
    options: [
      "Lets them swap and bridge assets across chains",
      "Increases phone storage",
      "Gives free internet",
      "Improves graphics",
    ],
    answer: "Lets them swap and bridge assets across chains",
  },
  {
    question: "Lanca allows users to bridge tokens between different ___?",
    options: ["Phones", "Blockchains", "Social apps", "Banks"],
    answer: "Blockchains",
  },
  {
    question: "What makes Lanca a “multichain” DEX?",
    options: [
      "It runs on only one chain",
      "It supports multiple blockchains",
      "It works without the internet",
      "It uses multiple wallets",
    ],
    answer: "It supports multiple blockchains",
  },
  {
    question: "Which of these blockchains is supported on Lanca?",
    options: ["Base", "Ethereum Classic", "Solana", "Cosmos"],
    answer: "Base",
  },
  {
    question: "A user wants to move tokens from Polygon to Avalanche. Which platform could they use?",
    options: ["Concero only", "Lanca", "Binance", "Twitter"],
    answer: "Lanca",
  },
  {
    question: "What is the benefit of using Lanca compared to a single-chain DEX?",
    options: ["Faster Wi-Fi", "Access to liquidity on many chains", "Free phones", "Less typing"],
    answer: "Access to liquidity on many chains",
  },
  {
    question: "Which phrase best describes the Lanca user experience?",
    options: [
      "Complex developer configs",
      "Simple multichain swaps",
      "Only works on Solana",
      "Requires bank accounts",
    ],
    answer: "Simple multichain swaps",
  },
  {
    question: "Lanca was built to make trading across chains more ___?",
    options: ["Confusing", "Simple & fast", "Expensive", "Centralized"],
    answer: "Simple & fast",
  },
  {
    question: "How does Lanca let users trade across chains?",
    options: [
      "By connecting to Concero messaging",
      "By copying wallets manually",
      "By centralized exchanges",
      "By screenshots",
    ],
    answer: "By connecting to Concero messaging",
  },
  {
    question: "Why is Lanca described as a “multichain” DEX?",
    options: [
      "It works across many blockchains",
      "It only runs on Ethereum",
      "It doesn’t need the internet",
      "It uses banks",
    ],
    answer: "It works across many blockchains",
  },
  {
    question: "How does Lanca provide liquidity on multiple chains?",
    options: [
      "Uses Concero’s cross-chain pools",
      "Prints tokens",
      "Requires banks",
      "Uses gift cards",
    ],
    answer: "Uses Concero’s cross-chain pools",
  },
  {
    question: "Which factor makes Lanca safe for cross-chain swaps?",
    options: [
      "Concero’s secure messaging",
      "Centralized custody",
      "Password sharing",
      "24-hour delays",
    ],
    answer: "Concero’s secure messaging",
  },
  {
    question: "What role does Concero play in Lanca’s design?",
    options: ["It powers the cross-chain communication", "It stores NFTs", "It manages fiat banks", "It designs the UI"],
    answer: "It powers the cross-chain communication",
  },
  {
    question: "How does Lanca improve over single-chain DEXs?",
    options: [
      "Lets users swap tokens across many chains",
      "Gives users free tokens",
      "Requires less storage",
      "Works offline",
    ],
    answer: "Lets users swap tokens across many chains",
  },
  {
    question: "If you swap tokens from Base to Avalanche on Lanca, how is it made possible?",
    options: [
      "Concero messaging + liquidity pools",
      "By centralized banks",
      "By copying private keys",
      "By Solana validators",
    ],
    answer: "Concero messaging + liquidity pools",
  },
  {
    question: "Lanca can settle trades quickly because it uses ___?",
    options: [
      "Concero messaging & instant liquidity",
      "Manual human verification",
      "Twitter notifications",
      "Banks",
    ],
    answer: "Concero messaging & instant liquidity",
  },
  {
    question: "How does Lanca keep costs low for users?",
    options: [
      "Uses Concero’s gas abstraction & efficient routing",
      "Gives free electricity",
      "Uses ads",
      "Skips blockchain fees",
    ],
    answer: "Uses Concero’s gas abstraction & efficient routing",
  },
  {
    question: "The biggest advantage of using Lanca is ___?",
    options: [
      "Multichain access + security",
      "Free phone data",
      "Offline storage",
      "NFT drops",
    ],
    answer: "Multichain access + security",
  },
];

export default questions;

