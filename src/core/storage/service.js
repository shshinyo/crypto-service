import Hypercore from "hypercore";
import Hyperbee from "hyperbee";
import path from "path";
import { EventEmitter } from "events";
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
export default class StorageService extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.core = null;
    this.bee = null;
  }

  async initialize() {
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        this.core = new Hypercore(
          path.join(this.config.storagePath, "crypto-data"),
        );
        await this.core.ready();
        this.bee = new Hyperbee(this.core, {
          keyEncoding: "utf-8",
          valueEncoding: "json",
        });
        break;
      } catch (err) {
        if (err.code === "ELOCKED" && retries < MAX_RETRIES - 1) {
          await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
          retries++;
          continue;
        }
        throw err;
      }
    }
  }

  async savePrices(prices) {
    const batch = this.bee.batch();
    const timestamp = Date.now();

    for (const priceData of prices) {
      const key = `${priceData.crypto.symbol}:${timestamp}`;
      await batch.put(key, priceData);
      await batch.put(`latest:${priceData.crypto.symbol}`, priceData);
    }
    await batch.flush();
  }

  async getLatestPrices(symbols) {
    const results = [];

    for (const symbol of symbols) {
      const entry = await this.bee.get(`latest:${symbol}`);
      if (entry && entry.value) {
        results.push(entry.value);
      }
    }

    return results;
  }

  async getHistoricalPrices(symbol, from, to) {
    const results = [];

    // Create a range query for the symbol
    const startKey = `${symbol}:${from}`;
    const endKey = `${symbol}:${to}`;

    for await (const entry of this.bee.createReadStream({
      gte: startKey,
      lte: endKey,
    })) {
      results.push(entry.value);
    }

    return results;
  }

  async close() {
    await this.core.close();
  }
}
