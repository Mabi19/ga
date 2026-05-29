import {
    CategoryScale,
    Chart,
    Filler,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";

let isInit = false;
export function initCharts() {
    if (isInit) {
        return;
    }

    Chart.register([
        LineController,
        CategoryScale,
        LinearScale,
        LineElement,
        PointElement,
        Tooltip,
        Filler,
    ]);
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";

    isInit = true;
}
