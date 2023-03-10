<template>
  <div class="dashboard--container pa--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div v-else>
      <div class="row" v-if="response">
        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--available">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ response.leadsAvaialable }}
                  </div>
                  <div class="card-content--text">Leads Avaliable</div>
                </div>
                <div class="col-4 text--align-center">
                  <a class="fa fa-user card-content--icon"></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--purchased">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ response.purchasedLeads }}
                  </div>
                  <div class="card-content--text">Leads Purchased</div>
                </div>
                <div class="col-4 text--align-center">
                  <a class="fa fa-cart-arrow-down card-content--icon"></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--spent">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ response.totalSpent }}
                  </div>
                  <div class="card-content--text">Total Spent</div>
                </div>
                <div class="col-4 text--align-center">
                  <a class="fa fa-dollar-sign card-content--icon"></a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-xl-3 ma--bottom-1">
          <div class="card card--sites">
            <div class="card-content ma--top-1">
              <div class="row">
                <div class="col-8">
                  <div class="text--weight-bold card-content--count">
                    {{ response.sites }}
                  </div>
                  <div class="card-content--text">Total Sites</div>
                </div>
                <div class="col-4 text--align-center">
                  <a class="fa fa-sitemap card-content--icon"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row ma--bottom-1">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-chart-bar"></i>
                Leads by Date
              </div>
            </div>
            <div class="card-content">
              <BarChart
                :xAxis="xAxis"
                :chartData="chartData"
                v-if="response.leadsByDate"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xl-6 col-md-12 ma--bottom-1">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-location-arrow"></i>
                Top Locations
              </div>
            </div>
            <div class="card-content table--container">
              <table class="table table--striped">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">State</th>
                    <th class="text--align-left">ZipCode</th>
                    <th class="text--align-right">Leads</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) of topLocations" :key="index">
                    <td class="text--align-left">{{ item.state }}</td>
                    <td class="text--align-left">{{ item.zipcode }}</td>
                    <td class="text--align-right">{{ item.leads }}</td>
                  </tr>
                  <tr v-if="topLocations.length == 0">
                    <td colspan="3">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No Data" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-xl-6 col-md-12 ma--bottom-1">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-store"></i>
                Recent Purchases
              </div>
            </div>
            <div class="card-content table--container">
              <table class="table table--striped">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">Date</th>
                    <th class="text--align-left">Leads</th>
                    <th class="text--align-right">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) of recentPurchases" :key="index">
                    <td class="text--align-left">
                      {{ $filters.dateDisplay(item.date) }}
                    </td>
                    <td class="text--align-left">{{ item.totalLeads }}</td>
                    <td class="text--align-right">{{ item.amount }}</td>
                  </tr>
                  <tr v-if="recentPurchases.length == 0">
                    <td colspan="3">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No Data" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="row ma--bottom-1">
        <div class="col-xl-12">
          <div class="card">
            <div class="card-header">
              <div class="card-header--title text--weight-bold text--size-1-3">
                <i class="fa fa-user"></i>
                Recent Leads
              </div>
            </div>
            <div class="card-content">
              <table class="table table--striped" v-if="leadsResponse">
                <thead class="table--header">
                  <tr>
                    <th class="text--align-left">State</th>
                    <th class="text--align-left">Zipcode</th>
                    <th class="text--align-left">City</th>
                    <th class="text--align-left">Website</th>
                    <th class="text--align-left">First Name</th>
                    <th class="text--align-left">Last Name</th>
                    <th class="text--align-left">Email</th>
                    <th class="text--align-left">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in leadsResponse.data" :key="index">
                    <td class="text--align-left">{{ item.state }}</td>
                    <td class="text--align-left">{{ item.zipcode }}</td>
                    <td class="text--align-left" style="opacity: 0.2">
                      **********
                    </td>
                    <td class="text--align-left" style="opacity: 0.2">
                      **********
                    </td>
                    <td class="text--align-left" style="opacity: 0.2">
                      {{ item.firstName }}
                    </td>
                    <td class="text--align-left" style="opacity: 0.2">
                      {{ item.lastName }}
                    </td>
                    <td class="text--align-left" style="opacity: 0.2">
                      {{ item.email }}
                    </td>
                    <td class="text--align-left" style="opacity: 0.2">
                      {{ item.phone }}
                    </td>
                  </tr>
                  <tr v-if="leadsResponse.data.length == 0">
                    <td colspan="8">
                      <div class="table__body--empty">
                        <div>No data to display</div>
                        <img src="../../assets/no-data.png" alt="No Data" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { Inject } from "vue-property-decorator";
import moment from "moment";

import { useStore } from "vuex";

import { IDashboardService, ILeadsService } from "@/service";
import {
  DashboardRequestModel,
  DashboardModel,
  DataResponse,
  LeadsRequestModel,
  LeadsModel,
} from "@/model";

import BarChart from "@/components/chart/BarChart.vue";

@Options({
  components: {
    BarChart,
  },
})
export default class Dashboard extends Vue {
  @Inject("dashboardService") service: IDashboardService;
  @Inject("leadsService") leadsService: ILeadsService;

  public store = useStore();
  public subscription: any = null;

  public response: DashboardModel = new DashboardModel();
  public topLocations: Array<any> = [];
  public recentPurchases: Array<any> = [];
  public xAxis: Array<string> = [];
  public chartData: Array<string> = [];

  public leadsResponse: DataResponse<LeadsModel> = new DataResponse();

  public loading: boolean = false;

  created() {
    this.getDashboardInfo();
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getDashboardInfo();
    });
  }

  unmounted() {
    if (this.subscription) this.subscription();
  }

  public getDashboardInfo() {
    if (this.store.getters.getSiteId) {
      this.loading = true;
      const request = new DashboardRequestModel();
      request.siteId = this.store.getters.getSiteId;
      this.service.getDashboardInfo(request).then((response) => {
        this.response = response;
        this.bindChart();
        this.getLeads();
        this.loading = false;
      });
    } else this.$router.push("/sites");
  }

  public getLeads() {
    this.loading = true;
    const request = new LeadsRequestModel();
    request.siteId = this.store.getters.getSiteId;
    this.leadsService.getAvailableLeads(request).then((response) => {
      this.loading = false;
      this.leadsResponse = response;
    });
  }

  public bindChart() {
    this.xAxis = [];
    this.chartData = [];
    this.topLocations = Object.entries(this.response.topLocationsByLeads).map(
      (e) => ({
        zipcode: e[0].split(":")[0],
        state: e[0].split(":")[1],
        leads: e[1],
      })
    );

    this.recentPurchases = Object.entries(this.response.totalAmountByDate).map(
      (e) => ({
        date: e[0].split(":")[0],
        totalLeads: e[0].split(":")[1],
        amount: e[1],
      })
    );

    this.xAxis = Object.keys(this.response.leadsByDate);
    this.chartData = Object.values(this.response.leadsByDate);
  }

  applyFilters(date: any) {
    if (!date) return (date = "");

    date = moment(date).format("MM-DD-YYYY");
    return date;
  }
}
</script>