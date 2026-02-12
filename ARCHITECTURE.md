# Architecture

## Overview

CryptoTracker is a React Native mobile application built with **Expo SDK 54** and **Expo Router v6** for file-based navigation. It provides real-time cryptocurrency market data, portfolio tracking, price alerts, and crypto news.

## Tech Stack

| Layer              | Technology                          |
| ------------------ | ----------------------------------- |
| Framework          | React Native 0.81 + Expo 54        |
| Navigation         | Expo Router (file-based)            |
| State (client)     | Zustand 5 + persist middleware      |
| State (server)     | TanStack React Query 5              |
| HTTP Client        | Axios                               |
| Real-time Data     | Binance WebSocket                   |
| Local Database     | Expo SQLite                         |
| Key-Value Storage  | AsyncStorage                        |
| Charts             | React Native Wagmi Charts + d3      |
| List Rendering     | Shopify FlashList                   |
| Notifications      | Expo Notifications                  |
| Language           | TypeScript 5.9                      |

## Project Structure

The project follows a **Feature-Sliced Design (FSD)** architecture under `src/`, separating concerns into layers with clear dependency rules.

```
cryptotracker-app/
├── app/                         # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root layout: theme, providers, stack navigator
│   ├── (tabs)/                  # Bottom tab navigator group
│   │   ├── _layout.tsx          # Tab bar configuration (4 tabs)
│   │   ├── index.tsx            # Market screen
│   │   ├── portfolio.tsx        # Portfolio screen
│   │   ├── alerts.tsx           # Alerts screen
│   │   └── news.tsx             # News screen
│   ├── coin/[id].tsx            # Coin detail (dynamic route)
│   ├── search.tsx               # Search modal
│   └── settings.tsx             # Settings screen
│
├── src/
│   ├── entities/                # Domain models with their own API, state, UI
│   │   ├── coin/                # Cryptocurrency entity
│   │   │   ├── api/             #   CoinGecko REST + Binance WebSocket
│   │   │   ├── model/           #   Types + Zustand store (realtime prices)
│   │   │   └── ui/              #   CoinRow, CoinCard, MiniChart
│   │   ├── portfolio/           # Portfolio entity
│   │   │   ├── model/           #   Types + Zustand store (persisted)
│   │   │   └── ui/              #   HoldingRow
│   │   ├── alert/               # Price alert entity
│   │   │   ├── model/           #   Types + Zustand store (persisted)
│   │   │   └── ui/              #   AlertRow
│   │   └── news/                # News entity
│   │       ├── api/             #   News API + React Query hooks
│   │       ├── model/           #   Types
│   │       └── ui/              #   NewsCard
│   │
│   ├── features/                # User-facing use cases (compose entities)
│   │   ├── alerts/
│   │   │   ├── check-alerts/    #   useAlertChecker hook (monitors prices)
│   │   │   └── create-alert/    #   CreateAlertSheet modal
│   │   ├── portfolio/
│   │   │   └── add-holding/     #   AddHoldingSheet modal + hook
│   │   ├── search/              #   SearchBar + useSearch hook
│   │   └── settings/            #   Settings store (currency, theme, etc.)
│   │
│   ├── widgets/                 # Page-level composed components
│   │   ├── market-list/         #   MarketList (FlashList + WebSocket)
│   │   ├── portfolio-summary/   #   PortfolioSummary stats
│   │   ├── coin-detail-header/  #   CoinDetailHeader
│   │   ├── price-chart/         #   PriceChart (Wagmi Charts)
│   │   └── news-feed/           #   NewsFeed
│   │
│   └── shared/                  # Infrastructure & utilities
│       ├── api/                 #   Axios instance, WebSocket manager
│       ├── config/              #   Constants, React Query client
│       ├── database/            #   SQLite client + migrations
│       ├── hooks/               #   useAppState
│       ├── lib/                 #   Formatters, storage adapter
│       ├── providers/           #   AppProviders (QueryClientProvider)
│       ├── types/               #   Global type definitions
│       └── ui/                  #   LoadingSpinner, ErrorView, EmptyState, etc.
│
├── constants/
│   └── theme.ts                 # Color palette
├── __tests__/                   # Unit & integration tests
└── assets/                      # Images, fonts, icons
```

### Dependency Rules

```
app/ → widgets/ → features/ → entities/ → shared/
```

Each layer may only import from the layers to its right. This ensures unidirectional data flow and prevents circular dependencies.

## Navigation

```
Root Stack (app/_layout.tsx)
├── (tabs) ─── Bottom Tab Navigator
│   ├── Market     ── index.tsx
│   ├── Portfolio  ── portfolio.tsx
│   ├── Alerts     ── alerts.tsx
│   └── News       ── news.tsx
├── coin/[id]  ── Stack screen (coin detail)
├── search     ── Modal presentation
└── settings   ── Modal presentation
```

## State Management

### Client State — Zustand

| Store           | Persisted | Purpose                              |
| --------------- | --------- | ------------------------------------ |
| `useCoinStore`  | No        | Real-time prices from Binance WS     |
| `usePortfolioStore` | Yes (AsyncStorage) | User holdings               |
| `useAlertStore` | Yes (AsyncStorage) | Price alerts (max 20)        |
| `useSettingsStore` | Yes (AsyncStorage) | Currency, theme, preferences |

All persisted stores use Zustand's `persist` middleware with a custom AsyncStorage adapter.

### Server State — React Query

| Hook               | Source    | Stale Time |
| ------------------ | --------- | ---------- |
| `useMarketData`    | CoinGecko | 30s        |
| `useCoinDetail`    | CoinGecko | 5 min      |
| `useCoinChart`     | CoinGecko | 60s        |
| `useSearchCoins`   | CoinGecko | 5 min      |
| `useTrendingCoins` | CoinGecko | 5 min      |
| `useNewsData`      | CoinGecko | 5 min      |

## Data Flow

```
                    ┌──────────────┐
                    │  CoinGecko   │  REST API
                    │    API       │  (market data, details, charts)
                    └──────┬───────┘
                           │
                    React Query Cache
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
 Market List         Coin Detail            Search Results
    │                      │
    │              ┌───────┴────────┐
    │              │  Price Chart   │
    │              └────────────────┘
    │
    │     ┌──────────────┐
    └─────│   Binance    │  WebSocket
          │  WebSocket   │  (real-time prices)
          └──────┬───────┘
                 │
          useCoinStore (Zustand)
                 │
          ┌──────┴──────┐
          │             │
       CoinRow    Alert Checker ──→ Expo Notifications
                        │
                  useAlertStore
```

## API Integrations

### CoinGecko REST API
- **Base URL:** `https://api.coingecko.com/api/v3`
- Endpoints: `/coins/markets`, `/coins/{id}`, `/coins/{id}/market_chart`, `/search`, `/search/trending`
- Rate limit aware (handles 429 responses)

### Binance WebSocket
- **URL:** `wss://stream.binance.com:9443/ws/!miniTicker@arr`
- Streams real-time price tickers for 20 supported coins
- Custom `WebSocketManager` with exponential backoff reconnection (max 10 attempts)

## Local Persistence

### SQLite (`cryptostream.db`)
Used for caching API responses:
- `cached_coins` — Market data cache
- `price_alerts` — Alert definitions
- `cached_news` — News article cache
- `portfolio_holdings` — Portfolio cache

### AsyncStorage
Used by Zustand persist middleware for app state:
- Portfolio holdings, price alerts, user settings

## Theming

Dark-first design with custom color tokens:

| Token       | Value     |
| ----------- | --------- |
| Primary     | `#6C63FF` |
| Background  | `#000000` |
| Card        | `#1C1C1E` |
| Border      | `#2C2C2E` |
| Text        | `#FFFFFF` |
| Success     | `#34C759` |
| Error       | `#FF3B30` |
| Muted       | `#8E8E93` |

Styling uses React Native `StyleSheet` — no CSS-in-JS libraries.

## Key Design Decisions

1. **Feature-Sliced Design** — Clear separation between entities, features, widgets, and shared code prevents coupling and improves maintainability.
2. **Dual state management** — Zustand for client state (fast, minimal boilerplate) + React Query for server state (caching, background refetch, deduplication).
3. **WebSocket for real-time prices** — Binance WS provides sub-second updates vs polling CoinGecko every 30s.
4. **FlashList over FlatList** — Better scroll performance for the market list with 50+ items.
5. **SQLite + AsyncStorage** — SQLite for structured cache data, AsyncStorage for simple key-value persistence via Zustand.
6. **Expo Router** — File-based routing with typed routes for type-safe navigation.
