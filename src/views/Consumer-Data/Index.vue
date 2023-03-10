<template>
  <div class="ma--top-1 sites--container">
    <div class="loading" v-if="request._loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header justify--flex-end">

            <div 
              class="dropdown"
              v-click-outside="clickOutSideFilter"
            >
              <button 
                type="submit" 
                class="btn btn--primary"
                @click="showFilters = !showFilters"
              >
                <i class="fa fa-filter btn--icon__prefix"></i>
                <span class="btn--name">Filter</span>
              </button>

              <div
                class="dropdown-menu dropdown-menu__right"
                :class="{ show: showFilters }"
                style="width: 250px;"
              >
                <div class="form-field form-field__outline ma-1">
                  <div class="form-field__outline--control">
                    <input 
                      type="text" 
                      class="form-field__outline--control__input" 
                      v-model="request.city"
                      v-outline 
                    />
                    <label for="city" class="form-field__outline--control__label">City</label>
                  </div>
                </div>

                <div class="form-field form-field__outline ma-1">
                  <div class="form-field__outline--control">
                    <input 
                      type="text" 
                      class="form-field__outline--control__input" 
                      v-model="request.state"
                      v-outline 
                    />
                    <label for="state" class="form-field__outline--control__label">State</label>
                  </div>
                </div>

                <div class="form-field form-field__outline ma-1">
                  <div class="form-field__outline--control">
                    <input 
                      type="text" 
                      class="form-field__outline--control__input" 
                      v-model="request.zip"
                      v-outline 
                    />
                    <label for="zipcode" class="form-field__outline--control__label">Zipcode</label>
                  </div>
                </div>

                <button 
                  type="button" 
                  class="btn btn--success ma-1 text--size-1" 
                  style="width: 90%;"
                  @click="applyFilters"
                >
                  Filter
                </button>
                
              </div>
            </div>
            

          </div>
          <div class="card-content" v-if="!request._loading">
            <table class="table table--striped">
              <thead>
                <tr>
                  <th class="text--align-left">Firstname</th>
                  <th class="text--align-left">Lastname</th>
                  <th class="text--align-left">Address</th>
                  <th class="text--align-left">City</th>
                  <th class="text--align-left">State</th>
                  <th class="text--align-right">Zipcode</th>
                  <th class="text--align-left">Marital status</th>
                  <th class="text--align-left">Gender</th>
                  <th class="text--align-left">Children</th>
                  <th class="text--align-right">Income</th>
                  <th class="text--align-right">Age</th>
                  <th class="text--align-left">Language Spoken</th>
                  <th class="text--align-left">Religion</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response.data" :key="index">
                  <td class="text--align-left">{{ item.firstName }}</td>
                  <td class="text--align-left">{{ item.lastname }}</td>
                  <td class="text--align-left">{{ item.physicalAddress }}</td>
                  <td class="text--align-left">{{ item.city }}</td>
                  <td class="text--align-left">{{ item.state }}</td>
                  <td class="text--align-right">{{ item.zip }}</td>
                  <td class="text--align-left">{{ item.maritalStatus }}</td>
                  <td class="text--align-left">{{ item.gender }}</td>
                  <td class="text--align-left">{{ item.childrenPresent }}</td>
                  <td class="text--align-right">{{ item.income }}</td>
                  <td class="text--align-right">{{ item.age }}</td>
                  <td class="text--align-left">{{ item.languageSpoken }}</td>
                  <td class="text--align-left">{{ item.religion }}</td>
                </tr>
                <tr v-if="response.data.length == 0">
                  <td colspan="13">      
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img
                        src="../../assets/no-data.png"
                        alt="No Data"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <Pagination
              :totalResults="response.pageInfo.totalResults"
              :totalPages="response.pageInfo.totalPages"
              :showPage="response.data.length"
              v-if="response"
              @applyPagination="controlWithPagination"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import { useStore } from "vuex";

import { DataResponse, ConsumerDataRequestModel, ConsumerDataResponseModel } from "@/model";

import { IConsumerDataService } from '@/service';

import Pagination from "@/components/controls/Pagination.vue";

@Options({
  components: {
    Pagination
  }
})
export default class ConsumerData extends Vue {
  @Inject('consumerService') service: IConsumerDataService;

  public store = useStore();
  public subscription: any = null;

  public request: ConsumerDataRequestModel = new ConsumerDataRequestModel();
  public response: DataResponse<ConsumerDataResponseModel> = new DataResponse();

  public showFilters:boolean = false;

  created() {
    let userType = localStorage.getItem("userType") || "";
    if(userType != 'ADMIN') this.$router.push('/dashboard');
    this.getConsumerData();
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getConsumerData();
    });
  }

  public getConsumerData() {
    this.request.siteId = this.siteId;
    this.service.getConsumerData(this.request).then((response) => {
      this.response = response;
    })
  }

  public controlWithPagination(page: number, pageSize: number) {
    this.request.page = page;
    this.request.pageSize = pageSize;
    this.getConsumerData();
  }

  public applyFilters() {
    this.request.page = 1;
    this.request.pageSize = 10;
    this.showFilters = false;
    this.getConsumerData();
  }

  public clickOutSideFilter() {
    this.showFilters = false;
  }

  get siteId() {
    return this.store.getters.getSiteId;
  }

}
</script>