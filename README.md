# CryptoTracker

A real-time cryptocurrency tracking app built with React Native and Expo. Track market prices, manage your portfolio, set price alerts, and stay updated with crypto news.

## Features

- **Live Market Data** — Top 50 cryptocurrencies with real-time price updates via CoinCap WebSocket (with polling fallback)
- **Interactive Charts** — Price charts with multiple time intervals (24H, 7D, 30D, 90D, 1Y)
- **Portfolio Tracking** — Track holdings, total value, and profit/loss
- **Price Alerts** — Set custom alerts for price targets with push notifications
- **Crypto News** — Latest cryptocurrency news feed
- **Search** — Search across thousands of coins
- **Dark Mode** — Dark-first UI with customizable theme

## Tech Stack

- **React Native** 0.81 + **Expo** 54
- **Expo Router** — File-based navigation
- **Zustand** — Client state management
- **TanStack React Query** — Server state & caching
- **CoinCap WebSocket** — Real-time price streaming (auto-fallback to polling)
- **CoinGecko API** — Market data, charts, search
- **Expo SQLite** — Local data caching
- **React Native Wagmi Charts** — Interactive price charts
- **Shopify FlashList** — High-performance lists
- **TypeScript** — Full type safety

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) (recommended) or npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator

### Installation

```bash
# Clone the repository
https://github.com/palveeen22/cryptotracker-app.git
cd cryptotracker-app

# Install dependencies
pnpm install

# Start the development server
pnpm start
```

### Running on Devices

```bash
# iOS Simulator
pnpm ios

# Android Emulator
pnpm android

# Web
pnpm web
```

## Project Structure

```
app/                    # Screens (Expo Router file-based routing)
├── (tabs)/             # Bottom tab navigator (Market, Portfolio, Alerts, News)
├── coin/[id].tsx       # Coin detail screen
├── search.tsx          # Search modal
└── settings.tsx        # Settings screen

src/
├── entities/           # Domain models (coin, portfolio, alert, news)
├── features/           # User-facing use cases (search, create alert, add holding)
├── widgets/            # Composed page-level components
└── shared/             # Utilities, API clients, providers, database
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full architecture documentation.

## API Keys

This app uses the **free tier** of the CoinGecko API and **CoinCap WebSocket** — no API keys required.

## Scripts

| Command              | Description             |
| -------------------- | ----------------------- |
| `pnpm start`         | Start Expo dev server   |
| `pnpm ios`           | Run on iOS Simulator    |
| `pnpm android`       | Run on Android Emulator |
| `pnpm web`           | Run in web browser      |
| `pnpm lint`          | Run ESLint              |
| `pnpm reset-project` | Reset to blank project  |

## License

MIT
