import { React, useRef } from "react";
import FooterPanel from "./FooterPanel.js";
import LeftAndMainPanels from "./LeftAndMainPanels.js";
import { notifyContext } from "./notifyContext.js";
import { SpeedInsights } from "@vercel/speed-insights/react";

//This should provide context to all symbol list, watch and unwatch function to all childs.

export function App() {
  let chartPanelNotifierFn = useRef();
  let depthPanelNotifierFn = useRef();
  let currentChartedSymbol = useRef(); //so chartPanel and depthPanel can work during startup.

  return (
    <notifyContext.Provider
      value={{
        chartPanelNotifierFn: chartPanelNotifierFn,
        depthPanelNotifierFn: depthPanelNotifierFn,
        currentChartedSymbol: currentChartedSymbol,
      }}
    >
      <>
        <LeftAndMainPanels />
        <FooterPanel />
        <SpeedInsights />
      </>
    </notifyContext.Provider>
  );
}
