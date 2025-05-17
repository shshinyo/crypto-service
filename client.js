import CryptoDataClient from "./src/client/index.js";
import config from "./src/config/index.js";

export async function main() {
  const client = new CryptoDataClient(config.client);

  try {
    console.log("Connecting to network...");
    await client.connect();
    console.log("Connected successfully!");

    console.log("Fetching latest prices...");
    const latest = await client.getLatestPrices(["USDT", "ETH"]);
    console.log("Latest prices:", JSON.stringify(latest));
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.disconnect();
    console.log("Disconnected");
  }
}

main();
