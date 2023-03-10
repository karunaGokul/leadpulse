<template>
  <div
    class="form-checkbox"
    :class="{ 'form-checkbox--checked': value }"
    @click="onChange"
  >
    <input type="checkbox" />
    <label>{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from "vue-property-decorator";

export default class Checkbox extends Vue {
  @Prop({ required: true, default: "" }) label: string;
  @Prop({ default: false }) value: boolean;

  onChange() {
      this.$emit("input", this.value ? false : true);
      this.$emit("change", this.value ? false : true);
  }
}
</script>