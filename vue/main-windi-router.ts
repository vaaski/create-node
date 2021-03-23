import { createApp } from "vue"
import App from "@/app.vue"
import router from "@/router"
import "virtual:windi.css"

createApp(App).use(router).mount("#app")
