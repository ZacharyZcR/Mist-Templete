import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import 'leaflet/dist/leaflet.css';
import VueApexCharts from "vue3-apexcharts";
import store from './store' // 引入store

const app = createApp(App);
app.use(store) // 使用 Vuex Store
app.use(router);
app.use(VueApexCharts);
app.mount("#app");
