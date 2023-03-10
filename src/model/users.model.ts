import { BaseModel, DataRequest } from './base.model';

export class UsersResponseModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    enabled: boolean;
    id: number;
    industry: string;
    userName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    locked: boolean;
    password: string;
    phone: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
    updatedBy: string;
    updatedTime: string;
    companyName: string;
    type: string;
    siteId: number;
    professionalRole: string;
}

export class UsersRequestModel extends DataRequest {
    siteId: number;
}

export class CreateUserModel extends BaseModel {
    id: string;
    userName: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
}
export class CreateUserRequestModel {
    public companyName: string;
    public email: string;
    public firstName: string;
    public industry: string;
    public lastName: string;
    public password: string;
    public confirmPassword?: string;
    public phone: string;
    public professionalRole: string;
    public role: string;
    public type: string;
    public siteId: number;
}
export class DeleteUserModel {
}
export class DeleteUserRequestModel {
    id: number;
}
export class CreditsRequestModel {
    email: string;
}
export class AssignUserRequestModel {
    email: string;
    siteId: number;
}