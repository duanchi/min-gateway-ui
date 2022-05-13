import { RestfulApi, Request } from '../api/decorator/restful'
import Restful from '../api/restful'

export default new
@RestfulApi({
  name: 'authorize'
})
class Authorize extends Restful {
  setToken (token, remember = false) {
    window.localStorage.setItem('gateway-console-api-remember-access-token', remember ? 'true' : 'false')

    if (remember) {
      window.localStorage.setItem('gateway-console-api-access-token', token)
    } else {
      window.sessionStorage.setItem('gateway-console-api-access-token', token)
    }
  }

  getToken () {
    /* const isRemember = window.localStorage.getItem('gateway-console-api-remember-access-token')
    return isRemember === 'true' ? window.localStorage.getItem('gateway-console-api-access-token') : window.sessionStorage.getItem('gateway-console-api-access-token') */
    return window.localStorage.getItem('gateway-console-api-access-token')
  }

  removeToken () {
    window.localStorage.removeItem('gateway-console-api-access-token')
    window.sessionStorage.removeItem('gateway-console-api-access-token')
  }

  setConfig (config) {
    localStorage.setItem('gateway-console-api-configs', JSON.stringify(config))
  }

  parseConfig () {
    let configs = {}
    const configString = localStorage.getItem('gateway-console-api-configs')
    if (configString !== '') {
      try {
        configs = JSON.parse(configString)
      } catch (e) {}
    }
    return configs
  }

  @Request({
    method: 'GET',
    path: ''
  })
  check () {}
}()
