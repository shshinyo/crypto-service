import RPC from "@hyperswarm/rpc";
import DHT from "hyperdht";
import crypto from "crypto";

export default class CryptoDataClient {
  constructor(config) {
    this.config = config;
    this.dht = null;
    this.rpc = null;
    this.remote = null;
  }

  async connect() {
    this.dht = new DHT({
      port: this.config.clientDhtPort,
      keyPair: DHT.keyPair(crypto.randomBytes(32)),
      bootstrap: this.config.bootstrapNodes,
    });

    await this.dht.ready();

    this.rpc = new RPC({ dht: this.dht });

    const serverKey = Buffer.from(this.config.serverPublicKey, "hex");
    this.remote = this.rpc.connect(serverKey);
  }

  async getLatestPrices(pairs) {
    if (!this.remote) throw new Error("Not connected to RPC server");

    try {
      const response = await this.remote.request(
        "getLatestPrices",
        Buffer.from(JSON.stringify({ pairs })),
      );
      return JSON.parse(response.toString());
    } catch (error) {
      console.error("RPC request failed:", error);
      throw new Error("Failed to get latest prices: " + error.message);
    }
  }

  async getHistoricalPrices(pairs, from, to) {
    if (!this.remote) throw new Error("Not connected to RPC server");

    try {
      const response = await this.remote.request(
        "getHistoricalPrices",
        Buffer.from(JSON.stringify({ pairs, from, to })),
      );
      return JSON.parse(response.toString());
    } catch (error) {
      console.error("RPC request failed:", error);
      throw new Error("Failed to get historical prices: " + error.message);
    }
  }

  async disconnect() {
    if (this.remote) {
      try {
        await this.remote.close();
      } catch (_) {}
    }
    if (this.rpc) await this.rpc.destroy();
    if (this.dht) await this.dht.destroy();
    this.remote = null;
    this.rpc = null;
    this.dht = null;
  }
}
