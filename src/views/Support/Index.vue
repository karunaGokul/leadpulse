<template>
  <div class="container-fluid fill-height">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
        <div class="card">
          <form @submit.prevent="support">
            <div class="card-content">
              <div 
                class="form-field form-field__standard ma--top-1"
                :class="{
                  'form-field--is-invalid': v$.request.name.$error,
                  'form-field--is-active': !v$.request.name.$invalid 
                }"
              >
                <div class="form-field__control">
                  <label for=" " class="form-field__label">Name</label>
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.name"
                    v-focus
                  />
                </div>
              </div>
              <div 
                class="form-field form-field__standard"
                :class="{
                  'form-field--is-invalid': v$.request.email.$error,
                  'form-field--is-active': !v$.request.email.$invalid 
                }"
              >
                <div class="form-field__control">
                  <label for=" " class="form-field__label">Email</label>
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.email"
                    v-focus
                  />
                </div>
              </div>
              <div 
                class="form-field form-field__standard"
                :class="{
                  'form-field--is-invalid': v$.request.message.$error,
                  'form-field--is-active': !v$.request.message.$invalid 
                }"
              >
                <div class="form-field__control">
                  <label for="msg" class="form-field__label"
                    >Enter Your Message Here...</label
                  >
                  <textarea
                    rows="8"
                    cols="50"
                    id="msg"
                    class="form-field__input"
                    v-model="request.message"
                    v-focus
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <div class="card-actions display--flex justify--flex-end">
              <button 
                type="submit" 
                class="btn btn--primary"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";

import { ISupportService } from '@/service';
import { SupportRequestModel } from "@/model";

@Options({
  validations: {
    request: {
      name: { required },
      email: { required },
      message: { required }
    },
  },
})
export default class Support extends Vue {
  @Inject('supportService') service: ISupportService;

  public request = new SupportRequestModel();
  public store = useStore();

  public v$ = setup(() => this.validate());

  validate() {
    return useVuelidate();
  }

  support() {
    this.v$.$touch();

    if (!this.v$.$invalid) { 
      this.request._loading = true;
      this.service.sendFeedback(this.request).then((response) => {
        this.request._loading = false;
        this.store.dispatch("showSnack", {
          message: "Done",
          snackBarClass: "snack--bar__success"
        });
        this.v$.$reset();
        this.request = new SupportRequestModel();
      }).catch((error) => {
        this.request._loading = false;
        this.store.dispatch("showSnack", {
          message: "Something went wrong, please try again later",
          snackBarClass: "snack--bar__error"
        });
      })
    }
  }
 
}
</script>