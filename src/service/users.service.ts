import { IBaseService, BaseService } from './base.service';
import { 
    DataResponse, 
    UsersRequestModel, 
    UsersResponseModel, 
    CreateUserRequestModel, 
    CreateUserModel,
    CreditsRequestModel,
    AssignUserRequestModel
} from '@/model';

export interface IUserService extends IBaseService<UsersRequestModel, UsersResponseModel> { 
    getUser(request: UsersRequestModel): Promise<Array<UsersResponseModel>>;
    addUser(request: CreateUserRequestModel): Promise<CreateUserModel>;
    updateUser(request: CreateUserRequestModel): Promise<CreateUserModel>;
    deleteUser(id: number): Promise<any>;
    getCredits(): Promise<any>;
    getCurrentUser(): Promise<CreateUserRequestModel>;
    assignUser(request: AssignUserRequestModel): Promise<any>;
}

export class UserService extends BaseService<UsersRequestModel, UsersResponseModel> implements IUserService { 

    constructor() {
        super('user');
    }

    getUser(request: UsersRequestModel): Promise<Array<UsersResponseModel>> {
        return this.httpGet('user', request).then(response => {
            return response.data;
        })
    }

    addUser(request: CreateUserRequestModel): Promise<CreateUserModel> {
        return this.httpPost('public/user', request).then(response => {
            return response.data;
        });
    }

    updateUser(request: CreateUserRequestModel): Promise<CreateUserModel> {
        return this.httpPost('public/updateUser', request).then(response => {
            return response.data;
        })
    }

    deleteUser(id: number): Promise<any> {
        return this.httpPut(`${'public/disableUser/'+id}`, null).then(response => {
            return response.data;
        })
    }

    getCredits(): Promise<any> {
        return this.httpGet('admin/user/getCredits', null).then(response => {
            return response.data;
        })       
    }

    getCurrentUser(): Promise<CreateUserRequestModel> {
        return this.httpGet('admin/user/getCurrentUser', null).then(response => {
            return response.data;
        })
    }

    assignUser(request: AssignUserRequestModel): Promise<any> {
        return this.httpPost('admin/siteUser', request).then(response => {
            return response.data;
        })
    }
    
}