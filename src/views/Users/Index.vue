<template>
  <div class="users--container ma--top-1">
    <div class="loading" v-if="loading">
      <div class="loading-pulse"></div>
    </div>
    <div class="row ma--bottom-1" v-else>
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <div class="btn--group">
              <button
                class="btn btn--primary"
                @click="createUser('Add User')"
                v-if="userType == 'ADMIN'"
              >
                <i class="fa fa-user-plus btn--icon__prefix"></i>
                <span class="btn--name">Add User</span>
              </button>
              <button
                class="btn btn--success ma--x-1"
                @click="toggleAssignUserModel = true"
                v-if="userType == 'ADMIN'"
              >
                <i class="fa fa-id-card-alt btn--icon__prefix"></i>
                <span class="btn--name">Assign User</span>
              </button>
            </div>
          </div>
          <div class="card-content">
            <table class="table table--hover">
              <thead class="table--header">
                <tr>
                  <th class="text--align-left">Firstname</th>
                  <th class="text--align-left">Lastname</th>
                  <th class="text--align-left">Email</th>
                  <th class="text--align-left">Phone No</th>
                  <th class="text--align-left">Company Name</th>
                  <th class="text--align-left">Industry</th>
                  <th class="text--align-center" v-if="userType == 'ADMIN'">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in response" :key="index">
                  <td class="text--align-left">{{ item.firstName }}</td>
                  <td class="text--align-left">{{ item.lastName }}</td>
                  <td class="text--align-left">{{ item.email }}</td>
                  <td class="text--align-left">{{ item.phone }}</td>
                  <td class="text--align-left">{{ item.companyName }}</td>
                  <td class="text--align-left">{{ item.industry }}</td>
                  <td class="text--align-center" v-if="userType == 'ADMIN'">
                    <button
                      class="btn--inline btn--edit"
                      @click="createUser('Update User', item)"
                      data-tooltip="Update user"
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                    <button
                      class="btn--inline btn--lock"
                      :data-tooltip="item.locked ? 'Unlock user' : 'Lock user'"
                      @click="restrictUser(item)"
                    >
                      <i
                        class="fa"
                        :class="{
                          'fa-lock-open': !item.locked,
                          'fa-lock': item.locked,
                        }"
                      >
                      </i>
                    </button>
                    <button
                      class="btn--inline btn--delete"
                      @click="openDeleteModel(item.id, item.firstName)"
                      data-tooltip="Delete user"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="response.length == 0">
                  <td colspan="7">
                    <div class="table__body--empty">
                      <div>No data to display</div>
                      <img src="../../assets/no-data.png" alt="No Data" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <CreateUser
              :accessType="accessType"
              :data="request"
              @closeModel="onCloseCreateUserModel"
              v-if="toggleCreateModel"
            />
            <Delete
              title="Delete User"
              :name="firstName + ' user'"
              @closeModel="onCloseDeleteModel"
              v-if="toggleDeleteModel"
            />
            <AssignUser
              :siteId="store.getters.getSiteId"
              @close="onCloseAssignModel"
              @assigned="assignedEmail"
              v-if="toggleAssignUserModel"
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
import axios from "axios";

import { useStore } from "vuex";

import { IUserService } from "@/service";
import {
  UsersRequestModel,
  UsersResponseModel,
  CreateUserRequestModel,
} from "@/model";

import CreateUser from "@/components/Model/CreateUser.vue";
import Delete from "@/components/Model/DeleteModel.vue";
import AssignUser from "./components/AssignUser.vue";

@Options({
  components: {
    CreateUser,
    AssignUser,
    Delete,
  },
})
export default class Users extends Vue {
  @Inject("userService") service: IUserService;

  public store = useStore();
  public subscription: any = null;

  public siteId: number = 0;
  public firstName: string = "";

  public accessType: string = "Add User";

  public toggleCreateModel: boolean = false;
  public toggleDeleteModel: boolean = false;
  public toggleAssignUserModel: boolean = false;
  public loading: boolean = false;

  public request = new UsersResponseModel();
  public response: Array<UsersResponseModel> = [];

  public restrict = new CreateUserRequestModel();

  public userType: string = "";

  created() {
    this.getUsers();
    this.userType = localStorage.getItem("userType") || "";
  }

  mounted() {
    this.subscription = this.store.subscribe((mutations, type) => {
      if (mutations.type == "onChangeSiteId") this.getUsers();
    });
  }

  public getUsers() {
    if (this.store.getters.getSiteId) {
      this.loading = true;
      const request = new UsersRequestModel();
      request.siteId = this.store.getters.getSiteId;
      this.service.getUser(request).then((response) => {
        this.loading = false;
        this.response = response;
      });
    } else this.$router.push("/sites");
  }

  public createUser(accessType: string, request?: UsersResponseModel) {
    if (request) this.request = request;
    this.accessType = accessType;
    this.toggleCreateModel = true;
  }

  public onCloseCreateUserModel(trigger: boolean) {
    this.toggleCreateModel = false;
    this.accessType = "";
    if (trigger) this.getUsers();
  }

  public openDeleteModel(id: number, firstName: string) {
    this.toggleDeleteModel = true;
    this.siteId = id;
    this.firstName = firstName;
  }

  private onCloseDeleteModel(trigger: boolean) {
    this.toggleDeleteModel = false;
    this.firstName = "";
    if (trigger) this.deleteUser();
  }

  public onCloseAssignModel() {
    this.toggleAssignUserModel = false;
  }

  public assignedEmail() {
    this.toggleAssignUserModel = false;
    this.store.dispatch("showAlert", {
      message: "User assigned successfully",
      snackBarClass: "fa-check",
      type: "suceess",
    });
    this.getUsers();
  }

  private deleteUser() {
    axios.defaults.headers.common["Authorization"] = "";
    this.service.deleteUser(this.siteId).then((response) => {
      this.store.dispatch("showAlert", {
        message: "User deleted successfully",
        snackBarClass: "fa-check",
        type: "suceess",
      });
      this.siteId = 0;
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.store.getters.accessToken;
      this.getUsers();
    });
  }

  public restrictUser(item: UsersResponseModel) {
    item.locked = !item.locked;
    item.type = "ADDUSER";
    item.siteId = this.store.getters.getSiteId;
    this.restrict = item;
    this.loading = true;
    axios.defaults.headers.common["Authorization"] = "";
    this.service
      .updateUser(this.restrict)
      .then((response) => {
        this.loading = false;
        this.store.dispatch("showAlert", {
          message: item.locked
            ? "User locked successfully"
            : "User unlocked successfully",
          snackBarClass: "fa-check",
          type: "suceess",
        });
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + this.store.getters.accessToken;
        this.getUsers();
      })
      .catch((error) => {
        if (error.response.status == 400)
          this.store.dispatch("showAlert", {
            message: error.response.data,
            snackBarClass: "fa-times",
            type: "error",
          });
        this.loading = false;
      });
  }
}
</script>