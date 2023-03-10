import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import { VueClipboard } from '@soerenmartius/vue3-clipboard';
import moment from "moment";

import{ format } from 'timeago.js';

const app = createApp(App);
app.use(store);
app.use(VueClipboard);
app.use(router);
app.mount('#app');

app.directive('focus', {
    mounted: function (el: any) {
      const formField = el.parentNode.parentNode;
      if(el.value != '') formField.classList.add("form-field--is-active");
      el.addEventListener('focus', () => {
        formField.classList.add("form-field--is-active");
        formField.classList.add("form-field__outline--active");
      });
      el.addEventListener('focusout', () => {
        formField.classList.remove("form-field__outline--active");
        if(el.value == '')  formField.classList.remove("form-field--is-active");
        else formField.classList.add("form-field--is-active");
      })
    }
})
app.directive('outline', {
  mounted: function (el: any) {
    const formField = el.parentNode.parentNode;
    if(el.value != '') formField.classList.add("form-field__outline--active");
    el.addEventListener('focus', () => {
      formField.classList.add("form-field__outline--active");
    });
    el.addEventListener('focusout', () => {
      if(el.value == '')  formField.classList.remove("form-field__outline--active");
      else formField.classList.add("form-field__outline--active");
    })
  }
})
app.directive('sameAs', {
  mounted: function (el: any, binding: any) {
    const formField = el.parentNode.parentNode;
    
    el.addEventListener('keyup', () => { 
      if(binding.value.password != binding.value.confirmPassword) formField.classList.add("form-field--is-invalid");
    });
  }
});
app.directive('changePassword', {
  mounted: function (el: any, binding: any) {
    const formField = el.parentNode.parentNode;
    
    el.addEventListener('keyup', () => { 
      if(binding.value.newPassword != binding.value.confirmPassword) formField.classList.add("form-field--is-invalid");
    });
  }
});
app.directive("click-outside", { 
  beforeMount: function (el: any, binding: any) {
      el.clickOutsideEvent = function (event: any) {
        if (!(el == event.target || el.contains(event.target))) {
          binding.value(event, el);
        }
      };
      document.body.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: function (el: any) {
      document.body.removeEventListener("click", el.clickOutsideEvent);
    },
});
app.config.globalProperties.$filters = {
    currencyDisplay(value: any) {
        if(!value) value = 0;
        return '$'+value;
    },
    dateDisplay(value: any, format: string) {
      if (!value) return "";

      if (!format) format = "MM/DD/YYYY";

      return moment(value).format(format);
    },
    timeDisplay(value: any) {
      if(!value) value = new Date();

      return format(value, 'en_US');
  }
}