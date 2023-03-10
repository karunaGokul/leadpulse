<template>
    <div class="container-fluid fill-height">
        <div class="row">
            <div class="col-xl-4 col-lg-4 col-sm-12 col-md-6">
                <div class="card">
                    <div class="card-header justify--center">
                        <img src="../../assets/lp-logo.png" class="login-logo" alt="Lead Pulse" />
                    </div>
                    <div class="card-content ma--top-1">
                        
                        <p class="text--align-center text--weight-bold">Enter Email-id to receive instructions</p>

                        <form @submit.prevent="forgotPassword">

                            <div 
                                class="form-field form-field__standard ma--y-2" 
                                :class="{ 
                                    'form-field--is-invalid': v$.request.email.$error,
                                    'form-field--is-active': !v$.request.email.$invalid 
                                }"
                            >   
                                <div class="form-field__control form-field__control--icon">                         
                                    <input type="text" class="form-field__input" v-model="request.email" v-focus/>
                                    <label for="email" class="form-field__label">Email</label>
                                    <div class="form-field__control--icon__prefix">
                                        <i class="fa fa-user"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="ma--y-1 text--align-center">
                                <button 
                                    type="submit" 
                                    class="btn btn--success btn--large"
                                >
                                    <span v-if="!loading">Reset</span> 
                                    <div class="loading-circle" v-else>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>  
                                </button>
                            </div>
                        </form>

                        <div class="text--align-center">
                            <router-link 
                                to="/login"
                                tag="a"
                                class="forgot--password"
                            >
                               Back to Login
                            </router-link>
                        </div>
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
import { required, email } from '@vuelidate/validators';

import { IAuthenticationService } from '@/service';
import { ForgotPasswordRequest } from "@/model";

@Options({
  validations: {
    request: {
      email: { required, email }
    }
  }
})
export default class ForgotPassword extends Vue {
    @Inject("authService") service: IAuthenticationService;

    public store = useStore();
    public request = new ForgotPasswordRequest();
    public v$ = setup(() => this.validate());
    public loading:boolean = false;

    validate() { 
        return useVuelidate();
    }

    forgotPassword() {
        this.v$.$touch();

        if(!this.v$.$invalid) {
            this.loading = true;
            this.service.forgotPassword(this.request).then((response) => {
                this.loading = false;
                this.store.dispatch("showSnack", { message: "Reset password link send to your mail", snackBarClass: 'snack--bar__success' });
            }, (err) => {
                this.loading = false;
                this.store.dispatch("showSnack", { message: "Something went wrong, Please try agian later", snackBarClass: 'snack--bar__error' });
            })
        }
    }
}
</script>