import { BaseModel, DataRequest } from './base.model';
import { UsersResponseModel } from './users.model';

export class CreditHistoryModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    credits: number;
    id: number;
    purchasedDate: string;
    updatedBy: string;
    updatedTime: string;
    user: any;

}
export class CreditHistoryRequestModel extends DataRequest {
}
export class CreateCreditHistoryModel {
}
export class CreateCreditHistoryRequestModel {

}