import DataPipeline from "./core/data/pipeline.js";
import StorageService from "./core/storage/service.js";
import RpcService from "./core/rpc/service.js";
import Scheduler from "./core/scheduler/scheduler.js";
import config from "./config/index.js";

export default class CryptoDataService {
  constructor() {
    this.storage = new StorageService(config.storage);
    this.rpcService = new RpcService(config.rpc, this.storage);
    this.dataPipeline = new DataPipeline(config.data, this.storage);
    this.scheduler = new Scheduler(config.scheduler, this.dataPipeline);
  }

  async start() {
    await this.storage.initialize();
    await this.rpcService.start();
    await this.scheduler.start();

    await this.dataPipeline.run();

    this.dataPipeline.on("complete", (data) => {
      console.log("New data collected:", data);
    });

    this.dataPipeline.on("error", (err) => {
      console.error("Pipeline error:", err);
    });
    console.log("Crypto Data Service started");
  }

  async stop() {
    await this.scheduler.stop();
    await this.rpcService.stop();
    await this.storage.close();
  }
}
