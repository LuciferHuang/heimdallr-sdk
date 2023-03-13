import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import heimdallr from '../../packages/browser/esm'
import vuePlugin from '../../packages/vue/esm'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// init heimdallr-sdk
heimdallr({
  dsn: {
    host: 'localhost:8001',
    init: '/project/init',
    upload: '/log/upload'
  },
  app: {
    name: 'playground',
    leader: 'LuciferHuang',
    desc: 'playground vue3 project'
  },
  plugins: [vuePlugin],
  vue: app
})
