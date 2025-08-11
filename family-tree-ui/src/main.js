import { createApp } from 'vue'
import App from './App.vue'
import vNetworkGraph from "v-network-graph"
import "v-network-graph/lib/style.css"

const app = createApp(App)
app.use(vNetworkGraph)
app.mount('#app')
