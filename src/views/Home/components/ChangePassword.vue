<template>
    <div class="modal-container show">
        <div class="blocker"></div>
        <div class="modal" style="width: 500px;">
            <div class="modal__header modal__header--success">
                <h3 class="modal__header--title">
                    <i class="fa fa-key"></i>
                    Change Password
                </h3>
                <a 
                    class="fa fa-times modal__header--clear" 
                    @click="close"
                >
                </a>
            </div>
            <form @submit.prevent="change">
                <div class="modal__content">
                    <div 
                        class="form-field form-field__standard"
                        :class="{ 
                            'form-field--is-invalid': v$.request.currentPassword.$error,
                            'form-field--is-active': !v$.request.currentPassword.$invalid 
                        }"
                    >   
                        <div class="form-field__control form-field__control--icon">                         
                            <input type="password" class="form-field__input" v-model="request.currentPassword" v-focus />
                            <label for="current password" class="form-field__label">Current Password</label>
                            <div class="form-field__control--icon__prefix">
                                <i class="fa fa-lock"></i>
                            </div>
                        </div>
                    </div>
                    <div 
                        class="form-field form-field__standard ma--y-2"
                        :class="{ 
                            'form-field--is-invalid': v$.request.newPassword.$error,
                            'form-field--is-active': !v$.request.newPassword.$invalid 
                        }"
                    >   
                        <div class="form-field__control form-field__control--icon">                         
                            <input type="password" class="form-field__input" v-model="request.newPassword" v-focus />
                            <label for="new password" class="form-field__label">New Password</label>
                            <div class="form-field__control--icon__prefix">
                                <i class="fa fa-lock"></i>
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
                        <div class="form-field__control form-field__control--icon">                         
                            <input type="password" class="form-field__input" v-model="request.confirmPassword" v-focus v-changePassword="request"/>
                            <label for="confirm password" class="form-field__label">Confirm Password</label>
                            <div class="form-field__control--icon__prefix">
                                <i class="fa fa-lock"></i>
                            </div>
                        </div>
                    </div>
                </div>  
                <div class="modal__footer">
                    <button 
                        type="submit" 
                        class="btn btn--success"
                    >
                        Change
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Options, setup} from "vue-class-component";
import { Prop, Inject } from 'vue-property-decorator';

import axios from "axios";
import { useStore } from "vuex";

import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { IAuthenticationService } from '@/service';
import { ChangePasswordRequest } from '@/model';

@Options({
    validations: {
        request: {
            currentPassword: { required },
            newPassword: { 
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
            }
        }
    }
})
export default class ChangePassword extends Vue {
    @Prop() email: string;
    
    @Inject("authService") service: IAuthenticationService;

    public request = new ChangePasswordRequest();
    private store = useStore();
    public v$ = setup(() => this.validate());

    public showPassword: boolean = false;

    created() {
        this.request.email = this.email;
    }

    validate() { 
        return useVuelidate();
    }

    public close() {
        this.$emit('closePassword');
    }

    public change() {
        this.v$.$touch();
        
        if(!this.v$.$invalid && this.request.newPassword == this.request.confirmPassword) {
            axios.defaults.headers.common['Authorization'] = '';
            this.service.changePassword(this.request).then((response) => {
                this.store.dispatch("showSnack", {
                    message: "Password changed sucessfully",
                    snackBarClass: "snack--bar__success",
                });
                axios.defaults.headers.common["Authorization"] = "Bearer " +this.store.getters.accessToken;
                this.$emit('closePassword');
            }).catch((error) => {
                if(error.response.status == 410)
                    this.store.dispatch("showSnack", {
                        message: error.response.data.message,
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