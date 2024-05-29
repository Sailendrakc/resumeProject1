import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { App } from "./components.js";
import { getAllSymbols, watchTicker, unwatchTicker } from "./binance.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

await getAllSymbols(handleAllSymbols);

function handleAllSymbols(symbols) {
  //now actually perform root.render here after getting symbol.
  root.render(
    <App
      symbols={symbols}
      watchPriceFn={watchTicker}
      unwatchPriceFn={unwatchTicker}
    />
  );
}
