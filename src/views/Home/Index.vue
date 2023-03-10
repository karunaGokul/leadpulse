<template>
  <div>
    <header class="header">
      <div
        class="side-bar"
        :class="{ 'side-bar__small': !sideBar, 'side-bar__large': sideBar }"
      >
        <div class="side-bar__navigation text--align-center">
          <i class="fa fa-bars" @click="updateSideBar"></i>
        </div>
        <ul class="side-bar--column">
          <router-link
            to="/dashboard"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
            exact
          >
            <a class="fa fa-home side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Dashboard</span>
          </router-link>

          <router-link
            to="/leads"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
          >
            <a class="fa fa-id-badge side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Leads</span>
          </router-link>

          <router-link
            to="/sites"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
          >
            <a class="fa fa-file-invoice side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Sites</span>
          </router-link>

          <router-link
            to="/billing"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
          >
            <a class="fa fa-dollar-sign side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Billing</span>
          </router-link>

          <router-link
            to="/users"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
          >
            <a class="fa fa-user side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Users</span>
          </router-link>

          <router-link
            to="/support"
            tag="li"
            class="side-bar--column__item"
            active-class="side-bar--column__item--active"
          >
            <a class="fa fa-question side-bar--column__item--icon"></a>
            <span class="side-bar--column__item--name">Support</span>
          </router-link>
        </ul>
      </div>
      <div
        class="toolbar"
        :class="{ toolbar__small: sideBar, toolbar__large: !sideBar }"
      >
        <div class="toolbar--logo">
          <img
            src="../../assets/lp-logo.png"
            alt="Lead Pulse"
            class="toolbar--logo__img"
          />
        </div>
        <div
          class="toolbar--page__info ma--x-1 pa--y-1 text--size-1-2 text--weight-bold"
        >
          {{ page }}
        </div>
        <span class="toolbar--spacer"></span>

        <div class="toolbar--right">
          <div
            class="dropdown ma--x-2"
            v-click-outside="clickOutSideSite"
            v-if="page != 'Sites' && page != 'Support' && page != 'Billing'"
          >
            <div class="dropdown-toggle" @click="sitesToggle = !sitesToggle">
              {{ siteName }}
            </div>
            <ul
              class="dropdown-menu dropdown-menu__left"
              :class="{ show: sitesToggle }"
            >
              <li
                class="dropdown-item"
                :class="{ 'dropdown-item-active': siteName == item.siteName }"
                v-for="(item, index) in siteResponse.data"
                :key="index"
                @click="updateSiteId(item)"
              >
                {{ item.siteName }}
              </li>
            </ul>
          </div>
          <div class="toolbar--credits">Available Credits: {{ credits }}</div>
          <div
            class="notifications"
            :class="{
              show: showNotifications,
            }"
            v-click-outside="clickOutSideNotifications"
          >
            <a
              class="fa fa-bell ma--right-4 notifications--icon"
              @click="
                notificationCount > 0
                  ? (showNotifications = !showNotifications)
                  : ''
              "
            >
              <span class="notifications--icon__count">{{
                notificationCount >= 10 ? "!" : notificationCount
              }}</span>
            </a>
            <div
              class="notifications--menu notifications--menu__left"
              :class="{
                show: showNotifications,
              }"
              v-if="enableNotifications"
            >
              <div class="notifications--menu__header">Notifications</div>
              <div class="notifications--menu__content">
                <div
                  class="notifications--menu__item"
                  v-for="(item, index) of notifications"
                  :key="index"
                >
                  <div class="notifications--menu__item--icon">
                    <i
                      class="fa"
                      :class="{
                        'fa-download': item.type == 'READYTODOWNLOAD',
                        'fa-file-invoice': item.type == 'LEADSAVAILABLE',
                      }"
                    >
                    </i>
                  </div>
                  <div>
                    <div class="notifications--menu__item--message">
                      {{ item.message }}
                    </div>
                    <div class="notifications--menu__item--time">
                      {{ $filters.timeDisplay(item.timeinMillis) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="toolbar--dropdown dropdown"
            v-click-outside="clickOutSideUser"
          >
            <div
              class="toolbar--dropdown__avator"
              v-if="userName"
              @click="userToggle = !userToggle"
            >
              {{ userName.charAt(0).toUpperCase() }}
            </div>
            <div
              class="dropdown-menu dropdown-menu__left"
              :class="{ show: userToggle }"
            >
              <div class="toolbar--dropdown__username">
                <i class="fa fa-hand-spock hello--icon"></i>
                Hi
                {{ userName }}
              </div>
              <ul>
                <li class="dropdown-item" @click="editProfile()">
                  <i class="fa fa-user-circle"></i>
                  Edit Profile
                </li>
                <li
                  class="dropdown-item"
                  @click="
                    userToggle = false;
                    allowChangePassword = true;
                  "
                >
                  <i class="fa fa-key"></i>
                  Change Password
                </li>
                <li class="dropdown-item" @click="logout">
                  <i class="fa fa-sign-out-alt"></i>
                  Sign out
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <main
      class="content-page"
      :class="{ small__content: sideBar, large__content: !sideBar }"
    >
      <div class="display--flex overflow--hidden">
        <div class="content--wrapper">
          <router-view v-if="allow"></router-view>
          <AppAlert />
          <AppFooter />
          <CreateUser
            accessType="Edit Profile"
            :data="userRequest"
            @closeModel="onCloseProfileModel"
            v-if="toggleEditProfileModel"
          />
          <ChangePassword
            :email="userName"
            v-if="allowChangePassword"
            @closePassword="onClosePassword"
          />
        </div>
        <div class="help--desk-container">
          <div
            class="help--desk"
            :class="{
              'show--desk': helpDesk,
              'hide--desk': !helpDesk,
            }"
          >
            <button
              class="btn btn--primary help--desk__button"
              @click="updateHelpDeskStatus"
              :class="{
                'help--desk__button--active': helpDesk,
              }"
            >
              Help
            </button>
            <div class="help--desk__content"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { useStore } from "vuex";
import { Inject } from "vue-property-decorator";

import { ISitesService, IUserService, INotificationsService } from "@/service";
import {
  DataResponse,
  SitesRequestModel,
  SitesModel,
  NotificationsModel,
  CreateUserRequestModel,
} from "@/model";

import AppAlert from "@/components/layout/AppAlert.vue";
import AppFooter from "@/components/layout/AppFooter.vue";
import ChangePassword from "./components/ChangePassword.vue";
import CreateUser from "../../components/Model/CreateUser.vue";

@Options({
  components: {
    AppAlert,
    AppFooter,
    CreateUser,
    ChangePassword,
  },
})
export default class Home extends Vue {
  @Inject("sitesService") sitesService: ISitesService;
  @Inject("userService") service: IUserService;
  @Inject("notificationsService") notificationsService: INotificationsService;

  public store = useStore();
  public userToggle = false;
  public userName: string;

  public sitesToggle: boolean = false;
  public siteId: number = 0;
  public siteName: string = "";

  public siteResponse: DataResponse<SitesModel> = new DataResponse();

  public allow: boolean = false;

  public showNotifications: boolean = false;
  public allowChangePassword: boolean = false;

  public toggleEditProfileModel: boolean = false;

  public userRequest = new CreateUserRequestModel();

  public notifications: Array<NotificationsModel> = [];
  public notificationCount: number = 0;
  public enableNotifications: boolean = false;
  public credit: number = 0;

  public userType: string = "";

  created() {
    this.userName = localStorage.getItem("userName") || "";
    this.userType = localStorage.getItem("userType") || "";
    this.getAllSites();
    this.store.dispatch("updateCredits");
    this.getNotifications();
    this.getNotificationCount();
  }

  public getAllSites() {
    const request = new SitesRequestModel();
    this.sitesService.getSites(request).then((response) => {
      this.siteResponse = response;
      this.allow = true;

      if (this.siteResponse.data.length <= 0) this.$router.push("/sites");
      else {
        this.siteName = this.siteResponse.data[0].siteName;
        this.siteId = this.siteResponse.data[0].id;
        this.store.dispatch("updateSiteId", this.siteId);
      }
    });
  }

  private getNotificationCount() {
    this.notificationsService.getNotificationCount().then((response) => {
      this.notificationCount = response;
    });
  }

  private getNotifications() {
    this.notificationsService.getNotifications().then((response) => {
      this.notifications = response;
    });
  }

  public editProfile() {
    this.service.getCurrentUser().then((response) => {
      this.userRequest = response;
      this.userToggle = false;
      this.toggleEditProfileModel = true;
    });
  }

  public onCloseProfileModel(trigger: boolean) {
    this.toggleEditProfileModel = false;
  }

  public updateSiteId(site: any) {
    this.siteName = site.siteName;
    this.siteId = site.id;
    this.sitesToggle = false;
    this.store.dispatch("updateSiteId", this.siteId);
  }

  logout() {
    this.store.dispatch("logout");
    this.$router.push("/login");
  }

  public updateHelpDeskStatus() {
    this.store.dispatch("triggerHelpDesk");
  }

  public onClosePassword() {
    this.allowChangePassword = false;
  }

  public clickOutSideSite() {
    this.sitesToggle = false;
  }

  public clickOutSideNotifications() {
    this.showNotifications = false;
  }

  public clickOutSideUser() {
    this.userToggle = false;
  }

  public updateSideBar() {
    this.store.dispatch("updateSideBar");
  }

  get page() {
    return this.$route.name;
  }

  get userInfo() {
    return this.store.getters.userInfo;
  }

  get helpDesk() {
    return this.store.getters.getHelpDeskStatus;
  }

  get credits() {
    return this.store.getters.getCredits ? this.store.getters.getCredits : 0;
  }

  get sideBar() {
    return this.store.getters.getSideBarStatus;
  }
}
</script>