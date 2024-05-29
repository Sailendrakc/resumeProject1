let streamEndPoint = "wss://stream.binance.us:9443/ws"; //alt port 9433
let normEndPoint = "wss://ws-api.binance.com:443/ws-api/v3";

let streamWS = new WebSocket(streamEndPoint);
let normWS = new WebSocket(normEndPoint);

let allSymbolID = "norm-allSymbols";
let allSymbolsReqCB = null;
let allSymbolObj = null;

//https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#aggregate-trade-streams

streamWS.addEventListener("error", (e) => {
  console.log("streamWS Error: ", e);
});

streamWS.addEventListener("open", (e) => {
  console.log("streamWS open: ", e);
  console.log("Stream websocket connected");
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
  console.log("Normal websocket connected");
});

normWS.addEventListener("close", (e) => {
  console.log("streamWS close: ", e);
});

normWS.addEventListener("message", (e) => {
  processReceivedMSG(e);
});

//we want to get ticker data

let watchList = new Map();
let tickerCallback;

function symbolValidator(symbol) {
  if (!symbol || typeof symbol !== "string") {
    return false;
  }

  return true;
}

export async function watchTicker(requestKey, callback) {
  if (streamWS.readyState != streamWS.OPEN) {
    console.log("Websocket is not connected. Please try connecting first");
    return false;
  }

  if (!requestKey || typeof requestKey !== "string" || !callback) {
    return false;
  }

  //store the callback

  let sdata = JSON.stringify({
    id: 1,
    method: "SUBSCRIBE",
    params: [requestKey],
  });

  streamWS.send(sdata);
  let delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await delay(500);

  if (!watchList[requestKey]) {
    watchList[requestKey] = [callback];
    console.log("new cb added to watchlist");
  } else {
    watchList[requestKey].push(callback);
    console.log("new cb added to existing watchlist");
  }
}

export async function unwatchTicker(symbolKey) {
  if (!symbolKey) {
    return;
  }

  let index = watchList.indexOf(symbolKey);
  if (index > -1) {
    let sdata = JSON.stringify({
      id: 2,
      method: "UNSUBSCRIBE",
      params: [symbolKey],
    });

    streamWS.send(sdata);
    let delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await delay(500);
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

//Call this function to get all the symbols from binance exchange.
//We will get the symbols in callback fn
export async function getAllSymbols(callback) {
  let delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await delay(5000);

  if (normWS.readyState != normWS.OPEN) {
    console.log(
      "Normal websocket is not connected. Please connect or wait for it to connect"
    );
    return;
  }

  let payload = JSON.stringify({
    id: allSymbolID,
    method: "exchangeInfo",
    params: {
      permissions: "SPOT",
    },
  });

  allSymbolsReqCB = callback;
  normWS.send(payload);
}

function processReceivedMSG(e) {
  if (typeof e.data == typeof "a") {
    e.parsedData = JSON.parse(e.data);
    console.log("Parsed data: " + new Date().toString() + " :", e.parsedData);
  }

  //incoming data has info about all the symbols that we queiried with getAllSymbols() fn
  if (e.parsedData.id == allSymbolID) {
    if (!e.parsedData.result) {
      //its just confirmation response to request and not the actual result.
      return;
    }

    //just get USDT quoted pair names
    let nameArray = {
      id: allSymbolID,
      symbols: [],
      topSymbols: [],
    };
    e.parsedData.result["symbols"].forEach((element) => {
      if (element.quoteAsset == "USDT") {
        nameArray["symbols"].push(element);
      }
    });

    // also make list of top coin pair to always show
    nameArray["topSymbols"] = [
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

    allSymbolObj = nameArray;
    if (allSymbolsReqCB) {
      allSymbolsReqCB(nameArray);
    }
  }

  //if it is price data, 1 is price id, TODO, MAKE IT A VARIABLE
  if (e.parsedData.e == "trade") {
    //https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams#aggregate-trade-streams

    e.parsedData.p = parseFloat(e.parsedData.p).toString();
    let reqKey = e.parsedData.s.toLowerCase() + "@" + e.parsedData.e;
    let cbArray = watchList[reqKey];

    if (!cbArray || cbArray.length == 0) {
      //unsubscribe
      unwatchTicker(reqKey);
    }
    try {
      cbArray.forEach((cb) => {
        cb(e.parsedData);
      });
    } catch {
      debugger;
    }
  }
}
