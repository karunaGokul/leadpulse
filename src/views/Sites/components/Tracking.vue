<template>
    <div class="modal-container show">
        <div class="blocker"></div>
        <div class="modal" style="width: 800px;">
          <div class="modal__header modal__header--success">
            <h3 class="clipboard__header--title">Pixel activation</h3>
            <a
              class="fa fa-times clipboard__header--clear"
              @click="clearPixel"
            >
            </a>
          </div>
          <div class="modal__content">

            <div class="clipboard--help__desk pa--top-1 pa--bottom-2">
              <div class="clipboard--help__desk--count">1</div>
              <div class="clipboard--help__desk--content">
                <div class="clipboard--help__desk--content__text"> Copy this pixel code:</div>
                <div class="clipboard--help__desk--content__input">
                  <div class="clipboard--help__desk--content__input--msg">
                    {{pixelId}}
                  </div>
                  <button 
                    class="clipboard--help__desk--content__input--copy"
                    v-clipboard:copy="pixelId"
                    v-clipboard:success="copyClipboard"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            <div class="clipboard--help__desk pa--y-2">
              <div class="clipboard--help__desk--count">2</div>
              <div class="clipboard--help__desk--content__text"> Place the copied code on your website before the end of the body tag.</div>
            </div>


            <div class="clipboard--help__desk pa--y-2">
              <div class="clipboard--help__desk--count">3</div>
              <div class="clipboard--help__desk--content__text"> Once your pixel is placed correctly, you'll receive a confirmation email and site will be activated</div>
            </div>

          </div> 
        </div>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from "vue-property-decorator";
import { useStore } from "vuex";

export default class PixelTracking extends Vue {
@Prop() pixelId: any;

public store = useStore();

public copyClipboard() {
    this.store.dispatch("showSnack", { message: "Clipboard copied", snackBarClass: 'snack--bar__success' });
}

public clearPixel() {
  this.$emit('closePixel', false);
}

}
</script>