import { IBaseService, BaseService } from './base.service';
import { DataFormRequestModel, DataFormResponseModel } from "@/model";

export interface IDataRequestFormService extends IBaseService<DataFormRequestModel, DataFormResponseModel> {
    sendDataRequest(request: DataFormRequestModel): Promise<DataFormResponseModel>;
}

export class DataRequestFormService extends BaseService<DataFormRequestModel, DataFormResponseModel> implements IDataRequestFormService {

    constructor() {
        super('admin');
    }

    public sendDataRequest(request: DataFormRequestModel): Promise<DataFormResponseModel> {
        return this.post(request, 'dataRequest').then((response) => {
            return response;
        })
    }
}