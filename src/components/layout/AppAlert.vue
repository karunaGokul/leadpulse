<template>
  <div class="modal-container show" v-if="dialog">
    <div class="blocker"></div>
    <div class="modal" style="width: 400px;height: 300px">
      <div class="modal__content alert text--align-center">
        <span class="alert--icon fa" :class="className" v-if="className"></span>
        <p v-html="message" class="alert--message"></p>
      </div>
      <div class="modal__footer">
        <button class="btn" type="button" @click="dialog = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { useStore } from 'vuex';

export default class AppAlert extends Vue {

  public store = useStore();

  dialog: boolean = false;
  message: string = "";
  className: string = "";

  mounted() {
    this.store.subscribe((mutation, state) => {
      if(mutation.type == 'onShowAlert') {
        this.message = state['ContextModule'].message;
        this.className = state['ContextModule'].snackBarClass;
        this.dialog = true;
      }
    });
  }

}
</script>