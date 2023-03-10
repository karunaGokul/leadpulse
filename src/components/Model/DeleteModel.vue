<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal" style="width: 500px">
      <div class="modal__header modal__header--success">
        <h3 class="modal__header--title">
          <i class="fa fa-trash"></i>
          {{ title }}
        </h3>
        <a class="fa fa-times modal__header--clear" @click="close"> </a>
      </div>
      <div class="modal__content text--align-center pa-2">
        Are sure do you want to delete {{ name }}?
      </div>
      <div class="modal__footer">
        <button type="button" class="btn btn--primary" @click="deleteFile">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import { Prop } from "vue-property-decorator";

export default class Delete extends Vue {
  @Prop() title: string;
  @Prop() name: string;

  public deleteFile() {
    this.$emit("closeModel", true);
  }

  public close() {
    this.$emit("closeModel", false);
  }
}
</script>