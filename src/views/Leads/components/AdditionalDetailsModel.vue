<template>
    <div class="modal-container show" >
        <div class="blocker"></div>
        <div class="modal" style="width: 500px">
            <div class="modal__header modal__header--success">
                <h3 class="modal__header--title">Lead Details</h3>
                <a 
                    class="fa fa-times modal__header--clear" 
                    @click="close"
                >
                </a>
            </div>
            <div class="modal__content pa-2">
                <table class="table" v-if="response">
                    <tbody>
                        <tr v-for="(item, index) of response" :key="index">
                            <td class="text--align-left">{{item.fieldName}}</td>
                            <td class="text--align-left">{{item.fieldValue}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

import { AdditionalDetailsModel } from "@/model";

export default class AdditionalDetails extends Vue {
    @Prop() details: Array<AdditionalDetailsModel>;

    public response: Array<AdditionalDetailsModel> = [];

    created() {
        this.response = this.details;
    }

    public close() {
        this.$emit("close", false);
    }

}
</script>