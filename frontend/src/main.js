import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const app = createApp(App);

store.dispatch("loadAuthData");

app.use(store);
app.use(router);

app.mount("#app");