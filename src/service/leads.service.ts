import { IBaseService, BaseService } from './base.service';
import {
    DataResponse,
    LeadsRequestModel,
    LeadsModel,
    PurchaseLeadsRequestModel,
    FieldsResponseModel
} from '@/model';

export interface ILeadsService extends IBaseService<LeadsRequestModel, LeadsModel> {
    getAvailableLeads(request: LeadsRequestModel): Promise<DataResponse<LeadsModel>>
    getPurchangedLeads(request: LeadsRequestModel): Promise<DataResponse<LeadsModel>>;
    getAllFields(): Promise<Array<FieldsResponseModel>>;
    getCredits(request: PurchaseLeadsRequestModel): Promise<any>;
    purchaseLeads(path: string, request: PurchaseLeadsRequestModel): Promise<any>;
    exportFile(format: string, siteId: string): void;
}

export class LeadsService extends BaseService<LeadsRequestModel, LeadsModel> implements ILeadsService {

    constructor() {
        super('admin/lead');
    }

    public getAvailableLeads(request: LeadsRequestModel): Promise<DataResponse<LeadsModel>> {
        return this.searchPost(request, 'availableLeads').then((response) => {
            return response;
        })
    }

    public getPurchangedLeads(request: LeadsRequestModel): Promise<DataResponse<LeadsModel>> {
        return this.searchPost(request, 'purchasedLead').then((response) => {
            return response;
        })
    }

    public getAllFields(): Promise<Array<FieldsResponseModel>> {
        return this.httpGet('admin/getAllFields', null).then((response) => {
            return response.data;
        })
    }

    public getCredits(request: PurchaseLeadsRequestModel): Promise<any> {
        return this.httpPost('admin/getCredits', request).then((response) => {
            return response.data;
        })
    }

    public purchaseLeads(path: string, request: PurchaseLeadsRequestModel): Promise<any> {
        return this.httpPost(`${'admin/'+path}`, request).then((response) => {
            return response.data;
        });
    }

    public exportFile(format: string, siteId: string): void {
        let request = {'siteId': siteId};
        this.httpGet('admin/lead/export', request, "blob").then((response) => {
            let fileUrl = window.URL.createObjectURL(new Blob([response.data]));
            let fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", format);
            fileLink.style.display = "none";
            document.body.appendChild(fileLink);

            fileLink.click();
            document.body.removeChild(fileLink);
        })
    }

}