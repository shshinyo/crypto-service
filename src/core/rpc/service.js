import RPC from "@hyperswarm/rpc";
import DHT from "hyperdht";
import crypto from "crypto";

export default class RpcService {
  constructor(config, storage) {
    this.config = config;
    this.storage = storage;
    this.dht = null;
    this.rpc = null;
    this.server = null;
  }

  async start() {
    const dhtSeed = this.config.dhtSeed || crypto.randomBytes(32);
    const rpcSeed = this.config.rpcSeed || crypto.randomBytes(32);

    this.dht = new DHT({
      port: this.config.dhtPort,
      keyPair: DHT.keyPair(
        dhtSeed.length === 32 ? dhtSeed : crypto.randomBytes(32),
      ),
      bootstrap: this.config.bootstrapNodes,
    });
    await this.dht.ready();

    this.rpc = new RPC({
      dht: this.dht,
      seed: rpcSeed,
    });

    this.server = this.rpc.createServer();
    await this.server.listen();

    this.server.respond(
      "getLatestPrices",
      this.handleGetLatestPrices.bind(this),
    );
    this.server.respond(
      "getHistoricalPrices",
      this.handleGetHistoricalPrices.bind(this),
    );

    console.log(
      `RPC Server started with public key: ${this.server.publicKey.toString("hex")}`,
    );
  }

  async handleGetLatestPrices(reqRaw) {
    try {
      const { pairs } = JSON.parse(reqRaw.toString("utf-8"));
      const prices = await this.storage.getLatestPrices(pairs);
      return Buffer.from(
        JSON.stringify({ success: true, data: prices }),
        "utf-8",
      );
    } catch (error) {
      return Buffer.from(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        "utf-8",
      );
    }
  }

  async handleGetHistoricalPrices(reqRaw) {
    try {
      const { pairs, from, to } = JSON.parse(reqRaw.toString("utf-8"));
      const results = {};

      for (const pair of pairs) {
        results[pair] = await this.storage.getHistoricalPrices(pair, from, to);
      }

      return Buffer.from(
        JSON.stringify({ success: true, data: results }),
        "utf-8",
      );
    } catch (error) {
      return Buffer.from(
        JSON.stringify({
          success: false,
          error: error.message,
        }),
        "utf-8",
      );
    }
  }

  async stop() {
    if (this.server) await this.server.close();
    if (this.rpc) await this.rpc.destroy();
    if (this.dht) await this.dht.destroy();
  }
}
