import React from "react";
import { useState, useEffect } from "react";

export function App({ symbols, watchPriceFn, unwatchPriceFn }) {
  return (
    <>
      <div id="panels">
        <LeftPanel
          symbols={symbols}
          watchPriceFn={watchPriceFn}
          unwatchPriceFn={unwatchPriceFn}
        />
        <MainPanel />
      </div>
      <FooterPanel />
    </>
  );
}

/**
 * Function that returns a Bar UI.
 * @param {*} param0
 * @returns Bar UI with coin name and price.
 */
function Bar({ symbol, watchFn, unwatchFn }) {
  let [price, setPrice] = useState(5);
  let [color, setColor] = useState({ color: "black" });

  useEffect(() => {
    function updatePrice(data) {
      setPrice((oldPrice) => {
        console.log("old Price: " + oldPrice + " , new price: " + data.p);
        if (oldPrice > parseFloat(data.p)) {
          setColor({ color: "red" });
        }

        if (oldPrice < parseFloat(data.p)) {
          setColor({ color: "green" });
        }

        return parseFloat(data.p);
      });
    }

    watchFn(symbol.toLowerCase() + "@trade", updatePrice);

    function retFn() {
      unwatchFn(symbol.toLowerCase() + "@trade");
    }
    return retFn;
  }, []);

  console.log("bar rerendered price is: " + price);

  return (
    <div className="barHolder">
      <h6 className="coinAbbr" style={color}>
        {symbol}
      </h6>
      <h6 className="coinPrice" style={color}>
        {price}
      </h6>
    </div>
  );
}

function LeftPanel({ symbols, watchPriceFn, unwatchPriceFn }) {
  //go thru symbols and create bars accordingly.
  let barList = [];
  if (!symbols || !symbols["topSymbols"]) {
    return <div id="leftPanel"></div>;
  }

  for (let i = 0; i < 5; i++) {
    let symName = symbols["topSymbols"][i];
    let barItem = (
      <Bar
        symbol={symName}
        watchFn={watchPriceFn}
        unwatchFn={unwatchPriceFn}
        key={symName}
      />
    );

    barList.push(barItem);
  }

  //not reusing this panel, tahts why id
  return <div id="leftPanel">{barList}</div>;
}

function MainPanel() {
  return <div id="mainPanel"></div>;
}

function FooterPanel() {
  return <div id="footer"></div>;
}
