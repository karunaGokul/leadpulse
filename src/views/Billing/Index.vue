<template>
  <div class="billing--container ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <button
              class="btn btn--primary"
              @click="togglePurchaseCreditModel = true"
            >
              <i class="fa fa-shopping-cart btn--icon__prefix"></i>
              <span class="btn--name">Buy Credit</span>
            </button>
          </div>
          <div class="card-content">
            <table class="table table--hover">
              <thead class="table--header">
                <tr>
                  <th class="text--align-left">Date</th>
                  <th class="text--align-right">Credits</th>
                  <th class="text--align-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response" :key="index">
                  <td class="text--align-left">
                    {{ $filters.dateDisplay(item.purchasedDate) }}
                  </td>
                  <td class="text--align-right">{{ item.credits }}</td>
                  <td class="text--align-right">
                    {{ $filters.currencyDisplay(item.amount) }}
                  </td>
                </tr>
                <tr v-if="response.length == 0 && !loading">
                  <td colspan="3">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <PurchaseCredits
              v-if="togglePurchaseCreditModel"
              @cancel="onCancelPurchase"
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
import { ICreditHistoryService } from "@/service";
import { useStore } from "vuex";
import { CreditHistoryModel, CreditHistoryRequestModel } from "@/model";
import PurchaseCredits from "./components/PurchaseCredits.vue";

@Options({
  components: {
    PurchaseCredits,
  },
})
export default class Billing extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public togglePurchaseCreditModel: boolean = false;
  public response: Array<CreditHistoryModel> = [];

  public store = useStore();

  public loading: boolean = false;

  mounted() {
    this.getAllCreditHistory();
    this.store.dispatch("updateCredits");
  }

  public getAllCreditHistory() {
    this.loading = true;
    const request = new CreditHistoryRequestModel();
    this.service.getAllCreditHistory(request).then((response) => {
      this.loading = false;
      this.response = response;
    });
  }

  public onCancelPurchase() {
    this.togglePurchaseCreditModel = false;
  }
}
</script>