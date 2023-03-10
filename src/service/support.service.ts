import { IBaseService, BaseService } from './base.service';
import { SupportRequestModel, SupportModel } from '@/model';

export interface ISupportService extends IBaseService<SupportRequestModel, SupportModel> {
    sendFeedback(request: SupportRequestModel): Promise<SupportModel>;
}

export class SupportService extends BaseService<SupportRequestModel, SupportModel> implements ISupportService {

    constructor() {
        super('admin');
    }

    sendFeedback(request: SupportRequestModel): Promise<SupportModel> {
        return this.post(request, 'support').then((response) => {
            return response;
        })
    }
}