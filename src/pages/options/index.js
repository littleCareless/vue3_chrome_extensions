import { createApp } from "vue";
import Antd from "ant-design-vue";
import App from "./App/App.vue";
import "ant-design-vue/dist/antd.css";

createApp(App)
  .use(Antd)
  .mount("#app");
