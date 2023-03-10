import axios from 'axios';
import { AxiosResponse, AxiosError } from 'axios'
import { ServiceHelper } from './base.service';
import { 
    AuthenticationRequest, 
    AuthenticationResponse, 
    CreateUserRequestModel, 
    CreateUserModel, 
    ForgotPasswordRequest, 
    ForgotPasswordResponse, 
    UpdatePasswordRequest, 
    UpdatePasswordResponse ,
    ChangePasswordRequest
} from '@/model';
import { Settings } from '@/config';

export interface IAuthenticationService  {
    login(request: AuthenticationRequest): Promise<AuthenticationResponse>;
    createNewUser(request: CreateUserRequestModel): Promise<CreateUserModel>;
    forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse>;
    resetPassword(uuid: any, request: UpdatePasswordRequest): Promise<UpdatePasswordResponse>;
    changePassword(request: ChangePasswordRequest): Promise<any>;

    _refreshToken(token: string): Promise<AuthenticationResponse>;
}

export class AuthenticationService extends ServiceHelper implements IAuthenticationService {

    static refreshTokenRequest: Promise<AuthenticationResponse> = null as any;

    refreshToken(token: string) {
        if (!AuthenticationService.refreshTokenRequest) {
            AuthenticationService.refreshTokenRequest = this._refreshToken(token);
            AuthenticationService.refreshTokenRequest.then(this.resetAuthTokenRequest, this.resetAuthTokenRequest);
        }

        return AuthenticationService.refreshTokenRequest;
    }

    resetAuthTokenRequest() {
        AuthenticationService.refreshTokenRequest = null as any;
    }

    _refreshToken(token: string): Promise<AuthenticationResponse> {
        const request = new AuthenticationRequest();
        request.refresh_token = token;
        request.grant_type = "refresh_token";

        if (token) {
            return this.login(request);
        }
        else {
            return new Promise((resolve, reject) => {
                const response = new AuthenticationResponse();
                response.success = false;

                resolve(response);
            });
        }
    }

    public login(request: AuthenticationRequest): Promise<AuthenticationResponse> {
        return axios.request(
            {
                url: `${this.baseUrl}/oauth/token`,
                method: "post",
                params: request,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                auth: {
                    username: Settings.AuthUserName,
                    password: Settings.AuthPassword
                }
            }).then(
                (result: AxiosResponse) => {
                    const response = new AuthenticationResponse();
                    if (result.data.error) {
                        response.success = false;
                        response.error = result.data.error_description;
                    }
                    else {
                        response.success = true;
                        response.accessToken = result.data.access_token;
                        response.refreshToken = result.data.refresh_token;

                        axios.defaults.headers.common['Authorization'] = `Bearer ${response.accessToken}`;
                    }

                    return response;
                },
                (error: AxiosError) => {
                    const response = new AuthenticationResponse();
                    response.success = false;
                    if (error && error.response && error.response.data)
                        response.error = error.response.data.error_description;

                    return response;
                }
            );
    }

    public createNewUser(request: CreateUserRequestModel): Promise<CreateUserModel> {
        return this.httpPost('public/user', request).then(response => {
            return response.data;
        })
    }

    public forgotPassword(request: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        return this.httpPost('public/user/forgotPassword', request).then(response => {
            return response.data;
        })
    }

    public resetPassword(uuid: any, request: UpdatePasswordRequest): Promise<UpdatePasswordResponse> {
        return this.httpGet('public/user/resetPassword/'+uuid, request).then(response => {
            return response.data;
        })
    }

    public changePassword(request: ChangePasswordRequest): Promise<any> {
        return this.httpPost('public/user/changePassword', request).then(response => {
            return response.data;
        })
    }
    
}