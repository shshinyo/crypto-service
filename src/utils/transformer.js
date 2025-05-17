export default class DataTransformer {
  toStorageFormat(data) {
    return {
      crypto: {
        id: data.crypto.id,
        symbol: data.crypto.symbol.toUpperCase(),
        name: data.crypto.name,
      },
      exchanges: this._transformExchanges(data.tickers),
      averagePrice: data.averagePrice,
      timestamp: data.timestamp || Date.now(),
      metadata: {
        source: "coingecko",
        version: "1.0",
      },
    };
  }

  _transformExchanges(tickers) {
    return tickers.map((ticker) => ({
      name: ticker.exchange,
      pair: `${ticker.base}/${ticker.target}`,
      price: ticker.last,
      volume: ticker.volume,
      spread: ticker.bid_ask_spread_percentage,
      trustScore: ticker.trust_score,
      lastUpdated: new Date(ticker.timestamp).toISOString(),
    }));
  }

  toApiFormat(storedData) {
    return {
      symbol: storedData.crypto.symbol,
      name: storedData.crypto.name,
      price: storedData.averagePrice,
      timestamp: storedData.timestamp,
      exchanges: storedData.exchanges.map((exchange) => ({
        name: exchange.name,
        price: exchange.price,
      })),
    };
  }

  toTimeSeriesFormat(historicalData) {
    return historicalData.map((point) => ({
      timestamp: point.timestamp,
      price: point.averagePrice,
    }));
  }
}
