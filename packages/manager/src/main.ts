import 'element-plus/dist/index.css';
import '@/assets/styles/index.scss';
import { createApp } from 'vue';
import App from '@/App.vue';
import { router } from '@/route/index';

const app = createApp(App);
app.use(router).mount('#app');
