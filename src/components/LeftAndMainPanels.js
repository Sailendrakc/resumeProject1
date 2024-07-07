import LeftPanel from "./LeftPanel.js";
import ChartPanel from "./ChartPanel.js";
import { DepthPanel } from "./DepthPanel.js";

//https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates

export default function LeftAndMainPanels() {
  return (
    <div id="leftAndMainPanels">
      <LeftPanel />
      <ChartPanel />
      <DepthPanel />
    </div>
  );
}
