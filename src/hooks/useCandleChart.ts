import { useEffect, useRef, useState, type RefObject } from "react";
import {
  createChart,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import { fetchKlines, klineMsgToCandle, WS_BASE } from "@/lib/binance";
import { binanceWsSymbol, type Interval } from "@/lib/markets";

type Status = "loading" | "live" | "error";

const UP = "#16a34a";
const DOWN = "#dc2626";

const chartOptions = {
  layout: {
    background: { type: ColorType.Solid, color: "transparent" },
    textColor: "hsl(0 0% 45%)",
    fontFamily: "Inter, sans-serif",
  },
  grid: {
    vertLines: { color: "hsl(0 0% 85% / 0.5)" },
    horzLines: { color: "hsl(0 0% 85% / 0.5)" },
  },
  crosshair: { mode: CrosshairMode.Normal },
  rightPriceScale: {
    borderColor: "hsl(0 0% 85%)",
    scaleMargins: { top: 0.1, bottom: 0.1 },
  },
  timeScale: {
    borderColor: "hsl(0 0% 85%)",
    timeVisible: true,
    secondsVisible: false,
    rightOffset: 6,
    barSpacing: 8,
  },
  handleScroll: {
    mouseWheel: false,
    pressedMouseMove: true,
    horzTouchDrag: true,
    vertTouchDrag: false,
  },
  handleScale: {
    mouseWheel: false,
    pinch: true,
    axisPressedMouseMove: true,
  },
};

export function useCandleChart(
  containerRef: RefObject<HTMLDivElement | null>,
  symbol: string,
  interval: Interval
) {
  const [status, setStatus] = useState<Status>("loading");
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      ...chartOptions,
      width: container.clientWidth,
      height: container.clientHeight,
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
    });
    chartRef.current = chart;
    seriesRef.current = series;

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [containerRef]);

  useEffect(() => {
    const series = seriesRef.current;
    const chart = chartRef.current;
    if (!series || !chart) return;

    let cancelled = false;
    let ws: WebSocket | null = null;
    const controller = new AbortController();

    setStatus("loading");

    fetchKlines(symbol, interval, 200, controller.signal)
      .then((data) => {
        if (cancelled) return;
        series.setData(data);
        const visibleBars = 70;
        const total = data.length;
        chart.timeScale().setVisibleLogicalRange({
          from: Math.max(0, total - visibleBars),
          to: total + 6,
        });
        const latest = data[data.length - 1];
        if (latest) setLastPrice(latest.close);
        setStatus("live");

        ws = new WebSocket(
          `${WS_BASE}/${binanceWsSymbol(symbol)}@kline_${interval}`
        );
        ws.onmessage = (event) => {
          if (cancelled) return;
          const candle = klineMsgToCandle(JSON.parse(event.data).k);
          series.update(candle);
          setLastPrice(candle.close);
        };
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (ws) {
        ws.onmessage = null;
        ws.onerror = null;
        ws.close();
      }
    };
  }, [symbol, interval]);

  return { status, lastPrice };
}
