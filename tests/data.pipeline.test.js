import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import DataPipeline from "../src/core/data/pipeline.js";

//MOCKS
vi.mock("axios");
vi.mock("node-cache", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn(),
      set: vi.fn(),
    })),
  };
});

vi.mock("../../utils/validator", () => {
  return vi.fn().mockImplementation(() => ({
    isValidTicker: () => true,
  }));
});
vi.mock("../../utils/transformer", () => {
  return vi.fn().mockImplementation(() => ({
    toStorageFormat: vi.fn().mockImplementation((data) => data),
  }));
});

const mockedCurrenciesData = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
  },
  {
    id: "ripple",
    symbol: "xrp",
    name: "XRP",
  },
  {
    id: "binancecoin",
    symbol: "bnb",
    name: "BNB",
  },
];
const mockedExchangesData = [
  {
    crypto: {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
    },
    tickers: [
      {
        base: "tether",
        target: "USDT",
        market: {
          name: "Binance",
          identifier: "binance",
          has_trading_incentive: false,
        },
        last: 0.00000768,
        volume: 297838.5,
        converted_last: {
          btc: 0.99995592,
          eth: 41.761207,
          usd: 103275,
        },
        converted_volume: {
          btc: 2.328326,
          eth: 97.238,
          usd: 240468,
        },
        trust_score: "green",
        bid_ask_spread_percentage: 0.130548,
      },
    ],
  },
  {
    crypto: {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
    },
    tickers: [
      {
        base: "EOS",
        target: "BTC",
        market: {
          name: "Binance",
          identifier: "binance",
          has_trading_incentive: false,
        },
        last: 0.00000768,
        volume: 297838.5,
        converted_last: {
          btc: 0.99995592,
          eth: 41.761207,
          usd: 103275,
        },
        converted_volume: {
          btc: 2.328326,
          eth: 97.238,
          usd: 240468,
        },
        trust_score: "green",
        bid_ask_spread_percentage: 0.130548,
      },
    ],
  },
];

describe("DataPipeline", () => {
  let pipeline;
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      savePrices: vi.fn(),
    };

    pipeline = new DataPipeline(
      {
        coingeckoBaseUrl: "https://api.coingecko.com",
        topExchanges: ["binance"],
      },
      mockStorage,
    );
  });

  it("fetches and processes top cryptocurrencies", async () => {
    vi.spyOn(pipeline, "emit").mockResolvedValue(null);
    vi.spyOn(pipeline, "getTopCryptocurrencies").mockResolvedValue(
      mockedCurrenciesData,
    );
    vi.spyOn(pipeline, "getExchanges").mockResolvedValue(mockedExchangesData);
    vi.spyOn(mockStorage, "savePrices").mockResolvedValue(mockedCurrenciesData);
    vi.spyOn(pipeline, "processData").mockResolvedValue(mockedCurrenciesData);
    vi.spyOn(pipeline, "emit").mockResolvedValue(mockedCurrenciesData);
    const result = await pipeline.run();

    expect(result.length).toBeGreaterThan(0);
    expect(mockStorage.savePrices).toHaveBeenCalled();
  });
});
