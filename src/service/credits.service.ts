import { IBaseService, BaseService } from './base.service';
import { DataResponse, 
        CreditHistoryModel, 
        CreditHistoryRequestModel,
        PurchaseCreditRequestModel,
        AllCreditValueModel
} from '@/model';
export interface ICreditHistoryService extends IBaseService<CreditHistoryRequestModel, CreditHistoryModel> {
    getAllCreditHistory(request: CreditHistoryRequestModel): Promise<Array<CreditHistoryModel>>
    getAllCreditValues(): Promise<Array<AllCreditValueModel>>;
    purchaseCredit(request: PurchaseCreditRequestModel): Promise<any>;

}
export class CreditHistoryService extends BaseService<CreditHistoryRequestModel, CreditHistoryModel> implements ICreditHistoryService {

    constructor() {
        super('admin')
    }

    public getAllCreditHistory(request: CreditHistoryRequestModel): Promise<Array<CreditHistoryModel>> {
        return this.httpGet('admin/creditHistory/getAll', request).then(response => {
            return response.data;
        })
    }

    public getAllCreditValues(): Promise<Array<AllCreditValueModel>> {
        return this.httpGet('admin/getAllCreditValues', null).then(response => {
            return response.data;
        })
    }

    public purchaseCredit(request: PurchaseCreditRequestModel): Promise<any> {
         return this.httpPost('admin/creditHistory/create', request).then(response => {
             return response.data;
         })
    }
}