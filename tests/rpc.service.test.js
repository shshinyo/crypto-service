import { describe, it, expect, vi, beforeEach } from "vitest";
import RpcService from "../src/core/rpc/service.js";
import * as RPC from "@hyperswarm/rpc";
import * as DHT from "hyperdht";

// MOCKS
vi.mock("@hyperswarm/rpc", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      createServer: vi.fn().mockReturnValue({
        listen: vi.fn(),
        respond: vi.fn(),
        close: vi.fn(),
        publicKey: Buffer.from("mocked-key"),
      }),
      destroy: vi.fn(),
    })),
  };
});

vi.mock("hyperdht", () => {
  const mockDHTInstance = {
    ready: vi.fn(),
    destroy: vi.fn(),
  };

  const MockDHT = vi.fn(() => mockDHTInstance);

  MockDHT.keyPair = vi.fn(() => ({
    publicKey: Buffer.from("mocked-public-key"),
    secretKey: Buffer.from("mocked-secret-key"),
  }));

  return {
    default: MockDHT,
  };
});
vi.mock("hyperdht", () => {
  const mockDHTInstance = {
    ready: vi.fn(),
    destroy: vi.fn(),
  };

  const MockDHT = vi.fn(() => mockDHTInstance);

  MockDHT.keyPair = vi.fn(() => ({
    publicKey: Buffer.from("mocked-public-key"),
    secretKey: Buffer.from("mocked-secret-key"),
  }));

  return {
    default: MockDHT,
  };
});

describe("RpcService", () => {
  let rpcService;
  let mockStorage;

  beforeEach(() => {
    mockStorage = {
      getLatestPrices: vi
        .fn()
        .mockResolvedValue([{ symbol: "btc", price: 30000 }]),
      getHistoricalPrices: vi.fn().mockResolvedValue([]),
    };

    rpcService = new RpcService(
      {
        dhtPort: 12345,
        bootstrapNodes: [],
      },
      mockStorage,
    );
  });

  it("starts the RPC service and sets up methods", async () => {
    await rpcService.start();

    expect(RPC.default).toHaveBeenCalled();
    expect(DHT.default).toHaveBeenCalled();
  });

  it("responds to getLatestPrices", async () => {
    const requestBuffer = Buffer.from(
      JSON.stringify({ pairs: ["btc"] }),
      "utf-8",
    );
    const response = await rpcService.handleGetLatestPrices(requestBuffer);
    const json = JSON.parse(response.toString());

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });
});
