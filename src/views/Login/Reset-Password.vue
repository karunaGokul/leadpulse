<template>
    <div class="container-fluid fill-height">
        <div class="row">
            <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header justify--center">
                        <img src="../../assets/lp-logo.png" class="login-logo" alt="Lead Pulse" />
                    </div>
                    <div class="card-content ma--top-1">

                        <form @submit.prevent="updatePassword">

                            <div 
                                class="form-field form-field__standard ma--y-2"
                                :class="{ 
                                    'form-field--is-invalid': v$.request.password.$error,
                                    'form-field--is-active': !v$.request.password.$invalid 
                                }"
                            >                 
                                <div class="form-field__control form-field__control--icon">                                    
                                    <input :type="showPassword ? 'text': 'password'" class="form-field__input" v-model.trim="request.password" v-focus/>
                                    <label for="password" class="form-field__label">New Password</label>    
                                    <div class="form-field__control--icon__prefix">
                                        <i class="fa fa-key"></i>
                                    </div>
                                    <div class="form-field__control--icon__suffix">
                                        <i 
                                            class="fa"
                                            :class="{
                                                'fa-eye': showPassword,
                                                'fa-eye-slash': !showPassword
                                            }"
                                            @click="showPassword = !showPassword"
                                        >
                                        </i>
                                    </div>
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
                                class="form-field form-field__standard ma--y-2"
                                :class="{ 
                                    'form-field--is-invalid': v$.request.confirmPassword.$error,
                                    'form-field--is-active': !v$.request.confirmPassword.$invalid
                                }"
                            >                 
                                <div class="form-field__control form-field__control--icon">                                    
                                    <input 
                                        :type="showConfirmPassword ? 'text': 'password'" 
                                        class="form-field__input" 
                                        v-model.trim="request.confirmPassword" 
                                        v-focus
                                        v-sameAs="request"
                                    />
                                    <label for="password" class="form-field__label">Confirm Password</label> 
                                    <div class="form-field__control--icon__prefix">
                                        <i class="fa fa-key"></i>
                                    </div>
                                    <div class="form-field__control--icon__suffix">
                                        <i 
                                            class="fa"
                                            :class="{
                                                'fa-eye': showConfirmPassword,
                                                'fa-eye-slash': !showConfirmPassword
                                            }"
                                            @click="showConfirmPassword = !showConfirmPassword"
                                        >
                                        </i>
                                    </div>   
                                </div>
                            </div>

                            <div class="ma--y-1 text--align-center">
                                <button 
                                    type="submit"
                                    class="btn btn--success btn--large"
                                >
                                    <span v-if="!loading">Update</span> 
                                    <div class="loading-circle" v-else>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>    
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
import { Vue, Options, setup } from 'vue-class-component';
import { Inject } from "vue-property-decorator";

import { useStore } from "vuex";
import useVuelidate from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

import { IAuthenticationService } from '@/service';
import { UpdatePasswordRequest } from "@/model";

@Options({
  validations: {
    request: {
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
      confirmPassword: { required }
    }
  }
})
export default class ResetPassword extends Vue {
    @Inject("authService") service: IAuthenticationService;

    public request = new UpdatePasswordRequest();

    public showPassword:boolean = false;
    public showConfirmPassword:boolean = false;
    public loading:boolean = false;
    
    public v$ = setup(() => this.validate());

    public store = useStore();

    validate() { 
        return useVuelidate();
    }

    public updatePassword() {
        this.v$.$touch();

        if(!this.v$.$invalid && this.request.password == this.request.confirmPassword) {
            this.loading = true;
            this.service.resetPassword(this.$route.query.uuid, this.request).then(response => {
                this.loading = false;
                this.store.dispatch("showSnack", { message: "Password changes successfully", snackBarClass: 'snack--bar__success' });
                this.$router.push('/');
            }).catch((error) => {
                this.loading = false;
                if(error.response.status == 500)
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