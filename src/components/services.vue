<template>
  <div>
  <layout-header />

  <!-- ============================================================== -->
  <!-- Start Page Content here -->
  <!-- ============================================================== -->

  <div class="wrapper">
    <b-container fluid>
      <!-- start page title -->
      <b-row>
        <b-col cols="12">
          <div class="page-title-box">
            <div class="page-title">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><a href="javascript: void(0);">Min Gateway</a></li>
                <li class="breadcrumb-item">配置</li>
                <li class="breadcrumb-item active">微服务配置</li>
              </ol>
            </div>
          </div>
        </b-col>
      </b-row>
      <!-- end page title -->
      <b-row>
        <b-col cols="9" lg="9" sm="12">
          <div class="card-box">
            <b-button class="float-right" variant="outline-primary" v-b-modal.modal-add-service><span><i class="mdi mdi-library-plus" /> 新增微服务</span></b-button>
            <h4 class="header-title">网关微服务列表</h4>
            <p class="sub-header mb-0">
              所有Min Gateway网关配置的微服务列表
            </p>
          </div>

          <b-row>
            <b-col :key="index" v-for="(service, index) in serviceList" cols="12" xl="3" lg="3" md="4" sm="6">
              <div class="card-box p-3">
                <h4 class="header-title">{{service.name}}</h4>
                <h3 class="mb-1 mt-4"><span class="text-primary">{{service.instances.length || 0}}</span> 个实例</h3>
                <template v-if="service.instances.length">
                  <footer :key="index" v-for="(instance, index) in service.instances" class="blockquote-footer">{{instance.uri}}</footer>
                </template>
                <hr>
                <b-row class="pt-1">
                  <b-col cols="12">
                    <b-button class="float-right" variant="outline-danger" size="sm" @click="remove(service.id)">删除</b-button>
                    <b-button class="float-right mr-2" variant="outline-secondary" size="sm" @click="getServiceIntoModal(index, 'edit');$bvModal.show('modal-add-service')">修改</b-button>
                    <b-button class="float-right mr-2" variant="outline-secondary" size="sm" @click="getServiceIntoModal(index, 'view');$bvModal.show('modal-view-service')">查看</b-button>
                  </b-col>
                </b-row>
              </div>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="3" lg="3" sm="12">
          <side-reports :routes-count="routeList.length" :services-count="serviceList.length" />
        </b-col>
      </b-row>
    </b-container>
  </div>
  <!-- end wrapper -->
    <layout-footer />
    <b-modal id="modal-add-service" size="lg" title="新增微服务">
      <template v-slot:default="{}">
        <b-row>
          <b-col cols="10" offset="1">
            <b-form class="form-horizontal">
              <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="name">服务名称</label>
                <div class="col-sm-10">
                  <input type="text" id="name" class="form-control" placeholder="微服务应用名称" v-model="createService.name">
                </div>
              </div>
              <hr>
              <div class="form-group row">
                <label class="col-2 col-form-label" for="instance">服务实例</label>
                <b-col cols="10" id="instance">
                  <b-row :key="'instance-' + index" v-for="(instance, index) in createService.instances" class="mb-2">
                    <b-col cols="12">
                      <b-input-group>
                        <b-input-group-prepend>
                          <span class="input-group-text">
                            <i v-if="instance.is_ephemeral" class="remixicon-links-fill"></i>
                            <i v-else class="remixicon-pencil-line"></i>
                          </span>
                        </b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="http://" :disabled="instance.is_ephemeral" v-model="createService.instances[index].uri">
                        <b-input-group-append>
                          <b-button variant="outline-danger" @click="removeInstancePlaceholder(index)">删除</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-button variant="outline-primary" @click="addInstancePlaceholder()">添加实例</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </div>

              <div class="form-group row">
                <label class="col-2 col-form-label" for="instance">灰度实例</label>
                <b-col cols="10" id="gray">
                  <b-row :key="'gray-' + index" v-for="(gray, index) in createService.gray" class="mb-2">
                    <b-col cols="12">
                      <b-input-group>
                        <b-input-group-prepend>
                          <span class="input-group-text">
                            <i v-if="gray.is_ephemeral" class="remixicon-links-fill"></i>
                            <i v-else class="remixicon-pencil-line"></i>
                          </span>
                        </b-input-group-prepend>
                        <b-input-group-prepend>
                          <span class="input-group-text">{{ createService.gray[index].id }}</span>
                        </b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="http://" :disabled="gray.is_ephemeral" v-model="createService.gray[index].uri">
                        <b-input-group-append>
                          <b-button variant="outline-danger" @click="removeGrayPlaceholder(index)">删除</b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col cols="12">
                      <b-button variant="outline-primary" @click="addGrayPlaceholder()">添加实例</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </div>

            </b-form>
          </b-col>
        </b-row>
      </template>
      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="success" @click="createOrUpdate(ok)">
          {{updateId !== '' ? '确认修改' : '确认添加'}}
        </b-button>
        <b-button variant="link" @click="cancel();getServicesItems;resetModal()">
          取消
        </b-button>
      </template>
    </b-modal>
    <b-modal id="modal-view-service" size="lg" title="查看微服务">
      <template v-slot:default="{}">
        <b-row>
          <b-col cols="10" offset="1">
            <b-form class="form-horizontal">
              <div class="form-group row">
                <label class="col-sm-2 col-form-label" for="name">服务名称</label>
                <div class="col-sm-10">
                  <p class="form-control-plaintext">{{ viewService.name }}</p>
                </div>
              </div>
              <hr>
              <div class="form-group row">
                <label class="col-2 col-form-label" for="instance">服务实例</label>
                <b-col cols="10" id="instance">
                  <b-row :key="'instance-' + index" v-for="(instance, index) in viewService.instances" class="mb-2">
                    <b-col cols="12">
                      <b-input-group>
                        <b-input-group-prepend>
                          <span class="input-group-text">
                            <i v-if="instance.is_ephemeral" class="remixicon-links-fill"></i>
                            <i v-else class="remixicon-pencil-line"></i>
                          </span>
                        </b-input-group-prepend>
                        <input type="text" class="form-control" disabled v-model="instance.uri">
                      </b-input-group>
                    </b-col>
                  </b-row>
                </b-col>
              </div>

              <div class="form-group row">
                <label class="col-2 col-form-label" for="instance">灰度实例</label>
                <b-col cols="10" id="gray">
                  <b-row :key="'gray-' + index" v-for="(gray, index) in viewService.gray" class="mb-2">
                    <b-col cols="12">
                      <b-input-group>
                        <b-input-group-prepend>
                          <span class="input-group-text">
                            <i v-if="gray.is_ephemeral" class="remixicon-links-fill"></i>
                            <i v-else class="remixicon-pencil-line"></i>
                          </span>
                        </b-input-group-prepend>
                        <b-input-group-prepend>
                          <span class="input-group-text">{{ gray.id }}</span>
                        </b-input-group-prepend>
                        <input type="text" class="form-control" placeholder="http://" disabled v-model="createService.gray[index].uri">
                      </b-input-group>
                    </b-col>
                  </b-row>
                </b-col>
              </div>

            </b-form>
          </b-col>
        </b-row>
      </template>
      <template v-slot:modal-footer="{ ok, cancel, hide }">
        <!-- Emulate built in modal footer ok and cancel button actions -->
        <b-button variant="success" @click="createOrUpdate(ok)">
          {{updateId !== '' ? '确认修改' : '确认添加'}}
        </b-button>
        <b-button variant="link" @click="cancel();getServicesItems;resetModal()">
          取消
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import LayoutHeader from './layout/layout-header'
import services from '../services/services'
import routes from '../services/routes'
import LayoutFooter from './layout/layout-footer'
import SideReports from './side-reports'
import { v4 as uuidv4 } from 'uuid'

export default
@Component({
  components: { SideReports, LayoutFooter, LayoutHeader }
})
class Services extends Vue {
  updateId = ''
  createService = {
    name: '',
    load_balance: 'pool',
    instances: [
      { uri: '', id: '', is_online: true, is_ephemeral: false }
    ],
    gray: []
  }

  viewService = {
    name: '',
    load_balance: 'pool',
    instances: [
      { uri: '', id: '', is_online: true, is_ephemeral: false }
    ],
    gray: []
  }

  serviceList = []
  routeList = []

  async getServicesItems () {
    const serviceList = await services.getList()
    this.serviceList = serviceList
    return serviceList
  }
  getServiceIntoModal (index, type) {
    if (type === 'view') {
      this.viewService = this.serviceList[index]
    } else {
      if (undefined !== this.serviceList[index]) {
        if (!this.serviceList[index].gray) {
          this.serviceList[index].gray = [{
            uri: '',
            id: uuidv4()
          }]
        }
        this.createService = this.serviceList[index]
        this.updateId = this.serviceList[index].id
      }
    }
  }
  addInstancePlaceholder () {
    this.createService.instances.push({ uri: '', id: '', is_online: true, is_ephemeral: false })
    this.$forceUpdate()
  }
  addGrayPlaceholder () {
    this.createService.gray.push({
      uri: '',
      id: uuidv4()
    })
    this.$forceUpdate()
  }
  removeInstancePlaceholder (index) {
    this.createService.instances.splice(index, 1)
    this.$forceUpdate()
  }
  removeGrayPlaceholder (index) {
    this.createService.gray.splice(index, 1)
    this.$forceUpdate()
  }
  async createOrUpdate (callback) {
    if (this.updateId !== '') {
      await services.update(this.updateId, this.createService)
    } else {
      await services.create(this.createService)
    }
    callback()
    this.updateId = ''
    this.resetModal()
    this.getServicesItems()
  }
  async remove (id) {
    const value = await this.$bvModal.msgBoxConfirm('确认删除该微服务?', {
      title: '确认删除微服务',
      size: 'sm',
      buttonSize: 'sm',
      okVariant: 'danger',
      okTitle: '确认删除',
      cancelTitle: '取消',
      footerClass: 'p-2',
      hideHeaderClose: true,
      centered: true
    })

    if (value) {
      services.remove(id).then(() => this.getServicesItems())
    }
  }
  resetModal () {
    /* this.updateId = ''
    this.createService = {
      name: '',
      load_balance: 'pool',
      instances: [
        { uri: '', id: '' }
      ]
    } */
    window.location.reload()
  }

  async mounted () {
    this.getServicesItems()
    this.routeList = await routes.getList()
  }
}
</script>
