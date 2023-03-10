<template>
  <div class="container-fluid fill-height">
    <div class="row">
      <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
        <div class="card">
          <div class="card-header">
            <div class="card-header--title login--card-title">
              Create Account
            </div>
          </div>
          <div class="card-content ma--top-1">
            <div class="ma--bottom-1">
              Already have account?
              <router-link to="/login" tag="a" class="forgot--password">
                Login here
              </router-link>
            </div>

            <form @submit.prevent="newUser()">
              <div class="row no-gutters">
                <div class="col-lg-6 col-sm-12">
                  <div
                    class="form-field form-field__standard ma--top-1 pa--right-1"
                    :class="{ 
                        'form-field--is-invalid': v$.request.firstName.$error,
                        'form-field--is-active': !v$.request.firstName.$invalid 
                    }"
                  >
                    <div class="form-field__control">
                      <input
                        type="text"
                        class="form-field__input"
                        v-focus
                        v-model="request.firstName"
                      />
                      <label for="email" class="form-field__label"
                        >First Name *</label
                      >
                    </div>
                  </div>
                </div>
                <div class="col-lg-6 col-sm-12">
                  <div 
                    class="form-field form-field__standard ma--top-1" 
                    :class="{ 
                        'form-field--is-invalid': v$.request.lastName.$error,
                        'form-field--is-active': !v$.request.lastName.$invalid 
                    }"
                  >
                    <div class="form-field__control">
                      <input
                        type="text"
                        class="form-field__input"
                        v-focus
                        v-model="request.lastName"
                      />
                      <label for="Lastname" class="form-field__label"
                        >Last Name *</label
                      >
                    </div>
                  </div>
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
                  <input
                    type="text"
                    class="form-field__input"
                    v-focus
                    v-model="request.email"
                  />
                  <label for="email" class="form-field__label">Email *</label>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.password.$error,
                  'form-field--is-active': !v$.request.password.$invalid 
                }"
              >
                <div class="form-field__control">
                  <label for="new-password" class="form-field__label"
                    >Password *</label
                  >
                  <input
                    type="password"
                    class="form-field__input"
                    v-focus
                    v-model="request.password"
                  />
                </div>
                <div class="form-field__error--box">
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.minLength.$invalid)"
                    ></i>
                    Minimum 8 characters
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.number.$invalid)"
                    ></i>
                    Atleast one number
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.special.$invalid)"
                    ></i>
                    Atleast one special character
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.uppercase.$invalid)"
                    ></i>
                    Atleast one Uppercase
                  </div>
                  <div class="error--message">
                    <i
                      class="fa"
                      :class="getErrors(v$.request.password.lowercase.$invalid)"
                    ></i>
                    Atleast one Lowercase
                  </div>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.confirmPassword.$error,
                  'form-field--is-active': !v$.request.confirmPassword.$invalid 
                }"
              >
                <div class="form-field__control">
                  <label for="confirm-password" class="form-field__label"
                    >Confirm Password *</label
                  >
                  <input
                    type="password"
                    class="form-field__input"
                    v-focus
                    v-model="request.confirmPassword"
                    v-sameAs="request"
                  />
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
                :class="{ 
                  'form-field--is-invalid': v$.request.phone.$error,
                  'form-field--is-active': !v$.request.phone.$invalid 
                }"
              >
                <div class="form-field__control" title="Phone number only numeric">
                  <input
                    type="text"
                    class="form-field__input"
                    v-focus
                    v-model="request.phone"
                  />
                  <label for="phone" class="form-field__label">Phone *</label>
                </div>
              </div>

              <div 
                class="form-field form-field__standard"
              >
                <div class="form-field__control">
                  <input
                    type="text"
                    class="form-field__input"
                    v-model="request.companyName"
                    v-focus
                  />
                  <label for="company-name" class="form-field__label"
                    >Company Name</label
                  >
                </div>
              </div>

              <div class="row no-gutters">
                <div class="col-lg-6 col-sm-12">
                  <div 
                    class="form-field form-field__standard pa--right-1"
                  >
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
                <div class="col-lg-6 col-sm-12">
                  <div 
                    class="form-field form-field__standard"
                  >
                    <div class="form-field__control">
                      <input
                        type="text"
                        class="form-field__input"
                        v-model="request.professionalRole"
                        v-focus
                      />
                      <label for="Role" class="form-field__label">Role</label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text--align-center">
                <button type="submit" class="btn btn--success btn--large">
                  Create
                </button>
              </div>
            </form>
          </div>
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
import {
  required,
  email,
  sameAs,
  numeric,
  minLength,
  maxLength,
} from "@vuelidate/validators";

import { IAuthenticationService } from "@/service";
import { CreateUserRequestModel } from "@/model";

@Options({
  validations: {
    request: {
      firstName: { required },
      lastName: { required },
      email: { required, email },
      password: {
        required,
        minLength: function(value: any) {
          let validation = false;
          if(value && value != '' && value.length >= 8 )  validation = true;

          return validation;
        },
        uppercase: function(value: any) {
          let validation = false;
          if(value && value != '')  validation = /^(?=.*?[A-Z])/.test(value);

          return validation;
        },
        lowercase: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /^(?=.*?[a-z])/.test(value);
          return validation;
        },
        number: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /[0-9]/.test(value);
          return validation;
        },
        special: function (value: any) {
          let validation = false;
          if(value && value != '')  validation = /[#?!@$%^&*-]/.test(value);
          return validation;
        }
      },
      confirmPassword: {
        required
      },
      phone: {
        required,
        numeric,
        minLength: minLength(10),
        maxLength: maxLength(10),
      },
    },
  },
})
export default class Registration extends Vue {
  @Inject("authService") service: IAuthenticationService;

  public store = useStore();
  public request = new CreateUserRequestModel();
  public v$ = setup(() => this.validate());

  validate() {
    return useVuelidate();
  }

  public newUser() {
    this.v$.$touch();

    if (
      !this.v$.$invalid &&
      this.request.password == this.request.confirmPassword
    ) {
      this.request.type = "REGISTERUSER";
      this.service.createNewUser(this.request).then(
        (response) => {
          this.store.dispatch("showSnack", { message: "Account created successfully", snackBarClass: 'snack--bar__success' });
          this.$router.push("/");
        }).catch((error) => {
        if(error.response.status == 400)
          this.store.dispatch("showSnack", {
            message: error.response.data,
            snackBarClass: "snack--bar__error",
          });
      });
    } 
  }

  public getErrors(request: boolean) {
    return request
      ? "fa-times-circle fa--danger"
      : "fa-check-circle fa--success";
  }
}
</script>