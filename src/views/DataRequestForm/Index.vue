<template>
  <div class="container-fluid fill-height">
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
        <div class="card">
          <form @submit.prevent="sendRequest">
            <div class="card-content">

              <div 
                class="form-field form-field__outline ma--top-2"
                :class="{ 
                  'form-field__outline--invalid': v$.request.industry.$error,
                  'form-field__outline--active': !v$.request.industry.$invalid 
                }"
              >
                <div class="form-field__outline--control">
                  <label for="Industry" class="form-field__outline--control__label">Industry</label>
                  <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="request.industry"
                    v-outline
                  />  
                </div>
              </div>

              <div class="form-field form-field__outline form-field__outline--active ma--top-2" v-click-outside="clickOutSideState">
                <input 
                  type="text" 
                  class="form-field__outline--control__input" 
                  v-model="request.state"
                  v-outline 
                  readonly
                  @click="stateToggle = true"
                />
                <i 
                  class="fa form-field__outline--select--arrow"
                  :class="{
                    'fa-sort-down': !stateToggle,
                    'fa-sort-up': stateToggle
                  }"
                >
                </i>
                <label for="credits" class="form-field__outline--control__label">State</label>
                <div 
                  class="autocomplete"
                  style="height: 100px;overflow: auto;"
                  v-if="stateToggle"
                >
                  <div 
                    class="autocomplete__item"
                    v-for="(item, index) of states"
                    :key="index"
                    :class="{
                      'autocomplete__item--active': item == request.state
                    }"
                    @click="request.state = item; stateToggle = false;"
                  >
                    {{item}}
                  </div>
                </div>
              </div>

              <div 
                class="form-field form-field__outline ma--top-2"
                :class="{ 
                  'form-field__outline--invalid': v$.request.zipCode.$error,
                  'form-field__outline--active': !v$.request.zipCode.$invalid 
                }"
              >
                <div class="form-field__outline--control">
                  <label for="zipcode" class="form-field__outline--control__label">Zipcode</label>
                  <input
                    type="text"
                    class="form-field__outline--control__input"
                    v-model="request.zipCode"
                    v-outline
                  />
                </div>
              </div>
            </div>

            <div class="card-actions display--flex justify--flex-end">
              <button type="submit" class="btn btn--success">
                Request
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

import { IDataRequestFormService } from '@/service';
import { DataFormRequestModel } from '@/model';

@Options({
  validations: {
    request: {
      industry: { required },
      state: { required },
      zipCode: { required }
    },
  },
})
export default class DataRequestForm extends Vue {
  @Inject('dataRequestFormService') service: IDataRequestFormService;

  public request = new DataFormRequestModel();

  public stateToggle:boolean = false;
  public states: Array<string> = ['Texas', 'Los vegas'];

  public store = useStore();
  public v$ = setup(() => this.validate());

  validate() {
    return useVuelidate();
  }

  created() {
    this.request.state = this.states[0];
  }

  public clickOutSideState() {
    this.stateToggle = false;
  }

  public sendRequest() {
    this.v$.$touch();
    
    if (!this.v$.$invalid) { 
      this.request._loading = true;
      this.service.sendDataRequest(this.request).then((response) => {
        this.request._loading = false;
        this.store.dispatch("showSnack", {
          message: "Done",
          snackBarClass: "snack--bar__success"
        });
        this.v$.$reset();
        this.request = new DataFormRequestModel();
        this.request.state = this.states[0];
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