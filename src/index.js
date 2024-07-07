import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { App } from "./components/App.js";
import { binanceContext } from "./components/binanceContext.js";
import {
  getAllSymbolsAndPrice,
  watchKline,
  unwatchKline,
  getCandlestick,
  removeCandlestickData,
  getAndWatchOrderBook,
  unwatchOrderBook,
} from "./binance.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
let allSymbols = null;

await getAllSymbolsAndPrice(handleAllSymbols);

function handleAllSymbols(symbols) {
  allSymbols = symbols;

  //now actually perform root.render here after getting symbol.
  root.render(
    <binanceContext.Provider
      value={{
        getSymbolsMap: getSymbolsMap,
        watchPriceFn: watchKline,
        unwatchPriceFn: unwatchKline,
        getCandlestick: getCandlestick,
        removeCandlestick: removeCandlestickData,
        getAndWatchOrderBook: getAndWatchOrderBook,
        unwatchOrderBook: unwatchOrderBook,
      }}
    >
      <App />
    </binanceContext.Provider>
  );
}

function getSymbolsMap() {
  return allSymbols;
}
