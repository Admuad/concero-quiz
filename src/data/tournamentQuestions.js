const tournamentQuestions = [

    // ——————————————————————
    // 🔥 Concero — Deep Questions
    // ——————————————————————
    {
        question: "What is the core reason Concero avoids traditional lock-and-mint bridge risks?",
        options: [
            "It uses instant liquidity instead of token wrapping",
            "It removes private keys",
            "It relies on centralized custody",
            "It disables bridging entirely"
        ],
        answer: "It uses instant liquidity instead of token wrapping",
    },
    {
        question: "Concero's gas abstraction is achieved primarily by:",
        options: [
            "Executing destination transactions on behalf of the user",
            "Charging zero gas globally",
            "Bundling user signatures",
            "Bridging gas tokens"
        ],
        answer: "Executing destination transactions on behalf of the user",
    },
    {
        question: "Which layer of Chainlink CCIP does Concero rely on for its security guarantees?",
        options: [
            "The DON (Decentralized Oracle Network) security model",
            "The staking-slashing module",
            "The VRF coordinator",
            "The Keeper Network"
        ],
        answer: "The DON (Decentralized Oracle Network) security model",
    },
    {
        question: "Concero’s 24-minute settlement time is primarily determined by:",
        options: [
            "Oracle rate limits and CCIP reporting intervals",
            "Blockchain congestion only",
            "User device speed",
            "Validator committee rotation"
        ],
        answer: "Oracle rate limits and CCIP reporting intervals",
    },
    {
        question: "What prevents double spending during Concero cross-chain operations?",
        options: [
            "CCIP’s message replay protection",
            "Manual admin approvals",
            "IP tracking",
            "Batch signatures"
        ],
        answer: "CCIP’s message replay protection",
    },
    {
        question: "Which component ensures atomicity between source and destination chain transfers on Concero?",
        options: [
            "CCIP execution semantics",
            "Merkle proofs",
            "SNARK circuits",
            "IBC channels"
        ],
        answer: "CCIP execution semantics",
    },
    {
        question: "How does Concero minimize slippage during cross-chain swaps?",
        options: [
            "Using unified stablecoin liquidity",
            "Allowing volatile pairs",
            "Using AMM v1 only",
            "Lowering fees"
        ],
        answer: "Using unified stablecoin liquidity",
    },
    {
        question: "What happens if a user sends invalid data through Concero messaging?",
        options: [
            "Message is rejected by the DON quorum",
            "Funds are lost",
            "Execution still proceeds",
            "Validators manually correct it"
        ],
        answer: "Message is rejected by the DON quorum",
    },
    {
        question: "Concero's cross-chain finality depends on:",
        options: [
            "Multi-chain oracle consensus",
            "User confirmations",
            "L2 sequencer speed",
            "Validator uptime"
        ],
        answer: "Multi-chain oracle consensus",
    },
    {
        question: "In Concero’s model, which entity is responsible for executing destination chain transactions?",
        options: [
            "The CCIP router",
            "User’s wallet",
            "Remote RPC endpoints",
            "Sequencer nodes"
        ],
        answer: "The CCIP router",
    },

    // ——————————————————————
    // 🔥 Lanca — Tournament-level
    // ——————————————————————
    {
        question: "How does Lanca achieve fast cross-chain swaps?",
        options: [
            "Concero messaging + instant liquidity routing",
            "Relayer-only bridges",
            "Batching swaps weekly",
            "Chain-specific validators"
        ],
        answer: "Concero messaging + instant liquidity routing",
    },
    {
        question: "What is Lanca's main advantage over traditional DEX aggregators?",
        options: [
            "Access to liquidity across multiple chains simultaneously",
            "Lower UI complexity",
            "No RPC usage",
            "Cheaper token listings"
        ],
        answer: "Access to liquidity across multiple chains simultaneously",
    },
    {
        question: "Why doesn't Lanca rely on wrapped assets like wETH or wUSDC?",
        options: [
            "Concero provides native liquidity on each chain",
            "Wrapped tokens are illegal",
            "RPC limits prevent wrapping",
            "Lanca doesn’t support wrapping"
        ],
        answer: "Concero provides native liquidity on each chain",
    },
    {
        question: "Which factor MOST reduces systemic risk in Lanca?",
        options: [
            "Avoidance of lock-mint bridges",
            "Weekly audits",
            "User KYC",
            "Multi-wallet login"
        ],
        answer: "Avoidance of lock-mint bridges",
    },
    {
        question: "Why does Lanca require accurate price feeds?",
        options: [
            "To route swaps across chains without arbitrage loss",
            "To rank users",
            "To generate memes",
            "To set gas prices manually"
        ],
        answer: "To route swaps across chains without arbitrage loss",
    },
    {
        question: "How does Lanca maintain liquidity depth across chains?",
        options: [
            "Concero unified stablecoin pool",
            "Daily rebalancing bots",
            "Partnered custodians",
            "Hybrid MPC wallets"
        ],
        answer: "Concero unified stablecoin pool",
    },
    {
        question: "When bridging through Lanca, what ensures secure message passing?",
        options: [
            "Concero CCIP integration",
            "User multisigs",
            "RPC batching",
            "Manual checkpoints"
        ],
        answer: "Concero CCIP integration",
    },
    {
        question: "What prevents a swap on Lanca from executing on the wrong chain?",
        options: [
            "ChainID verification inside CCIP payloads",
            "Browser fingerprinting",
            "Randomized routing",
            "Gas fee throttling"
        ],
        answer: "ChainID verification inside CCIP payloads",
    },

    // ——————————————————————
    // 🔥 Cross-chain Security (Deep)
    // ——————————————————————
    {
        question: "What is the most common source of bridge hacks historically?",
        options: [
            "Compromised multisig or validator keys",
            "High gas fees",
            "Slow RPC",
            "User typos"
        ],
        answer: "Compromised multisig or validator keys",
    },
    {
        question: "Why do wrapped assets create systemic cross-chain risk?",
        options: [
            "Their value depends on a custodian not being hacked",
            "They are illegal in some regions",
            "They always depeg",
            "They rely on meme coins"
        ],
        answer: "Their value depends on a custodian not being hacked",
    },
    {
        question: "Which risk is eliminated by using a messaging-based bridge like CCIP?",
        options: [
            "Locked collateral theft",
            "Slippage",
            "MEV front-run",
            "High compute cost"
        ],
        answer: "Locked collateral theft",
    },
    {
        question: "What is the biggest advantage of oracle-based cross-chain systems?",
        options: [
            "Independent verification outside the blockchains",
            "Unlimited TPS",
            "Free gas",
            "No routing required"
        ],
        answer: "Independent verification outside the blockchains",
    },
    {
        question: "Replay protection in cross-chain messaging prevents:",
        options: [
            "Messages from being reused maliciously",
            "Gas overcharges",
            "Latency spikes",
            "Chain congestion"
        ],
        answer: "Messages from being reused maliciously",
    },
    {
        question: "Which of the following is an example of 'finality risk'?",
        options: [
            "Source chain reorganization after message emitted",
            "Low liquidity depth",
            "Slow block explorers",
            "Cold wallet issues"
        ],
        answer: "Source chain reorganization after message emitted",
    },
    {
        question: "Why is CCIP considered more secure than multisig bridges?",
        options: [
            "DON quorum security instead of a few keys",
            "It is faster",
            "It uses fewer nodes",
            "It has no costs"
        ],
        answer: "DON quorum security instead of a few keys",
    },

    // ——————————————————————
    // 🔥 Web3 Advanced Fundamentals
    // ——————————————————————
    {
        question: "What type of MEV attack occurs when a sandwich attacker profits from a user swap?",
        options: [
            "Front-run and back-run",
            "Time dilation",
            "Cross-chain replay",
            "Price wash"
        ],
        answer: "Front-run and back-run",
    },
    {
        question: "Slippage occurs primarily because:",
        options: [
            "Price impact during trade execution",
            "Wallet bugs",
            "Low internet speed",
            "RPC domain mismatch"
        ],
        answer: "Price impact during trade execution",
    },
    {
        question: "What is the purpose of a gas oracle?",
        options: [
            "Provides recommended gas prices",
            "Stores user balances",
            "Runs the DEX UI",
            "Sign messages"
        ],
        answer: "Provides recommended gas prices",
    },
    {
        question: "Why do L2 sequencers create temporary centralization risk?",
        options: [
            "They can censor or reorder transactions",
            "They mint tokens",
            "They manage liquidity",
            "They control wallets"
        ],
        answer: "They can censor or reorder transactions",
    },
    {
        question: "What is the primary function of a relayer in messaging systems?",
        options: [
            "Forward messages across networks",
            "Store NFTs",
            "Mint wrapped assets",
            "Confirm identity"
        ],
        answer: "Forward messages across networks",
    },
    {
        question: "Why do stablecoins reduce volatility risk?",
        options: [
            "They are pegged to a reference asset",
            "They use AI for predictions",
            "They rebalance daily",
            "They have no liquidity"
        ],
        answer: "They are pegged to a reference asset",
    },

    // ——————————————————————
    // 🔥 Hard Lanca + Concero Mix
    // ——————————————————————
    {
        question: "Which mechanism ensures Lanca swaps stay consistent across chains?",
        options: [
            "Concero price-time consensus",
            "ZK finality proofs",
            "IBC channels",
            "SECP256k1 batching"
        ],
        answer: "Concero price-time consensus",
    },
    {
        question: "Lanca prevents price manipulation by relying on:",
        options: [
            "Oracle-verified prices",
            "User reports",
            "RPC delay checks",
            "Random swaps"
        ],
        answer: "Oracle-verified prices",
    },
    {
        question: "Why is using stablecoins for multi-chain liquidity more capital efficient?",
        options: [
            "Lower volatility → less risk of imbalance",
            "They earn staking rewards",
            "They auto-bridge",
            "They burn gas"
        ],
        answer: "Lower volatility → less risk of imbalance",
    },
    {
        question: "What happens when a CCIP message fails execution on the destination chain?",
        options: [
            "Fallback execution or return to source",
            "Funds vanish",
            "Transaction keeps retrying forever",
            "User must sign again"
        ],
        answer: "Fallback execution or return to source",
    },

    // ——————————————————————
    // 🔥 Ultra Hard — Tournament tier
    // ——————————————————————
    {
        question: "Which parameter MOST affects multi-chain arbitrage safety?",
        options: [
            "Message delay between chains",
            "Screen brightness",
            "Validator count",
            "Wallet type"
        ],
        answer: "Message delay between chains",
    },
    {
        question: "Which protocol design reduces the risk of minting unbacked assets?",
        options: [
            "Liquidity-based bridges (like Concero)",
            "Lock & mint structures",
            "Multi-key custodial bridges",
            "Paillier encryption bridges"
        ],
        answer: "Liquidity-based bridges (Like Concero)",
    },
    {
        question: "Cross-chain MEV is harder to exploit because:",
        options: [
            "Different chains have asynchronous finality",
            "Gas fees are higher",
            "Wallets prevent it",
            "RPC providers block it"
        ],
        answer: "Different chains have asynchronous finality",
    },
    {
        question: "Finality mismatch risk happens when:",
        options: [
            "One chain finalizes slower than the other",
            "Wallet disconnects",
            "Gas hits 1000 gwei",
            "User has low balance"
        ],
        answer: "One chain finalizes slower than the other",
    },
    {
        question: "Why can CCIP detect fraudulent activity earlier than traditional bridges?",
        options: [
            "Independent off-chain monitoring via DON nodes",
            "Faster RPC providers",
            "User reporting",
            "Transaction batching"
        ],
        answer: "Independent off-chain monitoring via DON nodes",
    },

    // ——————————————————————
    // 🔥 Crypto Culture — Hard Edition
    // ——————————————————————
    {
        question: "What does 'bridgo phobo' jokingly refer to?",
        options: [
            "Fear of using insecure bridges",
            "Fear of gas fees",
            "Fear of wallets",
            "Fear of airdrops"
        ],
        answer: "Fear of using insecure bridges",
    },
    {
        question: "What does 'exit liquidity' mean?",
        options: [
            "New users buying overpriced tokens from early sellers",
            "Liquidity for DEX exits",
            "Bridge payout",
            "Chain exit nodes"
        ],
        answer: "New users buying overpriced tokens from early sellers",
    }
];

export default tournamentQuestions;
