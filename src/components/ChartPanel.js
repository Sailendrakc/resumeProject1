import { useRef, React, useState, useEffect, useContext } from "react";
import { binanceContext } from "./binanceContext";
import { createChart } from "lightweight-charts";
import { notifyContext } from "./notifyContext";

//we dont use the url react, we use node react and handle size changes differently
//as follows https://tradingview.github.io/lightweight-charts/tutorials/react/simple

export default function ChartPanel() {
  let chartRef = useRef();
  let containerRef = useRef();
  let candlestickSeries = useRef();
  let { getCandlestick, watchPriceFn, unwatchPriceFn } =
    useContext(binanceContext);
  let { chartPanelNotifierFn, currentChartedSymbol } =
    useContext(notifyContext);
  let lastChartedSymbol = useRef();
  let changeHeaderSymbolRef = useRef();
  let watchToken = useRef(Math.floor(Math.random() * 1000));

  useEffect(() => {
    chartRef.current = createChart(containerRef.current, {
      timeScale: { timeVisible: true },
      layout: { background: { color: "#1f2547" }, textColor: "white" },
      grid: {
        vertLines: { style: 4, color: "rgba(255, 255, 255, 0.5)" },
        horzLines: { style: 4, color: "rgba(255, 255, 255, 0.5)" },
      },
    });
    chartPanelNotifierFn.current = changeChartSymbol;

    function handleResize() {
      chartRef.current.applyOptions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    candlestickSeries.current = chartRef.current.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: true,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    changeChartSymbol(currentChartedSymbol.current); //This value is provided by LeftPanel which loads before chartPanel.

    return () => {
      window.removeEventListener("resize", handleResize);
      chartPanelNotifierFn.current = null;
      chartRef.current.remove();

      //unwatch the last one
      if (watchToken.current && lastChartedSymbol.current) {
        unwatchPriceFn(lastChartedSymbol.current, watchToken.current);
      }
    };
  }, []);

  //we wanna update the chart regularly with some data,
  //meaning we wanna call a function reglarly.
  function updateChart(candlestickData) {
    //console.log(candlestickData);
    if (
      !candlestickData ||
      candlestickData.length === 0 ||
      candlestickData.length === undefined
    ) {
      console.log("INVALID CANDLESTICK DATA TO RENDER");
      debugger;
      return;
    }

    if (candlestickData[0].symbol != lastChartedSymbol.current) {
      //new symbol, perform series.setData();
      candlestickSeries.current.setData(candlestickData);
      //chartRef.current.timeScale().fitContent();
      chartRef.current.timeScale().scrollToPosition(25, true);
      lastChartedSymbol.current = candlestickData[0].symbol;
      if (changeHeaderSymbolRef.current) {
        changeHeaderSymbolRef.current(candlestickData[0].symbol);
      }
    } else {
      candlestickSeries.current.update(candlestickData[0]);
    }
  }

  function scrollToRealTime() {
    if (chartRef.current) {
      chartRef.current.timeScale().scrollToRealTime();
      chartRef.current.timeScale().scrollToPosition(5, true);
    }
  }

  function changeHeaderSymbol(setterFn) {
    changeHeaderSymbolRef.current = setterFn;
  }

  //expose this function so Ebar can call it.
  function changeChartSymbol(symbol) {
    if (lastChartedSymbol.current == symbol) {
      return; //do nothing
    }

    //unwatch the last one
    if (watchToken.current && lastChartedSymbol.current) {
      unwatchPriceFn(lastChartedSymbol.current, watchToken.current);
    }

    //this function should get all necessary data and dispaly it.
    //get previous candlestick and watch for updates.
    getCandlestick(symbol, updateChart);

    //watch the incoming candlestick.
    watchPriceFn(symbol, updateChart, watchToken.current);
  }
  /*

   */

  return (
    <div className="chartPanel">
      <ChartHeader
        changeHeaderSymbolFn={changeHeaderSymbol}
        scrollToRealTime={scrollToRealTime}
      ></ChartHeader>
      <div className="chartHolder" ref={containerRef}></div>
    </div>
  );
}

function ChartHeader({ changeHeaderSymbolFn, scrollToRealTime }) {
  let [symbol, setSymbol] = useState();

  if (!symbol) {
    changeHeaderSymbolFn(setSymbol);
  }

  return (
    <div className="chartHeader">
      <h4 className="chartedSymbol">{symbol}</h4>
      <h4>1 Hour</h4>
      <button
        className="resetChartPosition"
        onClick={() => {
          scrollToRealTime();
        }}
      >
        Reset Chart
      </button>
    </div>
  );
}
