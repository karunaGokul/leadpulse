<template>
    <div class="pagination--container">
        <!-- <div class="pagination--size__wrapper">
            Items per page: 
            <div class="pagination--size__wrapper--input">
                <div class="form-field form-field__standard">
                    <div class="form-field__control form-field__control--icon">
                        <input type="text" class="form-field__input" v-model="pageSize" @click="triggerAutocomplete = true" readonly/> 
                        <div class="form-field__control--icon__suffix fa fa-sort-down"></div>
                    </div>
                </div>
                <div 
                    class="autocomplete"
                    :class="{
                        'show': triggerAutocomplete
                    }"
                >
                    <div 
                        class="autocomplete__count"
                        v-for="(item, index) in pageSizeOptions" 
                        :key="index"
                        @click="updatePagination(item)"
                    >
                        {{item}}
                    </div>
                </div>
            </div>
        </div> -->
        <div class="pagination--page__count ma--left-1">{{(pageSize * (page - 1)) + 1}} - {{ (pageSize * (page - 1)) + showPage}} of {{totalResults}}</div>
        <div class="pagination--options">
            <button class="btn btn--icon ma--left-1" :disabled="page == 1" @click="prev">
                <i class="fa fa-chevron-left"></i>
            </button>
            <button class="btn btn--icon ma--left-1" :disabled="totalPages == page" @click="next">
                <i class="fa fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>
<script lang="ts">
import { Vue } from 'vue-class-component';
import { Prop } from "vue-property-decorator";

export default class Pagination extends Vue {
    @Prop() totalResults: number;
    @Prop() showPage: number;
    @Prop() totalPages: number;

    public page:number = 1;
    public pageSizeOptions: Array<number> = [10, 25, 50];
    public pageSize: number = 10;
    public triggerAutocomplete:boolean = false;

    public updatePagination(pageSize: number) {
        this.triggerAutocomplete = false;
        this.pageSize = pageSize;
        //if(this.totalResults > this.pageSize) this.onChange();
        this.onChange();
    }

    public prev() {
        this.page = this.page - 1;
        this.onChange();
    }

    public next() {
        this.page = this.page + 1;
        this.onChange();
    }

    onChange() {
        this.$emit("applyPagination", this.page, this.pageSize);
    }
}
</script>