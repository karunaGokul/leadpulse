import { BaseModel, DataRequest } from './base.model';

export class CreditHistoryUserModel {
    companyName: string;
    createdBy: string;
    createdTime: string;
    credits: number;
    email: string;
    enabled: boolean;;
    firstName: string;
    id: number;
    industry: string;
    lastName: string;
    locked: boolean;
    password: string;
    phone: string;
    role: string;
    updatedBy: string;
    updatedTime: string;
}

export class CreditHistoryModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    credits: number;
    amount: number;
    id: number;
    purchasedDate: string;
    updatedBy: string;
    updatedTime: string;
    user: CreditHistoryUserModel = new CreditHistoryUserModel();

}
export class CreditHistoryRequestModel extends DataRequest {
}
export class PurchaseCreditModel {
}
export class PurchaseCreditRequestModel {
    credits: number;
    amount: number;
}
export class AllCreditValueRequestModel {
}
export class AllCreditValueModel {
    creditPoint: number;
    id: number;
    price: number;
}