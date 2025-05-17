# 🚀 Cryptocurrency Data Service with Hyperswarm RPC

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Hypercore](https://img.shields.io/badge/Hypercore-10.x-blue)
![Hyperswarm](https://img.shields.io/badge/Hyperswarm-RPC-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

A decentralized cryptocurrency data pipeline that collects, processes, and serves market data using peer-to-peer technologies.

## 🌟 Features

- **Real-time Data Collection**: Fetches top 5 cryptocurrencies from CoinGecko API
- **Smart Aggregation**: Calculates average prices from 3 leading exchanges
- **Decentralized Storage**: Persistent data storage with Hyperbee
- **P2P RPC Interface**: Hyperswarm RPC endpoints for data access
- **Automated Scheduling**: Updates data every 30 seconds

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/crypto-data-service.git
cd crypto-data-service

# Install dependencies
npm install

# Install hyperdht globally (for bootstrap node)
npm install -g hyperdht


⚙️ Configuration

1. Copy the example environment file:

cp .env.example .env

2. Edit .env with your configuration:

# CoinGecko API
COINGECKO_BASE_URL="https://api.coingecko.com/api/v3"

# Storage
STORAGE_PATH="./data"

# DHT/RPC
DHT_PORT=40001
BOOTSTRAP_NODES='[{"host":"127.0.0.1","port":30001}]'

# Scheduler
SCHEDULER_INTERVAL_MS=30000

🏃‍♂️ Quick Start

Terminal 1: Start Bootstrap Node

npx hyperdht --bootstrap --host 127.0.0.1 --port 30001

Terminal 2: Start Server

npm start

Terminal 3: Run Client

npm run client
```
