let streamEndPoint = "wss://stream.binance.us:9443/ws"; //alt port 9433
let normEndPoint = "wss://ws-api.binance.com:443/ws-api/v3";

let streamWS = new WebSocket(streamEndPoint);
let normWS = new WebSocket(normEndPoint);

let allSymbolID = "norm-allSymbols";

streamWS.addEventListener("error", (e) => {
  console.log("streamWS Error: ", e);
});

streamWS.addEventListener("open", (e) => {
  console.log("streamWS open: ", e);
  //watchTicker("btcusdt", test);
  //watchAllTickers();
});

streamWS.addEventListener("close", (e) => {
  console.log("streamWS close: ", e);
});

streamWS.addEventListener("message", (e) => {
  processReceivedMSG(e);
});

normWS.addEventListener("error", (e) => {
  console.log("streamWS Error: ", e);
});

normWS.addEventListener("open", (e) => {
  console.log("streamWS open: ", e);
  getAllSymbols();
});

normWS.addEventListener("close", (e) => {
  console.log("streamWS close: ", e);
});

normWS.addEventListener("message", (e) => {
  processReceivedMSG(e);
});

//we want to get ticker data

let watchList = [];
let tickerCallback;

function symbolValidator(symbol) {
  if (!symbol || typeof symbol !== "string") {
    return false;
  }

  return true;
}

function watchTicker(symbol, callback) {
  if (streamWS.readyState != streamWS.OPEN) {
    console.log("Websocket is not connected. Please try connecting first");
    return false;
  }

  if (!symbol || typeof symbol !== "string") {
    return false;
  }

  if (!callback && watchList.length == 0) {
    console.log("Need a callback function to call on ticker data");
    return false;
  }

  if (callback && watchList.length > 0) {
    console.log("We already have callback function, this will be ignored");
  }

  if (watchList.includes(symbol)) {
    console.log("Already watching symbol: " + symbol);
    return false;
  }

  //store the callback

  let sdata = JSON.stringify({
    id: 1,
    method: "SUBSCRIBE",
    params: [symbol + "@aggTrade"],
  });

  streamWS.send(sdata);

  if (watchList.length == 0) {
    tickerCallback = callback;
  }
  watchList.push(symbol);
}

function unwatchTicker(symbol) {
  if (!symbol) {
    return;
  }

  let index = watchList.indexOf(symbol);
  if (index > -1) {
    let sdata = JSON.stringify({
      id: 2,
      method: "UNSUBSCRIBE",
      params: [symbol + "@aggTrade"],
    });

    streamWS.send(sdata);

    watchList.splice(index, 1);

    if (watchList.length == 0) {
      tickerCallback = null;
    }
  }
}

function watchAllTickers() {
  //!miniTicker@arr

  let sdata = JSON.stringify({
    id: 3,
    method: "SUBSCRIBE",
    params: ["!miniTicker@arr"],
  });

  streamWS.send(sdata);
}

function unwatchAllTickers() {
  let sdata = JSON.stringify({
    id: 3,
    method: "UNSUBSCRIBE",
    params: ["!miniTicker@arr"],
  });

  streamWS.send(sdata);
}

function getAllSymbols() {
  if (normWS.readyState != normWS.OPEN) {
    console.log(
      "Normal websocket is not connected. Please connect or wait for it to connect"
    );
    return;
  }

  let payload = JSON.stringify({
    id: "norm-allsymbols",
    method: "exchangeInfo",
    params: {
      permissions: "SPOT",
    },
  });

  normWS.send(payload);
}

function processReceivedMSG(e) {
  if (typeof e.data == typeof "a") {
    e.parsedData = JSON.parse(e.data);
    console.log("Parsed data: " + new Date().toString() + " :", e.parsedData);
  }

  if (e.parsedData.id == allSymbolID) {
    //just get USDT quoted pair names
    let nameArray = {
      id: allSymbolID,
      symbols: [],
    };
    e.parsedData.results.symbols.forEach((element) => {
      if (element.quoteAsset == "USDT") {
        nameArray.symbols.push(symObj);
      }
    });

    //callback that array
    getSymbolsCB(nameArray);
  }
}

function getSymbolsCB(symbolData) {
  //now store that symbol data, create buttons and bars accordingly,
  // also make list of top coin pair to always show
  symbolData[topSymbols] = [
    "BTCUSDT",
    "BNBUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "ADAUSDT",
    "AVAXUSDT",
    "TRXUSDT",
    "BCHUSDT",
    "NEARUSDT",
    "LINKUSDT",
    "MATICUSDT",
    "LTCUSDT",
    "PEPEUSDT",
    "ATOMUSDT",
  ];
}
