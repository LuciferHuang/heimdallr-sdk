import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import heimdallr from '../../packages/browser/esm'
import vuePlugin from '../../packages/vue/esm'
import domPlugin from '../../packages/dom/esm'
import xhrPlugin from '../../packages/xhr/esm'
import hashPlugin from '../../packages/hash/esm'
import historyPlugin from '../../packages/history/esm'
import recordPlugin from '../../packages/record/esm';

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
  plugins: [vuePlugin, domPlugin, xhrPlugin, hashPlugin, historyPlugin, recordPlugin],
  vue: app
})
