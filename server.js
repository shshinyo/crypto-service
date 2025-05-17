import CryptoDataService from "./src/index.js";
const service = new CryptoDataService();

service.start().catch(console.error);

process.on("SIGINT", async () => {
  await service.stop();
});
