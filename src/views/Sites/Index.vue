<template>
  <div class="ma--top-1 sites--container">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <button
              class="btn btn--primary"
              @click="toggleCreateSiteModel = true"
            >
              <i class="fa fa-plus btn--icon__prefix"></i>
              <span class="btn--name">Add Site</span>
            </button>
          </div>
          <div class="card-content">
            <table class="table table--hover">
              <thead class="table--header">
                <tr>
                  <th class="text--align-left" style="width: 30%">Name</th>
                  <th class="text--align-left" style="width: 30%">Url</th>
                  <th class="text--align-left">Status</th>
                  <th class="text--align-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td class="text--align-left">{{ item.siteName }}</td>
                  <td class="text--align-left">{{ item.siteUrl }}</td>
                  <td
                    class="text--align-left legend__item"
                    :class="{
                      'before--color-blue2': item.status == 'APPROVED',
                      'before--color-red1': item.status == 'UNAPPROVED',
                    }"
                  >
                    {{ item.status }}
                  </td>
                  <td class="text--align-center">
                    <button
                      class="btn--inline btn--edit"
                      @click="generatePixel(item.id)"
                      data-tooltip="Generate Pixel tracking"
                    >
                      <i class="fa fa-code"></i>
                    </button>
                    <button
                      class="btn--inline btn--delete"
                      @click="openDeleteSiteModel(item.id, item.siteName)"
                      data-tooltip="Delete site"
                      v-if="item.status == 'APPROVED'"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="response.data.length == 0">
                  <td colspan="4">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              :totalResults="response.pageInfo.totalResults"
              :totalPages="response.pageInfo.totalPages"
              :showPage="response.data.length"
              v-if="response"
              @applyPagination="controlWithPagination"
            />
            <CreatSite
              v-if="toggleCreateSiteModel"
              @closeSiteModel="onCloseSiteModel"
            />

            <PixelTracking
              :pixelId="pixelId"
              v-if="togglePixelSiteModel"
              @closePixel="closePixelModel"
            />

            <Delete
              title="Delete Site"
              message="site"
              :name="siteName + ' site'"
              @closeModel="onCloseDeleteModel"
              v-if="toggleDeleteSiteModel"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { ISitesService } from "@/service";
import {
  DataResponse,
  SitesRequestModel,
  SitesModel,
  PixelSiteRequestModel,
} from "@/model";

import Pagination from "@/components/controls/Pagination.vue";
import CreatSite from "./components/CreateSite.vue";
import PixelTracking from "./components/Tracking.vue";
import Delete from "@/components/Model/DeleteModel.vue";

@Options({
  components: {
    Pagination,
    CreatSite,
    PixelTracking,
    Delete,
  },
})
export default class Sites extends Vue {
  @Inject("sitesService") service: ISitesService;

  public store = useStore();

  public toggleCreateSiteModel: boolean = false;
  public toggleDeleteSiteModel: boolean = false;
  public togglePixelSiteModel: boolean = false;

  public siteName: string = "";
  public siteId: number = 0;
  public pixelId: any = "";

  public request = new SitesRequestModel();
  public response: DataResponse<SitesModel> = new DataResponse();

  mounted() {
    this.getAllSites();
  }

  public getAllSites() {
    this.request._loading = true;
    this.service.getSites(this.request).then((response) => {
      this.request._loading = false;
      this.response = response;
    });
  }

  public controlWithPagination(page: number, pageSize: number) {
    this.request.page = page;
    this.request.pageSize = pageSize;
    this.getAllSites();
  }

  public onCloseSiteModel(trigger: boolean) {
    this.toggleCreateSiteModel = false;
    if (trigger) this.getAllSites();
  }

  public generatePixel(siteId: number) {
    const request = new PixelSiteRequestModel();
    request.siteId = siteId;
    this.service.generatePixel(request).then((response) => {
      this.pixelId = `<img src="${response}" style="display:none" alt="Pixel Image"/>`;
      this.togglePixelSiteModel = true;
    });
  }

  public closePixelModel() {
    this.togglePixelSiteModel = false;
  }

  public openDeleteSiteModel(id: number, siteName: string) {
    this.toggleDeleteSiteModel = true;
    this.siteId = id;
    this.siteName = siteName;
  }

  private onCloseDeleteModel(trigger: boolean) {
    this.toggleDeleteSiteModel = false;
    this.siteName = "";
    if (trigger) this.deleteSite();
  }

  public deleteSite() {
    this.service.deleteSite(this.siteId).then((response) => {
      this.store.dispatch("showAlert", {
        message: "Site deleted sucessfully",
        snackBarClass: "fa-check",
        type: "success",
      });
      this.toggleDeleteSiteModel = false;
      this.siteId = 0;
      this.siteName = "";
      this.getAllSites();
    });
  }
}
</script>