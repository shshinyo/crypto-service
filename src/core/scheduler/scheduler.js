import { EventEmitter } from "events";

export default class Scheduler extends EventEmitter {
  constructor(config, dataPipeline) {
    super();
    this.config = config;
    this.dataPipeline = dataPipeline;
    this.intervalId = null;
    this.isRunning = false;
  }

  async start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(
      () => this.executePipeline(),
      this.config.intervalMs,
    );

    this.emit("started");
  }

  async stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit("stopped");
  }

  async executePipeline() {
    if (this.isRunning) return;

    this.isRunning = true;
    try {
      await this.dataPipeline.run();
    } catch (error) {
      this.emit("error", error);
    } finally {
      this.isRunning = false;
    }
  }
}
