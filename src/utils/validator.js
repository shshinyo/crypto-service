export default class DataValidator {
  isValidCrypto(crypto) {
    if (!crypto || typeof crypto !== "object") {
      return false;
    }

    const requiredFields = ["id", "symbol", "name", "market_cap"];

    for (const field of requiredFields) {
      if (!crypto[field]) {
        return false;
      }
    }

    if (crypto.symbol.length < 2 || crypto.symbol.length > 10) {
      return false;
    }

    return true;
  }

  isValidTicker(ticker) {
    if (!ticker || typeof ticker !== "object") {
      return false;
    }

    const requiredFields = [
      "base",
      "target",
      "last",
      "volume",
      "trust_score",
      "bid_ask_spread_percentage",
      "timestamp",
      "exchange",
    ];

    for (const field of requiredFields) {
      if (ticker[field] === undefined || ticker[field] === null) {
        return false;
      }
    }
    if (typeof ticker.last !== "number" || ticker.last <= 0) {
      return false;
    }

    if (isNaN(new Date(ticker.timestamp).getTime())) {
      return false;
    }

    if (
      ticker.trust_score &&
      !["green", "yellow", "red"].includes(ticker.trust_score)
    ) {
      return false;
    }

    return true;
  }

  isValidTimeRange(from, to) {
    if (typeof from !== "number" || typeof to !== "number") {
      return false;
    }

    if (from >= to) {
      return false;
    }

    if (to > Date.now()) {
      return false;
    }
    if (to - from > 90 * 24 * 60 * 60 * 1000) {
      return false;
    }

    return true;
  }
}
