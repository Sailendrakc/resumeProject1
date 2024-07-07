import React, { useEffect, useLayoutEffect } from "react";
import { useState, useRef, useContext } from "react";
import { binanceContext } from "./binanceContext";
import { notifyContext } from "./notifyContext";

export function DepthPanel() {
  let [reload, setReload] = useState(true);
  let lastUpdateId = useRef();
  let getAndWatchOB = useContext(binanceContext).getAndWatchOrderBook;
  let unwatchOB = useContext(binanceContext).unwatchOrderBook;
  let currentSymbol = useRef();
  let { depthPanelNotifierFn, currentChartedSymbol } =
    useContext(notifyContext);

  let buyerBarFns = useRef([]);
  let sellerBarFns = useRef([]);
  let watchToken = useRef(Math.floor(Math.random() * 1000));
  let sellerOBdivs = useRef([]);
  let buyerOBdivs = useRef([]);

  useEffect(() => {
    //expose the change symbol function so it can be called when button is clicked.
    depthPanelNotifierFn.current = changeOBSymbol;
    changeOBSymbol(currentChartedSymbol.current); // This value is proided by Left Panel which is loaded before depth panel;

    return () => {
      if (currentSymbol.current) {
        unwatchOB(currentSymbol.current);
      }
    };
  }, []);

  function handleDepthData(initDepth) {
    let firstTime = buyerBarFns.current.length === 0;

    for (let i = 0; i < 5; i++) {
      let bid = initDepth.bids[i];
      bid[0] = parseFloat(bid[0]);
      bid[1] = parseFloat(bid[1]);

      if (firstTime) {
        //first time
        let depthDiv = (
          <DepthBar
            Amount={bid[1]}
            Price={bid[0]}
            isBuyer={true}
            index={i}
            key={i}
            callFn={trackCallback}
          />
        );
        buyerOBdivs.current.push(depthDiv);

        buyerBarFns.current[i] = {
          price: bid[0],
          amount: bid[1],
          setterFn: null,
        };
      } else {
        //check whats changed and update that only.
        let oldData = buyerBarFns.current[i];
        if (bid[0] != oldData.price || bid[1] != oldData.amount) {
          oldData.price = bid[0];
          oldData.amount = bid[1];
          if (oldData.setterFn) {
            oldData.setterFn(bid[0], bid[1]);
          }
        }
      }
    }

    for (let i = 0; i < 5; i++) {
      let ask = initDepth.asks[i];
      ask[0] = parseFloat(ask[0]);
      ask[1] = parseFloat(ask[1]);

      if (firstTime) {
        //first time
        let depthDiv = (
          <DepthBar
            Amount={ask[1]}
            Price={ask[0]}
            isBuyer={false}
            index={i}
            key={i * 2} // cause key need to be differet
            callFn={trackCallback}
          />
        );
        sellerOBdivs.current.push(depthDiv);

        sellerBarFns.current[i] = {
          price: ask[0],
          amount: ask[1],
          setterFn: null,
        };
      } else {
        //check whats changed and update that only.
        let oldData = sellerBarFns.current[i];
        if (ask[0] != oldData.price || ask[1] != oldData.amount) {
          oldData.price = ask[0];
          oldData.amount = ask[1];
          if (oldData.setterFn) {
            oldData.setterFn(ask[0], ask[1]);
          }
        }
      }
    }

    if (firstTime) {
      //reload
      setReload((r) => {
        return !r;
      });
    }
  }

  function trackCallback(setterFn, index, isbuyer) {
    if (index > 4 || !buyerBarFns.current || !sellerBarFns.current) {
      debugger;
    }
    if (isbuyer) {
      buyerBarFns.current[index].setterFn = setterFn;
    } else {
      sellerBarFns.current[index].setterFn = setterFn;
    }
  }

  //expose this function, so ebar click can signal this to perform data changes in depth panel section.
  function changeOBSymbol(symbol) {
    if (currentSymbol.current == symbol) {
      return;
    }

    //unwatch previous symbol
    if (currentSymbol.current) {
      unwatchOB(currentSymbol.current, watchToken.current);
    }

    //get and watch new symbol OB
    if (getAndWatchOB) {
      getAndWatchOB(
        symbol,
        watchToken.current,
        handleDepthData,
        handleDepthData
      );
    }

    //change current symbol
    currentSymbol.current = symbol;
  }

  console.log(
    "rendering the depth bars, if this happens when css resize occours, put the logic into useeffet."
  );

  let sellerDivsWithHeader = [];
  sellerDivsWithHeader.push(
    <div className="depthHeader sellerDepthHeader" key={"sdepthHolder"}>
      <h4>Amount</h4>
      <h4>Sell Price</h4>
    </div>
  );
  sellerDivsWithHeader.push(...sellerOBdivs.current);

  let buyerDivsWithHeader = [];
  buyerDivsWithHeader.push(
    <div className="depthHeader buyerDepthHeader" key={"bdepthHolder"}>
      <h4>Amount</h4>
      <h4>Buy Price</h4>
    </div>
  );
  buyerDivsWithHeader.push(...buyerOBdivs.current);

  return (
    <div className="depthPanel">
      <div className="sellerOB">{sellerDivsWithHeader}</div>
      <div className="buyerOB">{buyerDivsWithHeader}</div>
    </div>
  );
}

function DepthBar({ Amount, Price, isBuyer, callFn, index }) {
  //set color according to value of is buyer.

  let clasName = useRef("depthBarHolder sellerDepthBar");
  let [price, setPrice] = useState(Price);
  let [amount, setAmount] = useState(Amount);

  useEffect(() => {
    //pass the setter function so parent can call whenever state needs to be changed.
    callFn(performUpdates, index, isBuyer);
  }, []);

  function performUpdates(price, amount) {
    setPrice(price);
    setAmount(amount);
  }

  if (isBuyer) {
    //green
    clasName.current = "depthBarHolder buyerDepthBar";
  }

  return (
    <div className={clasName.current}>
      <h4 className="depthAmount">{amount}</h4>
      <h4 className="depthPrice">{price}</h4>
    </div>
  );
}

/*

  return (
    <div className="depthPanel">
      <div className="sellerOB">
        <div className="depthHeader sellerDepthHeader" key={"sdepthHolder"}>
          <h4>Amount</h4>
          <h4>Sell Price</h4>
        </div>
        <>{sellerOBdivs.current}</>
      </div>
      <div className="buyerOB">
        <div className="depthHeader buyerDepthHeader" key={"bdepthHolder"}>
          <h4>Amount</h4>
          <h4>Buy Price</h4>
        </div>
        <>{buyerOBdivs.current}</>
      </div>
    </div>
  );

streamm payloa
{
  "e": "depthUpdate", // Event type
  "E": 1672515782136,     // Event time
  "s": "BNBBTC",      // Symbol
  "U": 157,           // First update ID in event
  "u": 160,           // Final update ID in event
  "b": [              // Bids to be updated
    [
      "0.0024",       // Price level to be updated
      "10"            // Quantity
    ]
  ],
  "a": [              // Asks to be updated
    [
      "0.0026",       // Price level to be updated
      "100"           // Quantity
    ]
  ]
}


init, only result is passed
{
  "id": "51e2affb-0aba-4821-ba75-f2625006eb43",
  "status": 200,
  "result": {
    "lastUpdateId": 2731179239,
    // Bid levels are sorted from highest to lowest price.
    "bids": [
      [
        "0.01379900",   // Price
        "3.43200000"    // Quantity
      ],
      [
        "0.01379800",
        "3.24300000"
      ],
      [
        "0.01379700",
        "10.45500000"
      ],
      [
        "0.01379600",
        "3.82100000"
      ],
      [
        "0.01379500",
        "10.26200000"
      ]
    ],
    // Ask levels are sorted from lowest to highest price.
    "asks": [
      [
        "0.01380000",
        "5.91700000"
      ],
      [
        "0.01380100",
        "6.01400000"
      ],
      [
        "0.01380200",
        "0.26800000"
      ],
      [
        "0.01380300",
        "0.33800000"
      ],
      [
        "0.01380400",
        "0.26800000"
      ]
    ]
  },
  "rateLimits": [
    {
      "rateLimitType": "REQUEST_WEIGHT",
      "interval": "MINUTE",
      "intervalNum": 1,
      "limit": 6000,
      "count": 2
    }
  ]
}

  //we are not going to use this function as we get fresh top 5 depth same as initial depth
  function processNewDepthEvent(event) {
    //perform updates.
    //Drop any event where u is <= lastUpdateId in the snapshot.
    if (event.u <= lastUpdateId.current) {
      return;
      //do nothing, drop
    }

    //The first processed event should have U <= lastUpdateId+1 AND u >= lastUpdateId+1.
    if (
      event.U <= lastUpdateId.current + 1 &&
      event.u >= lastUpdateId.current
    ) {
      //process
      event.b.forEach((bs) => {
        let amt = parseFloat(bs[1]);
        let pric = parseFloat(bs[0]);

        //If the quantity is 0, remove the price level.
        if (amt == 0) {
          depthData.current.delete(pric);
        } else {
          depthData.current.set(pric, { amount: amt, isBuyer: true });
        }
      });

      event.a.forEach((as) => {
        let amt = parseFloat(as[1]);
        let pric = parseFloat(as[0]);

        //If the quantity is 0, remove the price level.
        if (amt == 0) {
          depthData.current.delete(pric);
        } else {
          depthData.current.set(pric, { amount: amt, isBuyer: false });
        }
      });

      //also reload
      setReload((r) => {
        return !r;
      });
    }
  }
*/
