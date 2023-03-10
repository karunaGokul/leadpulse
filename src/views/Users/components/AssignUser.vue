<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-id-card-alt"></i>
          Assign user
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form @submit.prevent="assign">
        <div class="modal__content" style="max-height: 520px">
          <div
            class="form-field form-field__standard ma--top-1"
            :class="{
              'form-field--is-invalid': v$.request.email.$error,
              'form-field--is-active': !v$.request.email.$invalid,
            }"
          >
            <div class="form-field__control">
              <input
                type="text"
                class="form-field__input"
                v-model="request.email"
                v-focus
              />
              <label for="Email" class="form-field__label">Email *</label>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">Assign</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";

import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

import { AssignUserRequestModel } from "@/model";
import { IUserService } from "@/service";

import { useStore } from "vuex";

@Options({
  validations: {
    request: {
      email: { required, email },
    },
  },
})
export default class AssignUser extends Vue {
  @Prop() siteId: number;

  @Inject("userService") service: IUserService;

  public request = new AssignUserRequestModel();

  public v$ = setup(() => this.validate());
  public store = useStore();

  validate() {
    return useVuelidate();
  }

  public close() {
    this.$emit("close");
  }

  public assign() {
    this.v$.$touch();
    this.request.siteId = this.siteId;
    if (!this.v$.$invalid) {
      this.service
        .assignUser(this.request)
        .then((response) => {
          this.$emit("assigned");
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: "Please enter already registered user email",
              snackBarClass: "fa-times",
              type: "error",
            });
        });
    }
  }
}
</script>