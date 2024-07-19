import { react, useRef, useState, useContext } from "react";
import LeftPanelUtil from "./LeftPanelUtil.js";
import ExtendedBar from "./ExtendedBar.js";

import { binanceContext } from "./binanceContext.js";
import { notifyContext } from "./notifyContext.js";

export default function LeftPanel() {
  let shownsymbols = useRef([]); //max length gonna be 10
  let [reDraw, setReDraw] = useState(false);
  let firstTime = useRef(true);
  let { getSymbolsMap, getCandlestick, removeCandlestick } =
    useContext(binanceContext);
  let { chartPanelNotifierFn, depthPanelNotifierFn, currentChartedSymbol } =
    useContext(notifyContext);

  let symbolsMap = useRef(getSymbolsMap());

  //go thru symbols and create bars accordingly.
  let childList = [];

  function addExtendedBar(symbol) {
    if (shownsymbols.current.length >= 10) {
      console.log(
        "Cannot add more than 10 symbols to watchlists, please remove some"
      ); //probably show this as notification etc
      return false;
    }

    if (shownsymbols.current.length == 0) {
      //this one is being added first after watchlist being cleared so update the chart and depth panels
      chartPanelNotifierFn.current(symbol);
      depthPanelNotifierFn.current(symbol);
      currentChartedSymbol.current = symbol;
    } else {
      //get the symbol candlesticks to cache them
      getCandlestick(symbol);
    }

    shownsymbols.current.push(symbol);
    setReDraw((val) => {
      return !val;
    }); // now the leftPanel gonna reload.
    return true;
  }

  function removeExtendedBar(symbol) {
    if (!symbol.trim()) {
      return;
    }

    let ind = shownsymbols.current.indexOf(symbol);
    if (ind < 0) {
      return;
    }

    symbolsMap.current.allSymbolsMap.get(symbol).onWatch = false;
    shownsymbols.current.splice(ind, 1);
    if (shownsymbols.current.length == 0) {
      firstTime.current = false;
    }

    removeCandlestick(symbol);

    setReDraw((val) => {
      return !val;
    }); // now the leftPanel gonna reload.
  }

  childList.push(
    <LeftPanelUtil key={"leftPanelUtil"} addBarFn={addExtendedBar} />
  );

  //if not symbol info available , just return with symbol util
  if (
    !symbolsMap.current ||
    !symbolsMap.current["topSymbols"] ||
    !symbolsMap.current["allSymbolsMap"]
  ) {
    return <div id="leftPanel">{childList}</div>;
  }

  if (shownsymbols.current.length == 0) {
    //first time loading,
    if (firstTime.current) {
      shownsymbols.current = symbolsMap.current.topSymbols;
    }
  }

  for (let i = 0; i < shownsymbols.current.length; i++) {
    let symName = shownsymbols.current[i];
    let barItem = (
      <ExtendedBar
        symbol={symName}
        removeBarFn={removeExtendedBar}
        initPrice={symbolsMap.current.allSymbolsMap.get(symName).initPrice}
        key={symName}
      />
    );

    childList.push(barItem);

    symbolsMap.current.allSymbolsMap.get(symName).onWatch = true;
    //get their candlestick too and chart the first symbol on startup.
    if (firstTime.current) {
      //get the symbol candlesticks to cache them
      getCandlestick(symName);

      if (i == 0) {
        currentChartedSymbol.current = symName;
      }
    }
  }

  firstTime.current = false;

  return <div className="leftPanel">{childList}</div>;
}
