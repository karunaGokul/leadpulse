import { BaseModel, DataRequest } from './base.model';

export class DataFormResponseModel extends BaseModel {

}
export class DataFormRequestModel extends DataRequest {
    industry: string;
    state: string;
    zipCode: string;
}