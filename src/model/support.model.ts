import { BaseModel, DataRequest } from './base.model';

export class SupportModel extends BaseModel {

}
export class SupportRequestModel extends DataRequest {
    name: string;
    email: string;
    message: string;
}