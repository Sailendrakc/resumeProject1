import { React, useState } from "react";

//Just a bar with name of coin/symbol
export function Bar({ symbol, onBarAdd }) {
  let [render, setRender] = useState(true);

  function removeBar() {
    setRender(false);
  }

  if (!render) {
    return;
  }

  return (
    <button
      className="addBarBtn"
      onClick={(e) => {
        let success = onBarAdd(symbol);
        if (success) {
          removeBar();
        }
      }}
    >
      {symbol}
    </button>
  );
}
