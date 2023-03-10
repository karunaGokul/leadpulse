import { GetterTree, MutationTree, ActionTree } from 'vuex';
import axios from "axios";

import { AuthenticationState, AuthStatus, AuthenticationRequest, AuthenticationResponse, CreateUserRequestModel, CreateUserModel, ForgotPasswordRequest, ForgotPasswordResponse } from '@/model';
import { AuthenticationService } from '@/service';

import JwtDecode from 'jwt-decode';

const state: AuthenticationState = {
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || ''
}

const getters: GetterTree<AuthenticationState, any> = {
    accessToken: state => {
        return state.accessToken;
    },
    refreshToken: state => {
        return state.refreshToken;
    },
    isLoggedIn: state => {
        return !!state.accessToken;
    },
    userInfo: state => {
        let userInfo: CreateUserModel = new CreateUserModel();

        if (state.accessToken) {
            const tokenParsed: any = JwtDecode(state.accessToken);

            userInfo = new CreateUserModel();
            userInfo.email = tokenParsed.email;
            userInfo.userName = tokenParsed.preferred_username;
            userInfo.fullName = tokenParsed.name;
            userInfo.firstName = tokenParsed.given_name;
            userInfo.lastName = tokenParsed.family_name;
            userInfo.emailVerified = tokenParsed.email_verified;
        }

        return userInfo;
    }
}

const mutations: MutationTree<AuthenticationState> = {
    onAuthenticate(state, data: AuthenticationResponse) {
        state.accessToken = data.accessToken;
        state.refreshToken = data.refreshToken;
    },

    onLogout(state) {
        state.accessToken = "";
        state.refreshToken = "";
        axios.defaults.headers.common["Authorization"] = "";
    }
}

const actions: ActionTree<AuthenticationState, any> = {
    refreshToken(context) {
        const service = new AuthenticationService();
        return service.refreshToken(context.state.refreshToken).then(response => {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            context.commit('onAuthenticate', response);

            return response;
        });
    },

    login(context, request: AuthenticationRequest) {
        const service = new AuthenticationService();
        return service.login(request).then(response => {
            context.commit('onAuthenticate', response);

            return response;
        });
    },

    logout(context) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        context.commit('onLogout');
    }
}

export const LoginModule = {
    state,
    getters,
    mutations,
    actions
}