import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { UserService } from '@/service';
import { CreditsRequestModel } from '@/model';

const state: any = {
    siteId: 0,
    message: "",
    snackBarClass: "",
    type: "",
    enableHelpDesk: false,
    credits: 0,
    amount:  0,
    sideBar: false
}
const getters: GetterTree<any, any> = {
    getSideBarStatus: state => {
        return state.sideBar;
    },
    getSiteId: state => {
        return state.siteId;
    },
    getHelpDeskStatus: state => {
        return state.enableHelpDesk
    },
    getCredits: state => {
        return state.credits;
    },
    getPurchasedCredits: state =>{
        return localStorage.getItem("credits");
    },
    getPurchasedAmount: state =>{
        return localStorage.getItem("amount");
    }
}
const mutations: MutationTree<any> = {
    onShowSnackbar(state, data) {
        state.message = data.message;
        state.snackBarClass = data.snackBarClass;
    },
    onShowAlert(state, data) {
        state.message = data.message;
        state.snackBarClass = data.snackBarClass;
        state.type = data.type;
    },
    onChangeSiteId(state, siteId) {
        state.siteId = siteId;
    },
    onTriggerHelpDesk(state) {
        state.enableHelpDesk = !state.enableHelpDesk;
    },
    onUpdateCredits(state, credits) {
        state.credits = credits;
    },
    onAddPurchaseCredits(state, payload) {
        localStorage.setItem("credits", payload.credits);
        localStorage.setItem("amount", payload.amount);
    },
    onUpdateSideBar(state) {
        state.sideBar = !state.sideBar;
    }
}
const actions: ActionTree<any, any> = {
    showSnack(context, payload) {
        context.commit("onShowSnackbar", payload);
    },
    showAlert(context, payload) {
        context.commit("onShowAlert", payload);
    },
    updateSiteId(context, siteId) {
        context.commit('onChangeSiteId', siteId);
    },
    triggerHelpDesk(context) {
        context.commit('onTriggerHelpDesk')
    },
    updateCredits(context) {
        const service = new UserService();
        service.getCredits().then((response) => {
            context.commit('onUpdateCredits', response);
        });
    },
    addPurchaseCredits(context, payload) {
        context.commit('onAddPurchaseCredits', payload);
    },
    updateSideBar(context) {
        context.commit('onUpdateSideBar');
    }
}

export const ContextModule = {
    state,
    getters,
    mutations,
    actions
}