import { BaseModel, DataRequest } from './base.model';

export class ConsumerDataRequestModel extends DataRequest {
    city: string;
    state: string;
    zip: string;
    siteId: number;
}
export class ConsumerDataResponseModel extends BaseModel {
    age: number;
    childrenPresent: string;
    city: string;
    createdBy: string;
    createdTime: string;
    emailAddress: string;
    ethnicity: string;
    firstName: string;
    gender: string;
    home: string;
    id: number;
    income: number;
    languageSpoken: string;
    lastname: string;
    maritalStatus: string;
    owner: string;
    physicalAddress: string;
    religion: string;
    siteId: number;
    state: string;
    updatedBy: string;
    updatedTime: string;
    zip: string;
}