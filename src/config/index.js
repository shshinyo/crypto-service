import dotenv from "dotenv";
dotenv.config();

export default {
  data: {
    coingeckoBaseUrl:
      process.env.COINGECKO_BASE_URL || "https://api.coingecko.com/api/v3",
    topExchanges: ["binance", "coinbase", "kraken"],
    requestTimeout: 5000,
  },
  storage: {
    storagePath: process.env.STORAGE_PATH || "./data",
  },
  rpc: {
    dhtPort: parseInt(process.env.DHT_PORT) || 40001,
    dhtSeed: process.env.DHT_SEED
      ? Buffer.from(process.env.DHT_SEED, "hex")
      : null,
    rpcSeed: process.env.RPC_SEED
      ? Buffer.from(process.env.RPC_SEED, "hex")
      : null,
    bootstrapNodes: process.env.BOOTSTRAP_NODES
      ? JSON.parse(process.env.BOOTSTRAP_NODES)
      : [{ host: "127.0.0.1", port: 30001 }],
  },
  scheduler: {
    intervalMs: parseInt(process.env.SCHEDULER_INTERVAL_MS) || 30000,
  },
  client: {
    serverPublicKey: process.env.SERVER_PUBLIC_KEY,
    clientDhtPort: parseInt(process.env.CLIENT_DHT_PORT) || 50001,
    bootstrapNodes: process.env.BOOTSTRAP_NODES
      ? JSON.parse(process.env.BOOTSTRAP_NODES)
      : [{ host: "127.0.0.1", port: 30001 }],
  },
};
