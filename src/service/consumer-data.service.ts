import { IBaseService, BaseService } from './base.service';
import { DataResponse, ConsumerDataRequestModel, ConsumerDataResponseModel} from "@/model";

export interface IConsumerDataService extends IBaseService<ConsumerDataRequestModel, ConsumerDataResponseModel> {
    getConsumerData(request: ConsumerDataRequestModel): Promise<DataResponse<ConsumerDataResponseModel>>;
}

export class ConsumerDataService extends BaseService<ConsumerDataRequestModel, ConsumerDataResponseModel> implements IConsumerDataService {

    constructor() {
        super('admin');
    }

    public getConsumerData(request: ConsumerDataRequestModel): Promise<DataResponse<ConsumerDataResponseModel>> {
        return this.searchPost(request, 'getConsumerData').then((response) => {
            return response;
        })
    }
}