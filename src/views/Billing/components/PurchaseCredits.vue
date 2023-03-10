<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success justify--flex-start">
        <i class="fa fa-shopping-cart ma--right-1"></i>
        <h3 class="modal__header--title">Buy Credits</h3>
      </div>
      <div
        class="modal__content ma--top-1"
        style="height: 175px; overflow: hidden"
      >
        <div
          class="form-field form-field__outline form-field__outline--active"
          v-click-outside="clickOutSideCredits"
        >
          <input
            type="text"
            class="form-field__outline--control__input"
            v-model="credits"
            v-outline
            readonly
            @click="creditsToggle = true"
          />
          <i
            class="fa form-field__outline--select--arrow"
            :class="{
              'fa-sort-down': !creditsToggle,
              'fa-sort-up': creditsToggle,
            }"
          >
          </i>
          <label for="credits" class="form-field__outline--control__label"
            >Credit</label
          >

          <div
            class="autocomplete"
            style="height: 100px; overflow: auto"
            v-if="creditsToggle"
          >
            <div
              class="autocomplete__item"
              v-for="(item, index) of response"
              :key="index"
              @click="updatePrice(item.creditPoint)"
              :class="{
                'autocomplete__item--active': item.creditPoint == credits,
              }"
            >
              {{ item.creditPoint }}
            </div>
          </div>
        </div>
        <div
          class="form-field form-field__outline form-field__outline--active ma--top-2"
        >
          <input
            type="text"
            class="form-field__outline--control__input pa--left-2"
            v-model="amount"
            v-outline
            readonly
          />
          <div class="form-field__control--icon__prefix">
            <i class="fa fa-dollar-sign"></i>
          </div>
          <label for="credits" class="form-field__outline--control__label"
            >Amount</label
          >
        </div>
        <stripe-checkout
          ref="checkoutRef"
          mode="payment"
          :pk="publishableKey"
          :lineItems="lineItems"
          :success-url="successUrl"
          :cancel-url="cancelUrl"
          v-if="payNow"
        />
      </div>
      <div class="modal__footer">
        <button type="button" class="btn btn--secontary" @click="cancel">
          Cancel
        </button>
        <button type="button" class="btn btn--primary" @click="purchase">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { Settings } from "@/config";
import { ICreditHistoryService } from "@/service";
import { AllCreditValueModel } from "@/model";

import Selectbox from "@/components/controls/Selectbox.vue";

import { StripeCheckout } from "@vue-stripe/vue-stripe";

@Options({
  components: {
    Selectbox,
    StripeCheckout,
  },
})
export default class PurchaseCredits extends Vue {
  @Inject("CreditHistoryService") service: ICreditHistoryService;

  public store = useStore();
  public response: Array<AllCreditValueModel> = [];
  public credits: number = 0;
  public creditsToggle: boolean = false;
  public publishableKey: string = "";
  public lineItems: any = [];
  public payNow: boolean = false;
  public successUrl: string = "";
  public cancelUrl: string = "";

  public loading: boolean = false;

  public amount: number = 0;

  created() {
    this.publishableKey = Settings.PublicKey;
    this.successUrl = window.location.origin + "/success";
    this.cancelUrl = window.location.origin + "/cancel";
    this.getAllCreditValues();
  }

  private getAllCreditValues() {
    this.loading = true;
    this.service.getAllCreditValues().then((response) => {
      this.loading = false;
      this.response = response;
      this.updatePrice(this.response[0].creditPoint);
    });
  }

  public updatePrice(credits: number) {
    this.credits = credits;
    this.creditsToggle = false;
    this.amount = this.credits * 0.15;
  }

  public clickOutSideCredits() {
    this.creditsToggle = false;
  }

  public purchase() {
    this.payNow = true;
    this.lineItems = [
      { price: "price_1InhFUSFxAW5tDfaJQxnemZM", quantity: this.credits },
    ];
    this.store.dispatch("addPurchaseCredits", {
      credits: this.credits,
      amount: this.amount,
    });
    setTimeout(() => {
      (this.$refs.checkoutRef as any).redirectToCheckout();
    }, 1000);
  }

  public cancel() {
    this.$emit("cancel");
  }
}
</script>