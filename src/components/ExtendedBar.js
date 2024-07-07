import { react, useState, useEffect, useContext, useRef } from "react";
import { binanceContext } from "./binanceContext.js";
import { notifyContext } from "./notifyContext.js";
/**
 * Function that returns a Bar UI.
 * @param {*} param0
 * @returns Bar UI with coin name and price.
 */
export default function ExtendedBar({ symbol, removeBarFn, initPrice }) {
  let [price, setPrice] = useState({ price: initPrice, color: "white" });
  let { watchPriceFn, unwatchPriceFn } = useContext(binanceContext);
  let { chartPanelNotifierFn, depthPanelNotifierFn, currentChartedSymbol } =
    useContext(notifyContext);
  let watchToken = useRef(Math.floor(Math.random() * 1000));

  useEffect(() => {
    function updatePrice(data) {
      data = data[0];
      setPrice((oldPrice) => {
        if (oldPrice.price > data.close) {
          return { price: data.close, color: "red" };
        }

        if (oldPrice.price < data.close) {
          return { price: data.close, color: "#26a69a" };
        }
        return { price: data.close, color: oldPrice.color };
      });
    }
    watchPriceFn(symbol, updatePrice, watchToken.current);

    function retFn() {
      unwatchPriceFn(symbol, watchToken.current);
    }
    return retFn;
  }, []);

  console.log("Extended Bar Rendered");

  function onEbarClicked() {
    depthPanelNotifierFn.current(symbol);
    chartPanelNotifierFn.current(symbol);
    currentChartedSymbol.current = symbol;
  }

  function removeBar() {
    unwatchPriceFn(symbol, watchToken.current);
    removeBarFn(symbol);
  }

  return (
    <div
      className="eBarHolder"
      onClick={(e) => {
        onEbarClicked();
        e.stopPropagation();
      }}
    >
      <h5 className="coinAbbr" style={{ color: price.color }}>
        {symbol}
      </h5>
      <h5 className="coinPrice" style={{ color: price.color }}>
        {price.price}
      </h5>
      <button
        className="removeBarBtn"
        onClick={(e) => {
          removeBar();
          e.stopPropagation();
        }}
      >
        -
      </button>
    </div>
  );
}
