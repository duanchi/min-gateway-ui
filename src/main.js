import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import Component from 'vue-class-component'

import './assets/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/icons.min.css'
import './assets/css/app.min.css'
import AuthorizeService from '@/services/authorize'

Vue.use(BootstrapVue)

Vue.config.productionTip = false

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

router.beforeEach((to, from, next) => {
  if (!window.location.pathname.startsWith('/authorize')) {
    const configs = AuthorizeService.parseConfig()
    if (configs === null || Object.keys(configs).length === 0) {
      window.location.href = '/authorize'
    }
  }
  next()
})

const vue = new Vue({
  router,
  render: h => h(App)
})

window.vue = vue
vue.$mount('#app')
export { vue }
