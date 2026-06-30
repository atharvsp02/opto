import type { CandlestickData, UTCTimestamp } from "lightweight-charts";
import { binanceSymbol, type Interval } from "@/lib/markets";

const REST = "https://api.binance.com/api/v3";
export const WS_BASE = "wss://stream.binance.com:9443/ws";

export async function fetchKlines(
  symbol: string,
  interval: Interval,
  limit = 200,
  signal?: AbortSignal
): Promise<CandlestickData[]> {
  const url = `${REST}/klines?symbol=${binanceSymbol(symbol)}&interval=${interval}&limit=${limit}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Failed to load candles");
  const rows: unknown[][] = await res.json();
  return rows.map((row) => ({
    time: (Number(row[0]) / 1000) as UTCTimestamp,
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
  }));
}

export interface Ticker24h {
  lastPrice: number;
  highPrice: number;
  lowPrice: number;
  priceChangePercent: number;
  quoteVolume: number;
}

export async function fetch24h(
  symbol: string,
  signal?: AbortSignal
): Promise<Ticker24h> {
  const url = `${REST}/ticker/24hr?symbol=${binanceSymbol(symbol)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error("Failed to load ticker");
  const data = await res.json();
  return {
    lastPrice: Number(data.lastPrice),
    highPrice: Number(data.highPrice),
    lowPrice: Number(data.lowPrice),
    priceChangePercent: Number(data.priceChangePercent),
    quoteVolume: Number(data.quoteVolume),
  };
}

interface KlineMessage {
  t: number;
  o: string;
  h: string;
  l: string;
  c: string;
  x: boolean;
}

export function klineMsgToCandle(k: KlineMessage): CandlestickData {
  return {
    time: (Number(k.t) / 1000) as UTCTimestamp,
    open: Number(k.o),
    high: Number(k.h),
    low: Number(k.l),
    close: Number(k.c),
  };
}
