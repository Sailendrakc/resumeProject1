import React from "react";
import { useState } from "react";

export function App() {
  return (
    <>
      <p>Hello</p>
    </>
  );
}

/**
 * Function that returns a Bar UI.
 * @param {*} param0
 * @returns Bar UI with coin name and price.
 */
export function Bar({ coinAbbr, coinPrice, onClick, onRemove, onPriceUpdate }) {
  const [price, setPrice] = useState(coinPrice);

  function performPriceUpdate(newPrice) {
    //Set new price
    setPrice(newPrice);

    //color code text according to up or down price movement
  }

  return (
    <div className="barHolder">
      <h6 className="coinAbbr">{coinAbbr}</h6>
      <h6 className="coinPrice">{price}</h6>
    </div>
  );
}
