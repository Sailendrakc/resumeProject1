import { useRef, useState, useContext } from "react";
import { Bar } from "./Bar.js";

import { binanceContext } from "./binanceContext.js";

export default function LeftPanelUtil({ addBarFn }) {
  let symbolObj = useRef(useContext(binanceContext).getSymbolsMap());
  let allCoinSymbolArr = useRef(
    Array.from(symbolObj.current.allSymbolsMap.keys())
  );
  let symbolListToSearch = useRef(allCoinSymbolArr.current);
  let lastSearchTxt = useRef("");
  let [rerender, setRerender] = useState(true);

  let [resultStyle, setResultStyle] = useState({
    display: "none",
  });
  let resultBarList = useRef([]);

  console.log("Left Panel util rendered");

  function onSearch(e) {
    console.log(document.activeElement);
    let txtInput = e.target.value.trim().toUpperCase();
    if (!txtInput || txtInput == "") {
      resultBarList.current = [];
      lastSearchTxt.current = "";
      symbolListToSearch.current = allCoinSymbolArr.current;
      console.log("search Ended via backkey");
      setResultStyle({ display: "none" });
      return;
    }

    if (!txtInput.startsWith(lastSearchTxt.current)) {
      symbolListToSearch.current = allCoinSymbolArr.current; //reset
    }

    let searchResultList = [];

    symbolListToSearch.current.forEach((coinName) => {
      if (symbolObj.current.allSymbolsMap.get(coinName).onWatch === true) {
        return false;
      }

      if (coinName.startsWith(txtInput)) {
        searchResultList.push(coinName);
      }
    });

    lastSearchTxt.current = txtInput;
    symbolListToSearch.current = searchResultList;
    resultBarList.current = [];
    searchResultList.forEach((element) => {
      resultBarList.current.push(
        <Bar symbol={element} onBarAdd={addBarFn} key={element}></Bar>
      );
    });

    //render it
    setResultStyle({ display: "inline-block" });
    setRerender((v) => {
      return !v;
    });
  }

  function onSearchEnd(ee) {
    let parentDiv = document.getElementsByClassName("leftPanelUtil")[0];
    let searchBox = document.getElementsByClassName("searchBox")[0];

    if (ee.relatedTarget && parentDiv.contains(ee.relatedTarget)) {
      //do nothing
      searchBox.focus();
      return;
    }

    resultBarList.current = [];
    lastSearchTxt.current = "";
    symbolListToSearch.current = allCoinSymbolArr.current;
    //console.log("search Ended via blur");
    setResultStyle({ display: "none" });
  }

  //returns search box with search function.
  return (
    <div className="leftPanelUtil">
      <div className="searchWrapper">
        <input
          type="text"
          className="searchBox"
          placeholder="Add coin pairs"
          onInput={onSearch}
          value={lastSearchTxt.current}
          onBlur={onSearchEnd}
        ></input>
        <div className="resultPanelWrapper">
          <div className="resultPanel" style={resultStyle}>
            {resultBarList.current}
          </div>
        </div>
      </div>
    </div>
  );
}
