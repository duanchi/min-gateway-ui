<template>
  <header id="topnav">

    <!-- Topbar Start -->
    <div class="navbar-custom">
      <!-- LOGO -->
      <div class="logo-box">
        <a href="/" class="logo text-center">
            <span class="logo-lg">
              <span class="logo-lg-text-light">Min Gateway</span>
            </span>
          <span class="logo-sm">
              <span class="logo-sm-text-dark">Min Gateway</span>
            </span>
        </a>
      </div>

      <ul class="list-unstyled topnav-menu float-right m-0">
        <li class="dropdown d-none d-lg-block">
          <a class="nav-link dropdown-toggle mr-0 waves-effect waves-light" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
            <span class="align-middle">{{ currentConfigIndex || '新增网关' }} <i class="mdi mdi-chevron-down"></i> </span>
          </a>
          <div class="dropdown-menu dropdown-menu-right">
            <!-- item-->
            <a v-for="(config, index) in configs" :key="`config-${index}`" href="javascript:void(0);" class="dropdown-item position-relative" @click="switchConfig(config.url)">
              <span class="align-middle mr-3">{{ config.url }}</span>
              <i class="fe-x position-absolute" style="right: .5rem; top: .625rem;" @click.stop="removeConfig(config.url)" />
            </a>
            <div class="dropdown-divider"></div>
            <!-- item-->
            <a href="javascript:void(0);" class="dropdown-item" v-b-modal.modal-add-config>
              <i class="mdi mdi-library-plus mr-1" /><span class="align-middle">新增网关配置</span>
            </a>
          </div>
        </li>
        <li class="dropdown notification-list">
          <a href="#" @click.prevent="logout" class="nav-link right-bar-toggle waves-effect waves-light">
            <i class="fe-log-out"></i> 注销
          </a>
        </li>
      </ul>
      <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
        <li class="active"><a class="nav-link dropdown-toggle waves-effect waves-light" href="#" @click.prevent role="button" aria-haspopup="false" aria-expanded="false">配置</a></li>
      </ul>
      <div class="clearfix"></div>
    </div>
    <!-- end Topbar -->

    <div class="topbar-menu">
      <div class="container-fluid">
        <div id="navigation">
          <!-- Navigation Menu-->
          <ul class="navigation-menu">
            <router-link to="/routes" v-slot="{ href, route, navigate, isActive, isExactActive }">
              <li :class="['has-submenu', {'active': isActive}]"><a :class="{'active': isActive}" :href="href" @click="navigate"><i class="remixicon-dashboard-line"></i>路由配置</a></li>
            </router-link>
            <router-link to="/services" v-slot="{ href, route, navigate, isActive, isExactActive }">
              <li :class="['has-submenu', {'active': isActive}]"><a :class="{'active': isActive}" :href="href" @click="navigate"><i class="remixicon-stack-line"></i>服务配置</a></li>
            </router-link>
            <router-link to="/integration" v-slot="{ href, route, navigate, isActive, isExactActive }">
              <li :class="['has-submenu', {'active': isActive}]"><a :class="{'active': isActive}" :href="href" @click="navigate"><i class="remixicon-terminal-box-line"></i>接口集成</a></li>
            </router-link>
          </ul>
          <!-- End navigation menu -->

          <div class="clearfix"></div>
        </div>
        <!-- end #navigation -->
      </div>
      <!-- end container -->
    </div>
    <!-- end navbar-custom -->
    <b-modal id="modal-add-config" centered hide-footer>
      <template #modal-title>新增网关配置</template>
      <template #default="{ hide }">
        <form class="p-4" action="#">

          <div class="form-group mb-3">
            <b-input class="form-control" placeholder="网关URL" v-model="createConfig.url" />
          </div>
          <div class="form-group mb-3">
            <textarea class="form-control" rows="3" v-model="createConfig.token" placeholder="ACCESS TOKEN可以在网关部署时的环境变量中获取"></textarea>
          </div>
          <div class="form-group mb-0 text-center form-row">
            <b-col cols="6"><button class="btn btn-primary btn-block" @click.prevent="addConfig"> 确定 </button></b-col>
            <b-col cols="6"><button class="btn btn-outline-primary btn-block" @click.prevent="hide"> 关闭 </button></b-col>
          </div>
        </form>
      </template>
    </b-modal>
  </header>
  <!-- End Navigation Bar-->
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import AuthorizeService from '../../services/authorize'
import { setDefaults } from '@/api'

@Component
class LayoutHeader extends Vue {
  createConfig = {
    url: '',
    token: ''
  }

  currentConfigIndex = ''
  configs = {}

  async checkAuthorize () {
    await AuthorizeService.check()
  }

  async logout () {
    await AuthorizeService.removeToken()
    this.$router.push('/authorize')
  }

  async resetAuthorize () {
    await AuthorizeService.removeToken()
    this.$router.push('/authorize')
  }

  addConfig () {
    if (this.createConfig.url !== '') {
      this.configs[this.createConfig.url] = {
        url: this.createConfig.url,
        token: this.createConfig.token
      }

      this.saveConfig()
      this.currentConfigIndex = this.createConfig.url
      this.createConfig = {
        url: '',
        token: ''
      }
    }
  }

  saveConfig () {
    AuthorizeService.setConfig(this.configs)
    localStorage.setItem('gateway-console-api-config-index', this.currentConfigIndex)
  }

  removeConfig (url) {
    delete this.configs[url]
    this.saveConfig()
    console.log(Object.keys(this.configs))
    if (Object.keys(this.configs).length > 0) {
      this.switchConfig(Object.keys(this.configs)[0])
    } else {
      this.$router.push('/authorize')
    }
  }

  switchConfig (url) {
    if (this.configs[url]) {
      this.currentConfigIndex = url
      localStorage.setItem('gateway-console-api-config-index', this.currentConfigIndex)
      localStorage.setItem('gateway-console-api-access-token', this.configs[url].token)

      setDefaults(defaults => {
        defaults.prefix = url + '/_api'
        /* defaults.fallback = (error, resolve, reject) => {
          if (error?.status === 401 || error?.response?.status === 401) {
            if (vue.$route.name !== 'authorize') {
              vue.$router.push('/authorize')
              resolve(true)
            } else {
              reject(error)
            }
          } else {
            reject(error)
          }
        } */
      })
    }
  }

  created () {
    this.configs = AuthorizeService.parseConfig()
    this.switchConfig(localStorage.getItem('gateway-console-api-config-index'))
  }
}

export default LayoutHeader
</script>
