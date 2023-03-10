<template>
    <div 
        v-if="showSnackbar"
        class="snack--bar"
        :class="snackBarClass"
    >
        <i
            class="fa snack--bar__icon"
            :class="{
                'fa-times': snackBarClass == 'snack--bar__error',
                'fa-check': snackBarClass == 'snack--bar__success'
            }"
        >
        </i>
        <div class="snack--bar__message">
            {{message}}
        </div>
         <i
            class="fa fa-times snack--bar__clear"
            @click="showSnackbar = false;"
        >
        </i>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { useStore } from 'vuex';

export default class Snackbar extends Vue {

    public store = useStore();
    public message:string = '';
    public snackBarClass: string = '';
    public showSnackbar: boolean = false;

    mounted() {
        this.store.subscribe((mutation, state) => {
            if(mutation.type == 'onShowSnackbar') {
                this.message = state['ContextModule'].message;
                this.snackBarClass = state['ContextModule'].snackBarClass;
                this.showSnackbar = true;

                setTimeout(() => {
                    this.showSnackbar = false;
                }, 10000)
            }
        });
        
    }
}
</script>