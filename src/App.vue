<template>
  <div id="app">
    <Snackbar />
    <router-view/>
  </div>
  
</template>

<script lang="ts">
import { Vue, Options } from 'vue-class-component';
import axios from "axios";
import { AxiosResponse, AxiosError } from "axios";
import { AuthenticationResponse } from "@/model";
import './styles/main.scss';

import Snackbar from "@/components/controls/Snackbar.vue";

import { DIContainer } from "./dicontainer";

import { useStore } from "vuex";

@Options({
  components: { Snackbar }
})
export default class App extends DIContainer {

  public store = useStore();

  created() {
    const token = this.store.getters.accessToken;
    if (token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    this.createAxiosResponseInterceptor();
  }

  createAxiosResponseInterceptor() {

    const interceptor = axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        const status = error.response ? error.response.status : null;

        if (status !== 401) {
          return Promise.reject(error);
        }

        axios.interceptors.response.eject(interceptor);

        return this.store
          .dispatch("refreshToken")
          .then((response: AuthenticationResponse) => {
            if (response.success) {
              error.response.config.headers["Authorization"] =
                "Bearer " + this.store.getters.accessToken;
              return axios(error.response.config);
            } else {
              this.store.dispatch("logout");

              this.$router.push("/login")

              return Promise.reject(error);
            }
          })
          .catch(error => {
            this.store.dispatch("logout");

            this.$router.push("/login")

            return Promise.reject(error);
          })
          .finally(this.createAxiosResponseInterceptor);
      }
    );
  }
}
</script>