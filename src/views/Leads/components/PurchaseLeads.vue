<template>
  <div class="modal-container show">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="blocker"></div>
    <div class="modal" style="width: 800px">
      <div class="modal__content pa-1">
        <div class="stepper--bar">
          <div class="stepper--bar__header">
            <ul>
              <li
                :class="{
                  active: stepper == 1,
                }"
              >
                <span class="stepper--bar__header--title-count">1</span>
                <span class="stepper--bar__header--title">Fields</span>
              </li>
              <li
                :class="{
                  active: stepper == 2,
                }"
              >
                <span class="stepper--bar__header--title-count">2</span>
                <span class="stepper--bar__header--title">Price</span>
              </li>
            </ul>
          </div>
          <div class="stepper--bar__content">
            <div
              class="stepper--bar__content--label stepper--bar__content--label-1"
              :class="{
                'label--active': stepper == 1,
              }"
            >
              <div class="row form-group--checkbox pa--y-1 pa--left-1">
                <div
                  v-for="(item, index) in fields"
                  :key="index"
                  class="col-6 pa--y-1"
                >
                  <div class="form-checkbox">
                    <input :id="'field-'+ index" type="checkbox" @click="item.value = !item.value" />
                    <label :for="'field-'+ index">{{ item.displayName }} <i>({{ item.credit }} credits)</i></label>
                  </div>
                </div>
              </div>
              <div 
                  class="stepper--bar__content--label__info--error pa--left-2"
                  v-if="fieldsError"
                >
                  Please select atleast one fields
                </div>
            </div>
            <div
              class="stepper--bar__content--label stepper--bar__content--label-2"
              :class="{
                'label--active': stepper == 2,
              }"
            >
              <div class="stepper--bar__content--label__info">
                <div
                  class="stepper--bar__content--label__info--message ma--top-1 ma--bottom-1 pa-1"
                >
                  Selected Fields

                  <span
                    class="stepper--bar__content--label__info--message__data"
                  >
                    {{ selectedFields.length }}
                  </span>
                </div>
                <div
                  class="row stepper--bar__content--label__info--message justify--flex-start ma--bottom-1 pa-1"
                >
                  <div
                    v-for="(item, index) in selectedFields"
                    :key="index"
                    class="col-4 pa-1 stepper--bar__content--label__info--message__fields"
                  >
                    {{ index + 1 }}. {{ item.displayName }}
                  </div>
                </div>

                <div
                  class="stepper--bar__content--label__info--message ma--bottom-1 pa-1"
                >
                  Selected Leads
                  <span
                    class="stepper--bar__content--label__info--message__data"
                  >
                    {{ selectedLeads.length }}
                  </span>
                </div>

                <div
                  class="stepper--bar__content--label__info--message ma--bottom-1 pa-1"
                >
                  Total credits for your Leads
                  <span
                    class="stepper--bar__content--label__info--message__data"
                  >
                    {{ response }}
                  </span>
                </div>
                <div
                  class="stepper--bar__content--label__info--error pa-1"
                  v-if="insufficentCredits"
                >
                  You don't have enough credits,
                  <router-link to="/billing" tag="a">
                    Buy Credits
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__footer">
        <button
          type="button"
          class="btn btn--secontary"
          @click="close"
          v-if="stepper == 1"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn--secontary"
          @click="backToFields"
          v-else
        >
          Back
        </button>

        <button
          type="button"
          class="btn btn--primary"
          @click="proceed"
          v-if="stepper == 1"
        >
          Proceed
        </button>
        <button
          type="button"
          class="btn btn--primary"
          @click="checkCredits"
          v-else
        >
          Purchase
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import {
  FieldsModel,
  PurchaseLeadsRequestModel,
} from "@/model";

import { ILeadsService } from "@/service";

export default class PurchaseLeads extends Vue {
  @Prop() selectedLeads: Array<number>;
  @Prop() purchasedLead: Array<number>;
  @Prop() siteId: string;
  @Prop() purchaseType: string;
  @Inject("leadsService") service: ILeadsService;

  public store = useStore();

  public fields: Array<FieldsModel> = [];
  public stepper: number = 1;
  public response: number = 0;
  public selectedFields: Array<any> = [];

  public insufficentCredits: boolean = false;
  public fieldsError:boolean = false;

  public loading:boolean = false;

  mounted() {
    this.getAllFields();
  }

  public getAllFields() {
    this.loading = true;
    this.service.getAllFields().then((response) => {
      this.loading = false;
      this.fields = response.map((e) => ({
        displayName: e.displayName,
        leadFieldName: e.leadFieldName,
        credit: e.credit,
        value: false,
      }));
    });
  }

  public proceed() {
    this.selectedFields = [];
    this.fields.forEach((item) => {
      if (item.value) this.selectedFields.push({ fieldName: item.leadFieldName, displayName: item.displayName });
    });

    if(this.selectedFields.length > 0) {
      this.loading = true;
      const request = new PurchaseLeadsRequestModel();
      request.siteId = +this.siteId;
      request.purchaseFields = this.selectedFields;
      request.leads = this.selectedLeads;
      this.service.getCredits(request).then((response) => {
        this.loading = false;
        this.stepper = 2;
        this.response = response;
      });
    } else this.fieldsError = true;
  }

  public checkCredits() {
    if (this.credits >= this.response) this.purchaseLeads();
    else this.insufficentCredits = true;
  }

  public purchaseLeads() {
    this.loading = true;
    const request = new PurchaseLeadsRequestModel();
    request.purchasedLeads = this.purchasedLead;
    request.siteId = +this.siteId;
    request.purchaseFields = this.selectedFields;
    request.leads = this.selectedLeads;

    if(this.purchaseType == "repurchaseLead") request.purchasedLeads = this.purchasedLead;

    this.service.purchaseLeads(this.purchaseType, request).then((response) => {
      this.loading = false;
      this.store.dispatch("showSnack", { message: "Leads purchased successfully", snackBarClass: 'snack--bar__success' });
        this.$emit("purchase");
    });
    
  }

  public backToFields() {
    this.stepper = 1;
  }

  public close() {
    this.$emit("close", false);
  }

  get credits() {
    return this.store.getters.getCredits;
  }
}
</script>