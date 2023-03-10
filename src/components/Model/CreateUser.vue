<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="modal" style="width: 450px" v-if="request">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-user-plus"></i>
          {{ accessType }}
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <form
        @submit.prevent="accessType == 'Add User' ? addUser() : updateUser()"
      >
        <div class="modal__content" style="max-height: 520px">
          <div
            class="form-field form-field__standard"
            :class="{
              'form-field--is-invalid': v$.request.firstName.$error,
              'form-field--is-active': !v$.request.firstName.$invalid,
            }"
          >
            <div class="form-field__control">
              <input
                type="text"
                class="form-field__input"
                v-model="request.firstName"
                v-focus
              />
              <label for="Firstname" class="form-field__label"
                >Firstname *</label
              >
            </div>
          </div>
          <div
            class="form-field form-field__standard"
            :class="{
              'form-field--is-invalid': v$.request.lastName.$error,
              'form-field--is-active': !v$.request.lastName.$invalid,
            }"
          >
            <div class="form-field__control">
              <input
                type="text"
                class="form-field__input"
                v-model="request.lastName"
                v-focus
              />
              <label for="Lastname" class="form-field__label">Lastname *</label>
            </div>
          </div>

          <div
            class="form-field form-field__standard"
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
          <div
            class="form-field form-field__standard"
            :class="{
              'form-field--is-invalid': v$.request.phone.$error,
              'form-field--is-active': !v$.request.phone.$invalid,
            }"
          >
            <div class="form-field__control" title="Phone number only numeric">
              <input
                type="text"
                class="form-field__input"
                v-model="request.phone"
                v-focus
              />
              <label for="Phone" class="form-field__label">Phone *</label>
            </div>
          </div>

          <Selectbox
            label="Role"
            :value="request.role"
            :fields="roleType"
            @update="onUpdateRole(request, $event)"
            v-if="accessType == 'Add User' || accessType == 'Update User'"
          />

          <div class="form-field form-field__standard">
            <div class="form-field__control">
              <input
                type="text"
                class="form-field__input"
                v-model="request.companyName"
                v-focus
              />
              <label for="Company name" class="form-field__label"
                >Company Name</label
              >
            </div>
          </div>

          <div class="row">
            <div class="col-lg-6 pa--left-0">
              <div class="form-field form-field__standard">
                <div class="form-field__control">
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.industry"
                    v-focus
                  />
                  <label for="industry" class="form-field__label"
                    >Industry</label
                  >
                </div>
              </div>
            </div>
            <div class="col-lg-6 pa--right-0">
              <div class="form-field form-field__standard">
                <div class="form-field__control">
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.professionalRole"
                    v-focus
                  />
                  <label for="Job Title" class="form-field__label"
                    >Job Title</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal__footer">
          <button type="submit" class="btn btn--primary">
            {{ accessType }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import axios from "axios";
import { Vue, Options, setup } from "vue-class-component";
import { Prop, Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  numeric,
  minLength,
  maxLength,
} from "@vuelidate/validators";

import { IUserService } from "@/service";
import { CreateUserRequestModel } from "@/model";

import Selectbox from "../controls/Selectbox.vue";

@Options({
  components: {
    Selectbox,
  },
  validations: {
    request: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
    },
  },
})
export default class CreateUser extends Vue {
  @Prop() data: any;
  @Prop() accessType: string;
  @Inject("userService") service: IUserService;

  public store = useStore();
  public request = new CreateUserRequestModel();

  public v$ = setup(() => this.validate());

  public loading: boolean = false;

  public roleType: Array<string> = ["ADMIN", "CLIENT"];

  validate() {
    return useVuelidate();
  }

  public created() {
    if (this.accessType == "Update User" || this.accessType == "Edit Profile")
      this.request = this.data;
    else this.request.role = "ADMIN";
  }

  public addUser() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;
      axios.defaults.headers.common["Authorization"] = "";
      this.request.type = "ADDUSER";
      this.request.siteId = this.store.getters.getSiteId;
      this.service
        .addUser(this.request)
        .then((response) => {
          this.loading = false;
          this.$emit("closeModel", true);
          this.store.dispatch("showAlert", {
            message: "User added sucessfully",
            snackBarClass: "fa-check",
            type: "success",
          });
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + this.store.getters.accessToken;
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: error.response.data,
              snackBarClass: "fa-times",
              type: "error",
            });
          this.loading = false;
        });
    }
  }

  public updateUser() {
    this.v$.$touch();

    if (!this.v$.$invalid) {
      this.loading = true;
      axios.defaults.headers.common["Authorization"] = "";
      this.request.type = "ADDUSER";
      this.request.siteId = this.store.getters.getSiteId;
      this.service
        .updateUser(this.request)
        .then((response) => {
          this.loading = false;
          this.$emit("closeModel", true);
          this.store.dispatch("showAlert", {
            message: "User details updated successfully",
            snackBarClass: "fa-check",
            type: "success",
          });
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + this.store.getters.accessToken;
        })
        .catch((error) => {
          if (error.response.status == 400)
            this.store.dispatch("showAlert", {
              message: error.response.data,
              snackBarClass: "fa-times",
              type: "error",
            });
          this.loading = false;
        });
    }
  }

  public onUpdateRole(request: CreateUserRequestModel, selectedRole: string) {
    request.role = selectedRole;
  }

  public close() {
    this.$emit("closeModel", false);
  }
}
</script>