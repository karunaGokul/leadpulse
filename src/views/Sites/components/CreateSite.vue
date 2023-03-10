<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-file-invoice"></i>
          Create Site
        </h3>
        <i class="fa fa-times modal__header--clear" @click="close"> </i>
      </div>
      <form @submit.prevent="createSite">
        <div class="modal__content">
          <div
            class="form-field form-field__outline"
            :class="{
              'form-field__outline--invalid': v$.request.siteName.$error,
              'form-field__outline--active': !v$.request.siteName.$invalid,
            }"
          >
            <div class="form-field__outline--control">
              <input
                type="text"
                class="form-field__outline--control__input"
                v-model="request.siteName"
                v-outline
              />
              <label for="site-name" class="form-field__outline--control__label"
                >Site Name</label
              >
            </div>
          </div>

          <div class="row">
            <div class="col-4 pa-0">
              <div
                class="form-field form-field__outline form-field__outline--active"
                v-click-outside="clickOutSideUrl"
              >
                <div class="form-field__outline--control">
                  <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="request.url"
                    v-outline
                    readonly
                    @click="showAutoComplete = true"
                  />
                  <i
                    class="fa form-field__outline--select--arrow"
                    :class="{
                      'fa-sort-down': !showAutoComplete,
                      'fa-sort-up': showAutoComplete,
                    }"
                  >
                  </i>
                </div>
                <div
                  class="autocomplete autocomplete__top"
                  v-if="showAutoComplete"
                >
                  <div
                    class="autocomplete__item"
                    v-for="(item, index) of urls"
                    :key="index"
                    @click="
                      request.url = item;
                      showAutoComplete = false;
                    "
                    :class="{
                      'autocomplete__item--active': item == request.url,
                    }"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
            </div>
            <div class="col-8 pa--right-0">
              <div
                class="form-field form-field__outline"
                :class="{
                  'form-field__outline--invalid': v$.request.siteUrl.$error,
                  'form-field__outline--active': !v$.request.siteUrl.$invalid,
                }"
              >
                <div class="form-field__outline--control">
                  <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="request.siteUrl"
                    v-outline
                  />
                  <label
                    for="site-url"
                    class="form-field__outline--control__label"
                    >Site Url</label
                  >
                </div>
              </div>
            </div>
          </div>

          <div class="hint">Example: https://demo.com</div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { ISitesService } from "@/service";
import { CreateSiteRequestModel } from "@/model";

@Options({
  validations: {
    request: {
      siteName: { required },
      siteUrl: {
        required,
        urlValidation: function (value: any) {
          const validation = value.lastIndexOf(".com") != -1;
          return validation;
        },
      },
    },
  },
})
export default class CreatSite extends Vue {
  @Inject("sitesService") service: ISitesService;

  public v$ = setup(() => this.validate());
  public store = useStore();
  public request = new CreateSiteRequestModel();

  public urls: Array<string> = ["https://", "http://"];

  public loading: boolean = false;

  public showAutoComplete: boolean = false;

  validate() {
    return useVuelidate();
  }

  public createSite() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;

      const request = new CreateSiteRequestModel();
      request.siteName = this.request.siteName;
      request.siteUrl = this.request.url + this.request.siteUrl;

      this.service
        .createSite(request)
        .then((response) => {
          this.loading = false;
          this.store.dispatch("showAlert", {
            message: "Site created sucessfully",
            snackBarClass: "fa-check",
            type: "success",
          });
          this.$emit("closeSiteModel", true);
        })
        .catch((error) => {
          this.loading = true;
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: error.response.data.message,
              snackBarClass: "fa-times",
              type: "error",
            });
          this.$emit("closeSiteModel", true);
        })
        .catch((error) => {
          this.loading = true;
          if (error.response.status == 400)
            this.store.dispatch("showSnack", {
              message: error.response.data.message,
              snackBarClass: "snack--bar__error",
            });
          this.loading = false;
        });
    }
  }

  public close() {
    this.$emit("closeSiteModel", false);
  }

  public clickOutSideUrl() {
    this.showAutoComplete = false;
  }
}
</script>