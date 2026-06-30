import Bitcoin from "@/assets/Bitcoin.svg";
import Ethereum from "@/assets/Ethereum.svg";
import Solana from "@/assets/solana.svg";
import Doge from "@/assets/doge.svg";
import Cardano from "@/assets/cardano.svg";
import Binance from "@/assets/binance.svg";
import Polygon from "@/assets/Polygon.svg";
import Ripple from "@/assets/ripple.svg";

export interface Market {
  symbol: string;
  name: string;
  coingeckoId: string;
  img: string;
}

export const MARKETS: Market[] = [
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin", img: Bitcoin },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum", img: Ethereum },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana", img: Solana },
  { symbol: "DOGE", name: "Dogecoin", coingeckoId: "dogecoin", img: Doge },
  { symbol: "ADA", name: "Cardano", coingeckoId: "cardano", img: Cardano },
  { symbol: "BNB", name: "Binance Coin", coingeckoId: "binancecoin", img: Binance },
  { symbol: "POL", name: "Polygon", coingeckoId: "polygon-ecosystem-token", img: Polygon },
  { symbol: "XRP", name: "Ripple", coingeckoId: "ripple", img: Ripple },
];

export const DEFAULT_SYMBOL = "BTC";

export const binanceSymbol = (symbol: string) => `${symbol.toUpperCase()}USDT`;
export const binanceWsSymbol = (symbol: string) => `${symbol.toLowerCase()}usdt`;

export const getMarket = (symbol: string) =>
  MARKETS.find((m) => m.symbol === symbol);

export type Interval = "15m" | "1h" | "1d";
export const INTERVALS: Interval[] = ["15m", "1h", "1d"];
