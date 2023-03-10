<template>
  <div class="leads-container" v-if="response">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card ma--bottom-1">
          <div class="card-header">
            <div class="btn--group">
              <button
                class="btn btn--primary"
                @click="toggleDownloadFileModel = true"
                v-if="selectedLeads.length"
              >
                <i class="fa fa-download btn--icon__prefix"></i>
                <span class="btn--name">Download</span>
              </button>

              <button
                class="btn btn--success ma--x-1"
                v-if="selectedLeads.length"
                @click="togglePurchaseModel = true"
              >
                <i class="fa fa-shopping-cart btn--icon__prefix"></i>
                <span class="btn--name">Repurchase</span>
              </button>

              <PurchaseLeads
                v-if="togglePurchaseModel"
                :selectedLeads="leads"
                :purchasedLead="purchasedLead"
                :siteId="siteId"
                purchaseType="repurchaseLead"
                @close="closeModel($event)"
                @purchase="updatePurchaseModel"
              />

              <AdditionalDetails
                v-if="toggleDetailsModel"
                :details="details"
                @close="closeDetailsModel($event)"
              />
              <DownloadFile
                @close="onCloseDownloadModel"
                @download="downloadFile($event)"
                v-if="toggleDownloadFileModel"
              />
            </div>
          </div>
          <div class="card-content">
            <table class="table table--hover" v-if="response">
              <thead class="table--header">
                <tr>
                  <th>
                    <input type="checkbox" v-model="selectTotalLeads" />
                  </th>
                  <th class="text--align-left">Zipcode</th>
                  <th class="text--align-left">State</th>
                  <th class="text--align-left">City</th>
                  <th class="text--align-left">First Name</th>
                  <th class="text--align-left">Last Name</th>
                  <th class="text--align-left">Email</th>
                  <th class="text--align-left">Phone</th>
                  <th class="text--align-left">Status</th>
                  <th class="text--align-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td>
                    <input
                      type="checkbox"
                      v-model="selectedLeads"
                      :value="item"
                      :disabled="item.status != 'FULLFILLED'"
                    />
                  </td>
                  <td class="text--align-left">{{ item.zipcode }}</td>
                  <td class="text--align-left">{{ item.state }}</td>
                  <td class="text--align-left">{{ item.city }}</td>
                  <td class="text--align-left">{{ item.firstName }}</td>
                  <td class="text--align-left">{{ item.lastName }}</td>
                  <td class="text--align-left">{{ item.email }}</td>
                  <td class="text--align-left">{{ item.phone }}</td>
                  <td
                    class="text--align-left legend__item"
                    :class="{
                      'before--color-blue2': item.status == 'FULLFILLED',
                      'before--color-red1': item.status != 'FULLFILLED',
                    }"
                  >
                    {{ item.status == "FULLFILLED" ? "Available" : "Pending" }}
                  </td>
                  <td class="text--align-center">
                    <button
                      class="btn--inline btn--success"
                      style="background-color: #3d96e6"
                      @click="showDetails(item)"
                    >
                      <i class="fa fa-external-link-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="response.data.length == 0 && !request._loading">
                  <td colspan="11">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              :totalResults="response.pageInfo.totalResults"
              :totalPages="response.pageInfo.totalPages"
              :showPage="response.data.length"
              @applyPagination="controlWithPagination"
              v-if="response"
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

import { ILeadsService } from "@/service";
import {
  DataResponse,
  LeadsRequestModel,
  LeadsModel,
  PurchasedLeadsModel,
  AdditionalDetailsModel,
} from "@/model";

import PurchaseLeads from "../components/PurchaseLeads.vue";
import AdditionalDetails from "../components/AdditionalDetailsModel.vue";
import DownloadFile from "./components/DownloadFile.vue";
import Pagination from "../../../components/controls/Pagination.vue";

@Options({
  components: {
    PurchaseLeads,
    AdditionalDetails,
    DownloadFile,
    Pagination,
  },
})
export default class PurchasedLeads extends Vue {
  @Inject("leadsService") service: ILeadsService;

  public store = useStore();
  public subscription: any = null;

  public selectedLeads: Array<any> = [];

  public togglePurchaseModel: boolean = false;
  public toggleDetailsModel: boolean = false;
  public toggleDownloadFileModel: boolean = false;

  public request = new LeadsRequestModel();
  public response: DataResponse<LeadsModel> = new DataResponse();
  public details: Array<AdditionalDetailsModel> = [];

  created() {
    this.getLeads();
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getLeads();
    });
  }

  unmounted() {
    if (this.subscription) this.subscription();
  }

  private getLeads() {
    this.request._loading = true;
    this.request.siteId = this.store.getters.getSiteId;
    this.service.getPurchangedLeads(this.request).then((response) => {
      this.request._loading = false;
      this.response = response;
    });
  }

  public controlWithPagination(page: number, pageSize: number) {
    this.request.page = page;
    this.request.pageSize = pageSize;
    this.getLeads();
  }

  closeModel(value: boolean) {
    this.togglePurchaseModel = value;
  }

  updatePurchaseModel() {
    this.togglePurchaseModel = false;
    this.store.dispatch("updateCredits");
    this.getLeads();
    this.selectedLeads = [];
    this.store.dispatch("showSnack", {
      message: "Leads purchased sucessfully",
      snackBarClass: "snack--bar__success",
    });
  }

  public showDetails(item: PurchasedLeadsModel) {
    this.details = [];
    this.details.push({ fieldName: "First name", fieldValue: item.firstName });
    this.details.push({ fieldName: "Last name", fieldValue: item.lastName });
    this.details.push({ fieldName: "Email", fieldValue: item.email });
    this.details.push({ fieldName: "Phone", fieldValue: item.phone });
    this.details.push(...item.additionalDetails);
    this.toggleDetailsModel = true;
  }

  public closeDetailsModel() {
    this.toggleDetailsModel = false;
  }

  public downloadFile(format: string) {
    this.service.exportFile(format, this.siteId);
    this.onCloseDownloadModel();
    this.selectedLeads = [];
  }

  public onCloseDownloadModel() {
    this.toggleDownloadFileModel = false;
  }

  get selectTotalLeads() {
    return this.selectedLeads.length > 0 &&
      this.response.data.length > 0 &&
      this.selectedLeads.length == this.response.data.length
      ? true
      : false;
  }

  set selectTotalLeads(value) {
    const selected: any[] = [];
    if (value)
      this.response.data.forEach((row) => {
        selected.push(row);
      });

    this.selectedLeads = selected;
  }

  get leads() {
    const leads = this.selectedLeads.reduce((a, o) => (a.push(o.id), a), []);
    return leads;
  }

  get purchasedLead() {
    const leads = this.selectedLeads.reduce(
      (a, o) => (a.push(o.purchasedLead), a),
      []
    );
    return leads;
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }
}
</script>