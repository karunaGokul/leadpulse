<template>
  <div class="modal-container show">
    <div class="blocker"></div>
    <div class="modal download" style="width: 500px">
      <div class="modal__content">
        <a class="fa fa-times modal__header--clear float--right" @click="close">
        </a>
        <p class="download--header">Download Format?</p>
        <div class="text--align-center">
          <i class="fa fa-download download--icon"></i>
        </div>
        <div class="btn--group justify--center pa-1 ma--top-1">
          <button class="btn btn--teal ma--x-1" @click="download('csv')">
            CSV
          </button>
          <button class="btn btn--teal ma--x-1" @click="download('pdf')">
            PDF
          </button>
          <button class="btn btn--teal ma--x-1" @click="download('xlsx')">
            XLSX
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";

export default class DownloadFile extends Vue {
  public close() {
    this.$emit("close");
  }

  public download(format: string) {
    this.$emit("download", "leads." + format);
  }
}
</script>