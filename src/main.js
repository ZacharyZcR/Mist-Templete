import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import 'leaflet/dist/leaflet.css';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(router);
app.use(VueApexCharts);
app.mount("#app");
