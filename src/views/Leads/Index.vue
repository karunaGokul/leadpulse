<template>
  <div class="pa--top-1">
    <div class="tabs ma--x-1 ma--top-1">
      <div
        class="tabs--item"
        :class="{
          'tabs--item__active': selectedLeadsType == 'Available',
        }"
        @click="selectedLeadsType = 'Available'"
      >
        Available
      </div>
      <div
        class="tabs--item"
        :class="{
          'tabs--item__active': selectedLeadsType == 'Purchased',
        }"
        @click="selectedLeadsType = 'Purchased'"
      >
        Purchased
      </div>
    </div>
    <AvaliableLeads v-if="selectedLeadsType == 'Available'" />
    <PurchasedLeads v-if="selectedLeadsType == 'Purchased'" />
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import AvaliableLeads from "./AvaliableLeads/Index.vue";
import PurchasedLeads from "./PurchasedLeads/Index.vue";

@Options({
  components: {
    AvaliableLeads,
    PurchasedLeads,
  },
})
export default class Leads extends Vue {
  public selectedLeadsType = "Available";
}
</script>