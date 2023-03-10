<template>
  <div class="leads-container" v-if="response">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <button
              class="btn btn--success"
              @click="togglePurchaseModel = true"
              v-if="selectedLeads.length"
            >
              <i class="fa fa-shopping-cart btn--icon__prefix"></i>
              <span class="btn--name">Purchase</span>
            </button>
            <PurchaseLeads
              v-if="togglePurchaseModel"
              :selectedLeads="leads"
              :siteId="siteId"
              purchaseType="purchaseLead"
              @close="closeModel($event)"
              @purchase="updatePurchaseModel"
            />
          </div>
          <div class="card-content">
            <table class="table table--striped ma--top-1" v-if="response">
              <thead class="table--header">
                <tr>
                  <th>
                    <input type="checkbox" v-model="selectTotalLeads" />
                  </th>
                  <th class="text--align-left">State</th>
                  <th class="text--align-left">Zipcode</th>
                  <th class="text--align-left">City</th>
                  <th class="text--align-left">First Name</th>
                  <th class="text--align-left">Last Name</th>
                  <th class="text--align-left">Email</th>
                  <th class="text--align-left">Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td>
                    <input
                      type="checkbox"
                      v-model="selectedLeads"
                      :value="item"
                    />
                  </td>
                  <td class="text--align-left">{{ item.state }}</td>
                  <td class="text--align-left">{{ item.zipcode }}</td>
                  <td class="text--align-left" style="opacity: 0.2">
                    **********
                  </td>
                  <td class="text--align-left" style="opacity: 0.2">
                    {{ item.firstName }}
                  </td>
                  <td class="text--align-left" style="opacity: 0.2">
                    {{ item.lastName }}
                  </td>
                  <td class="text--align-left" style="opacity: 0.2">
                    {{ item.email }}
                  </td>
                  <td class="text--align-left" style="opacity: 0.2">
                    {{ item.phone }}
                  </td>
                </tr>
                <tr v-if="response.data.length == 0">
                  <td colspan="8">
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
              v-if="response"
              @applyPagination="controlWithPagination"
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
import { DataResponse, LeadsRequestModel, LeadsModel } from "@/model";

import PurchaseLeads from "../components/PurchaseLeads.vue";
import Pagination from "@/components/controls/Pagination.vue";

@Options({
  components: {
    PurchaseLeads,
    Pagination,
  },
})
export default class AvaliableLeads extends Vue {
  @Inject("leadsService") service: ILeadsService;

  public store = useStore();

  public togglePurchaseModel: boolean = false;
  public payNow: boolean = false;

  public price: number = 0;
  public selectedLeads: Array<any> = [];
  public subscription: any = null;

  public request = new LeadsRequestModel();
  public response: DataResponse<LeadsModel> = new DataResponse();

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

  getLeads() {
    this.request._loading = true;
    this.request.siteId = this.siteId;
    this.service.getAvailableLeads(this.request).then((response) => {
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

  get siteId() {
    return this.store.getters.getSiteId;
  }
}
</script>