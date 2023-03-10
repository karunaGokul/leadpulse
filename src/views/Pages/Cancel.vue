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
import { useStore } from "vuex";

export default class Cancel extends Vue {
    public store = useStore();

    mounted() {
        this.cancelCredit();
    }

    private cancelCredit() {
        this.store.dispatch("addPurchaseCredits", 0);
        this.$router.push('/billing');
    }
}
</script>