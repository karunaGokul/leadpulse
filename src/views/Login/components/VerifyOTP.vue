<template>
    <div class="modal-container show">
        <div class="blocker"></div>
        <div class="modal" style="width: 400px">
            <div class="modal__content pa-2">
               <p class="info">Please enter the one time password to verify your account</p>  
               <p class="ma--bottom-2">A code has been sent to {{phoneNo}}</p>
               <p v-if="!resendOTP">{{seconds}} seconds remaining to resend OTP</p>
                <form @submit.prevent="verifyOTP">
                    <div class="display--flex align--center">
                       <!--<input type="text" v-model="request.otp" class="otp--input"> -->
                       <div 
                            class="form-field form-field__outline ma-0"
                            style="width: 75%"
                            :class="{ 
                                'form-field__outline--invalid': v$.request.otp.$error,
                                'form-field__outline--active': !v$.request.otp.$invalid 
                            }"
                        >
                            <div class="form-field__outline--control">
                                <input 
                                    type="text" 
                                    class="form-field__outline--control__input" 
                                    v-model="request.otp"
                                    v-outline 
                                />
                            </div>
                        </div>
                       <button class="btn btn--success ma--left-1" type="submit">Validate</button>
                    </div>
                </form>

               <p class="text--align-center ma--top-2">Didn't get code? 
                    <button 
                        class="resend" 
                        :disabled="!resendOTP" 
                        @click="resend"
                    >
                        Resend
                    </button>
                </p>

            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue, Options, setup } from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { useStore } from "vuex";

import useVuelidate from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
} from "@vuelidate/validators";


@Options({
  validations: {
    request: {
        otp: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(4)
        }
    }
  }
})
export default class VerifyOTP extends Vue {
    @Prop() phone: string;

    public store = useStore();
    public request = new OTPRequest();
    public resendOTP:boolean = false;
    public seconds:number = 30;
    public timeId:any;

    
    public v$ = setup(() => this.validate());

    validate() {
        return useVuelidate();
    }

    created() {
        this.timeId = setInterval(this.coundown, 1000)
    }

    coundown() {
        if(this.seconds == 0) {
            this.resendOTP = true;
            clearTimeout(this.timeId);
        } else {
            this.resendOTP = false;
            this.seconds--;
        }
    }

    public resend() {
        this.$emit("resend");
    }

    public verifyOTP() {
        this.v$.$touch();
        if (!this.v$.$invalid) {

            let xhttp = new XMLHttpRequest(),
                params = 'Channel=sms',
                data = new URLSearchParams();
  
            data.append('To', this.phone);
            data.append('Code', this.request.otp);

            let self = this;
  
            xhttp.open("POST", "https://verify.twilio.com/v2/Services/VA659f1a0a830b7ae16605368d517701e3/VerificationCheck", true);
            xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.setRequestHeader('Authorization', 'Basic ' + window.btoa('AC668a2d02dfeecfbcd46a537fc7cf478b:cab75b3ca5413186f07cb7a51be06d49'));
    
            xhttp.send(data);

            xhttp.onreadystatechange = function() {
                console.log(this.responseText);
                let jsonResponse = JSON.parse(this.responseText);
                if (this.readyState == 4 && this.status == 200) {
                    if(jsonResponse.status == "approved") {
                        localStorage.setItem('accessToken', self.store.getters.accessToken);
                        localStorage.setItem('refreshToken', self.store.getters.refreshToken);
                        self.$router.push("/");
                    }  else if(jsonResponse.status == "pending") {
                        self.store.dispatch("showSnack", {
                            message: "Please enter valid OTP!",
                            snackBarClass: "snack--bar__error",
                        });
                    }
                }
            }
        }
    }

    get phoneNo() {
        return "xxxx"+this.phone.slice(this.phone.length  - 4);
    }

}

export class OTPRequest {
    otp: string;
}
</script>