<template>
    <div class="loading--spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { ICreditHistoryService } from "@/service";
import { PurchaseCreditRequestModel } from '@/model';

import { useStore } from "vuex";

export default class Success extends Vue {
    @Inject("CreditHistoryService") service: ICreditHistoryService;

    public store = useStore();

    mounted() {
        this.purchaseCredit();
    }

    private purchaseCredit() {
        const request = new PurchaseCreditRequestModel();
        request.credits = this.purchasedCredits;
        request.amount = this.purchasedAmount;
        this.service.purchaseCredit(request).then((response) => {
            this.store.dispatch("addPurchaseCredits", {credits: 0, amount: 0});
            this.$router.push('/billing');
            this.store.dispatch("showLaert", {
                message: "Credits purchased successfully",
                snackBarClass: "fa-check",
                type: "suceess"
            });
        })
    }

    get purchasedCredits() {
        return this.store.getters.getPurchasedCredits;
    }

    get purchasedAmount() {
        return this.store.getters.getPurchasedAmount;
    }
}
</script>