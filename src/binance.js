let streamEndPoint = "wss://stream.binance.us:9443/ws"; //alt port 9433
let normEndPoint = "wss://ws-api.binance.com:443/ws-api/v3";

let streamWS = new WebSocket(streamEndPoint);
let streamRequestBuffer = []; //use this object to prevent spam calling.
let normWS = new WebSocket(normEndPoint);
let normRequestBuffer = []; //use this object to prevent spam calling.

let allSymbolAndPriceID = "norm-allSymbolsAndPrice";
let uiKlineID = "norm-uiKlineID-";
let depthID = "orderbook-";
let unwatchAllToken = "all";
let watchKlineID = 1;
let unwatchKlineID = 2;
let watchOrderBookId = 3;
let allSymbolsReqCB = null;
let allSymbolObj = null;

//https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#aggregate-trade-streams

streamWS.addEventListener("error", (e) => {
  console.log("streamWS Error: ", e);
});

streamWS.addEventListener("open", (e) => {
  console.log("streamWS open: ", e);
  console.log("Stream websocket connected");
  //watchKline("btcusdt", test);
  //watchAllTickers();
});

streamWS.addEventListener("close", (e) => {
  console.log("streamWS close: ", e);
});

streamWS.addEventListener("message", (e) => {
  processStreamMSG(e.data);
});

normWS.addEventListener("error", (e) => {
  console.log("streamWS Error: ", e);
});

normWS.addEventListener("open", (e) => {
  console.log("streamWS open: ", e);
  console.log("Normal websocket connected");
});

normWS.addEventListener("close", (e) => {
  console.log("streamWS close: ", e);
});

normWS.addEventListener("message", (e) => {
  processNonStreamMSG(e.data);
});

let klineWatchObj = {};
let klineReqMap = new Map();
let klineDataMap = new Map();
let depthReqMap = new Map();
let depthCBMap = new Map();

//token is unique to a request, so it can be unwatched sucessfully
export async function watchKline(symbol, callback, token) {
  if (streamWS.readyState != streamWS.OPEN) {
    console.log("Websocket is not connected. Please try connecting first");
    return false;
  }

  if (!symbol || typeof symbol !== "string" || !callback || !token) {
    console.log("No token or valid symbol provied to watch kline");
    return false;
  }

  let watchListCbObj = klineWatchObj[symbol];
  if (!watchListCbObj) {
    klineWatchObj[symbol] = { token: callback };
    console.log("new cb added to watchlist");
  } else {
    watchListCbObj[token] = callback;
    console.log("new cb added to existing watchlist");
  }

  /*
  {
  "method": "SUBSCRIBE",
  "params": [
    "btcusdt@aggTrade",
    "btcusdt@depth"
  ],
  "id": 1
}
  //Stream Name: \<symbol>@kline_\<interval>
  */

  //create the request object
  let sdata = JSON.stringify({
    id: watchKlineID,
    method: "SUBSCRIBE",
    params: [symbol.toLowerCase() + "@kline_1h"], //always 1h interval
  });

  addToSendQueue(sdata, true);
  //streamWS.send(sdata);
}

export async function unwatchKline(symbol, token) {
  if (!symbol || !klineWatchObj[symbol] || !token) {
    return;
  }

  if (streamWS.readyState != streamWS.OPEN) {
    console.log("Websocket is not connected. Please try connecting first");
    return false;
  }

  if (token == unwatchAllToken) {
    delete klineWatchObj[symbol];
  } else {
    let watches = klineWatchObj[symbol];
    delete watches[token];
  }

  //delete the cached data if no one is watching too
  if (!klineWatchObj[symbol] || Object.keys(klineWatchObj).length == 0) {
    klineDataMap.delete(symbol);
  }

  let sdata = JSON.stringify({
    id: unwatchKlineID,
    method: "UNSUBSCRIBE",
    params: [symbol.toLowerCase() + "@kline_1h"], //Stream Name: \<symbol>@kline_\<interval>
  });

  addToSendQueue(sdata, true);
  //streamWS.send(sdata);
}

//Call this function to get all the symbols with latest price from binance exchange.
//We will get the symbols in callback fn (process non stream MSG)
//https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api#symbol-price-ticker
//or https://binance-docs.github.io/apidocs/websocket_api/en/#symbol-price-ticker
export async function getAllSymbolsAndPrice(callback) {
  if (allSymbolObj) {
    return allSymbolObj;
  } else {
    //first time, so wait and make sure normal websocket is connected.
    //delay to prevent spam
    let delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(2000);
  }

  if (normWS.readyState != normWS.OPEN) {
    console.log(
      "Normal websocket is not connected. Please connect or wait for it to connect"
    );
    return;
  }

  /*
  {
  "id": "043a7cf2-bde3-4888-9604-c8ac41fcba4d",
  "method": "ticker.price",
  "params": {
    "symbol": "BNBBTC"
  }
}
  //If no symbol is specified, returns information about all symbols currently trading on the exchange.
  */

  let payload = JSON.stringify({
    id: allSymbolAndPriceID,
    method: "ticker.price",
  });

  allSymbolsReqCB = callback;
  addToSendQueue(payload, false);
  //normWS.send(payload);
}

function processNonStreamMSG(data) {
  if (!data) {
    return;
  }

  let parsedData;
  if (typeof data == typeof "a") {
    parsedData = JSON.parse(data);
    console.log("Parsed data: " + new Date().toString() + " :", parsedData);
  }
  //we have two kinds of non stream data.
  //1. All symbol with current price.
  //2. Historical hourly kline data

  if (!parsedData.result) {
    console.log("No any result in non stream request?? check");
    debugger;
    return;
  }

  //incoming data has info about all the symbols with price that we queiried with getAllSymbolsAndPrice() fn
  if (parsedData.id == allSymbolAndPriceID) {
    //just get USDT quoted pair names
    let nameArray = {
      id: allSymbolAndPriceID,
      allSymbolsMap: new Map(),
      topSymbols: [],
    };

    parsedData.result.forEach((element) => {
      if (element.symbol.endsWith("USDT")) {
        nameArray["allSymbolsMap"].set(element.symbol, {
          initPrice: parseFloat(element.price),
          onWatch: false,
        });
      }
    });

    // also make list of top coin pair to always show
    nameArray["topSymbols"] = [
      "BTCUSDT",
      "BNBUSDT",
      "ETHUSDT",
      "SOLUSDT",
      "MATICUSDT",
    ];

    allSymbolObj = nameArray;
    if (allSymbolsReqCB) {
      allSymbolsReqCB(nameArray);
      //remove it after calling
      allSymbolsReqCB = null;
    }
  }

  //incoming data has info about historical candlestick/kline data of hourly interval
  //hourly to make it simple.
  //https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api#ui-klines
  if (parsedData.id?.startsWith(uiKlineID)) {
    //this is kline data, pass it to the handler.
    let symbol = parsedData.id.split("-")[2];
    console.log("Recevied candlestick/kline for- " + symbol);
    let fns = klineReqMap.get(symbol);
    klineReqMap.delete(symbol);
    let parsedKlineArr = klineParser(parsedData.result, symbol);
    klineDataMap.set(symbol, parsedKlineArr);

    if (fns?.length > 0) {
      fns.forEach((fn) => {
        fn(parsedKlineArr);
      });
    }
  }

  if (parsedData.id?.startsWith(depthID)) {
    let sym = parsedData.id.split("-")[1];
    let cbs = depthReqMap.get(sym);

    //we dont save the depth data, we pass it and thats it.
    depthReqMap.delete(sym);
    cbs.forEach((cb) => {
      cb(parsedData.result);
    });
  }
}

function processStreamMSG(data) {
  //all message received from streaming websocket comes here.
  let parsedData;
  if (typeof data == typeof "a") {
    parsedData = JSON.parse(data);
    /*console.log(
      "Parsed stream data: " + new Date().toString() + " :",
      parsedData
    );*/
  }

  //we only get confirmation of stream or actual stream here.
  /* example confirmation of stream response.
    {
      "result": null,
      "id": subscribeID
    }
   */
  if (parsedData.id == watchKlineID || parsedData.id == watchOrderBookId) {
    //confirmation
    return;
  }

  //here we are getting stream data
  /*
  {
  "e": "kline",         // Event type
  "E": 1672515782136,   // Event time
  "s": "BNBBTC",        // Symbol
  "k": {
    "t": 1672515780000, // Kline start time
    "T": 1672515839999, // Kline close time
    "s": "BNBBTC",      // Symbol
    "i": "1m",          // Interval
    "f": 100,           // First trade ID
    "L": 200,           // Last trade ID
    "o": "0.0010",      // Open price
    "c": "0.0020",      // Close price
    "h": "0.0025",      // High price
    "l": "0.0015",      // Low price
    "v": "1000",        // Base asset volume
    "n": 100,           // Number of trades
    "x": false,         // Is this kline closed?
    "q": "1.0000",      // Quote asset volume
    "V": "500",         // Taker buy base asset volume
    "Q": "0.500",       // Taker buy quote asset volume
    "B": "123456"       // Ignore
  }
}
  */

  if (parsedData.e == "kline") {
    let symbol = parsedData.s;
    let klineObj = {
      time: parsedData.k.t / 1000,
      open: parseFloat(parsedData.k.o),
      high: parseFloat(parsedData.k.h),
      low: parseFloat(parsedData.k.l),
      close: parseFloat(parsedData.k.c),
      volume: parseFloat(parsedData.k.v),
      symbol: symbol,
      closeTime: parsedData.k.T / 1000,
    };

    //merge this data to candlestick data, if there is one
    let candlestickDataArr = klineDataMap.get(symbol);
    if (candlestickDataArr) {
      let latestCandlestickData =
        candlestickDataArr[candlestickDataArr.length - 1];
      //cadlestick data is different from above commented object. it has open, high , low ,close, vloume, time, closetime, symbol only

      if (latestCandlestickData.time == klineObj.time) {
        //same time object, swap
        candlestickDataArr[candlestickDataArr.length - 1] = klineObj;
      }

      if (klineObj.time > latestCandlestickData.closeTime) {
        //new time object, add
        candlestickDataArr.push(klineObj);
      }
    }

    //merging is done, now pass the stream data to callback,
    let cbObj = klineWatchObj[symbol];

    if (Object.keys(cbObj).length == 0) {
      //unwatch and return
      unwatchKline(symbol, unwatchAllToken);
      return;
    }

    let klineObjAsArray = klineObj;
    if (klineObj.length === undefined) {
      klineObjAsArray = [klineObj];
    }

    for (let cb of Object.values(cbObj)) {
      if (typeof cb !== "function") {
        debugger;
      }
      cb(klineObjAsArray);
    }
  }

  //this is example of depth stream update
  /*
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
]}
  */

  if (parsedData.lastUpdateId) {
    //
    let cbss = Array.from(depthCBMap.values());

    if (cbss && cbss.length > 0) {
      cbss.forEach((cb) => {
        cb(parsedData);
      });
    }
  }
}

export function getCandlestick(symbol, callback) {
  //callbacks can be null as well
  /*
  https://developers.binance.com/docs/binance-spot-api-docs/web-socket-api#ui-klines
  {
  "id": "1dbbeb56-8eea-466a-8f6e-86bdcfa2fc0b",
  "method": "uiKlines",
  "params": {
    "symbol": "BNBBTC",
    "interval": "1h",
    "startTime": 1655969280000,
    "limit": 1
  }
}
  */
  let dataArr = klineDataMap.get(symbol);
  if (dataArr?.length > 0) {
    //we already have some data
    let latestData = dataArr[dataArr.length - 1];
    if (latestData.closeTime > new Date().getUTCMilliseconds()) {
      //we alreay have uptodate data, so return it
      if (callback) {
        callback(dataArr);
      }
      return;
    } else {
      if (new Date().getUTCSeconds() - latestData.closeTime < 60 * 60) {
        //we are in new hour but no any trades/kline in latest hour, so create one and pass it
        let klineObj = {};
        klineObj["time"] = latestData.closeTime / 1000; // is closetime and time is same
        klineObj["open"] = latestData.close;
        klineObj["high"] = latestData.close;
        klineObj["low"] = latestData.close;
        klineObj["close"] = latestData.close;
        klineObj["volume"] = 0;
        klineObj["closeTime"] = latestData.closeTime + 60 * 60;
        klineObj["symbol"] = symbol;
        dataArr.push(klineObj);
        if (callback) {
          callback(dataArr);
        }
        return;
      }
    }
  }

  //we dont have any data or have invalid data..
  klineDataMap.set(symbol, []);

  if (callback) {
    if (klineReqMap.get(symbol)?.length > 0) {
      //request is already in progress, maybe add this cb as a callback too?
      klineReqMap.get(symbol).push(callback);
      return;
    } else {
      klineReqMap.set(symbol, []);
      klineReqMap.get(symbol).push(callback);
    }
  }

  let interval = "1h"; //always
  let count = 300;

  let reqObj = {
    id: uiKlineID + symbol, //std id for klines, extract this in a constant
    method: "uiKlines",
    params: {
      symbol: symbol,
      interval: interval,
      limit: count,
    },
  };

  addToSendQueue(JSON.stringify(reqObj), false);
  //normWS.send(JSON.stringify(reqObj));
}

function klineParser(klineResult, symbol) {
  if (!klineResult || klineResult.length == 0) {
    return;
  }
  let parsedKlineArr = [];

  klineResult.forEach((klineArr) => {
    if (klineArr.length < 7) {
      console.log(
        "Why does individual kline item arr have less than 7 length??"
      );
      debugger;
    }
    let klineObj = {};
    klineObj["time"] = klineArr[0] / 1000;
    klineObj["open"] = parseFloat(klineArr[1]);
    klineObj["high"] = parseFloat(klineArr[2]);
    klineObj["low"] = parseFloat(klineArr[3]);
    klineObj["close"] = parseFloat(klineArr[4]);
    klineObj["volume"] = parseFloat(klineArr[5]);
    klineObj["closeTime"] = klineArr[6] / 1000;
    klineObj["symbol"] = symbol;

    parsedKlineArr.push(klineObj);
  });

  return parsedKlineArr;
}

export function removeCandlestickData(symbol) {
  //remove the saved candlestick data if you have one.
  if (symbol && klineDataMap) {
    klineDataMap.delete(symbol);
  }
}

async function watchOrderBook(symbol, cb, token) {
  if (!symbol || !token || !cb || streamWS.readyState != streamWS.OPEN) {
    return;
  }

  let payload = JSON.stringify({
    method: "SUBSCRIBE",
    params: [symbol.toLowerCase() + "@depth5"],
    id: watchOrderBookId,
  });

  depthCBMap.set(token, cb);

  addToSendQueue(payload, true);
  //streamWS.send(payload);
}

export function unwatchOrderBook(symbol, token) {
  if (!symbol || !token || streamWS.readyState != streamWS.OPEN) {
    return;
  }

  let payload = JSON.stringify({
    method: "UNSUBSCRIBE",
    params: [symbol.toLowerCase() + "@depth5"],
    id: watchOrderBookId,
  });

  if (depthCBMap.delete(token) && depthCBMap.size === 0) {
    addToSendQueue(payload, true);
    //streamWS.send(payload);
  }
}

function getOrderBook(symbol, cb) {
  if (!symbol || !cb || normWS.readyState != normWS.OPEN) {
    return;
  }

  let payload = JSON.stringify({
    id: depthID + symbol,
    method: "depth",
    params: {
      symbol: symbol,
      limit: 5,
    },
  });

  let reqTracking = depthReqMap.get(symbol);
  if (reqTracking && reqTracking instanceof Array) {
    reqTracking.push(cb);
  } else {
    depthReqMap.set(symbol, [cb]);
  }

  let cbs = depthReqMap.get("norm-" + symbol);

  if (!cbs || cbs.length === 0) {
    depthReqMap.set("norm-" + symbol, [cb]);
  } else {
    cbs.push(cb);
  }

  addToSendQueue(payload, false);
  //normWS.send(payload);
}

export function getAndWatchOrderBook(symbol, token, getCB, watchCB) {
  if (!symbol || !getCB || !watchCB) {
    return;
  }

  getOrderBook(symbol, getCB);
  watchOrderBook(symbol, watchCB, token);
}

//This function manages sending payload via websocket to prevent too many reuest in short time.
async function addToSendQueue(payload, isStream) {
  let socketToUse = normWS;
  let bufferToUse = normRequestBuffer;

  if (isStream) {
    socketToUse = streamWS;
    bufferToUse = streamRequestBuffer;
  }

  bufferToUse.push(payload);
  if (bufferToUse.length === 1) {
    while (bufferToUse.length > 0) {
      socketToUse.send(bufferToUse[0]);
      //avoid spam calling
      let delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(200);
      bufferToUse.shift();
    }
  }
}

//function to list what we are subscribed to currently.
export function listSubs() {
  if (streamWS.readyState != streamWS.OPEN) {
    console.log("Stream WS not open and ready.");
    return;
  }

  let payload = JSON.stringify({
    method: "LIST_SUBSCRIPTIONS",
    id: 4,
  });

  addToSendQueue(payload, true);
}
