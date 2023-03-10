<template>
    <div 
        class="form-field form-field--is-active"
        v-click-outside="clickOutSideAutoComplete"
    >
        <div class="form-field__control">
            <input 
                type="input" 
                class="form-field__select" 
                @click="showAutoComplete = true;"
                v-model="selectedItem"
                readonly
            />
            <label :for="label" class="form-field__select--label">{{label}} *</label>
            <i 
                class="fa form-field__select--arrow"
                :class="{
                    'fa-sort-down': !showAutoComplete,
                    'fa-sort-up': showAutoComplete
                }"
            >
            </i>
        </div>
        <div 
            class="autocomplete"
            v-if="showAutoComplete"
        >
            <div 
                class="autocomplete__item"
                v-for="(item, index) of fields"
                :key="index"
                @click="update(item)"
                :class="{
                    'autocomplete__item--active': item == selectedItem
                }"
            >
                {{item}}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from "vue-property-decorator";

export default class Selectbox extends Vue {

    @Prop() label: string;
    @Prop() value: string;
    @Prop() fields: Array<string>;

    public selectedItem: string = '';
    public showAutoComplete:boolean = false;

    created() {
        this.selectedItem = this.value;
    }

    public update(value: string) {
        this.selectedItem = value;
        this.showAutoComplete = false;
        this.$emit("update", this.selectedItem);
    }

    public clickOutSideAutoComplete() {
        if(this.showAutoComplete)   this.showAutoComplete = false;
    }

}
</script>