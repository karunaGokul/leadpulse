import { BaseModel, DataRequest } from './base.model';

export class LeadsRequestModel extends DataRequest {
    siteId: number;
}
export class LeadsModel extends BaseModel {
    additionalDetails: Array<AdditionalDetailsModel>;
    address1: string;
    address2: string;
    country: string;
    createdBy: string;
    createdTime: string;
    email: string;
    firstName: string;
    id: number;
    ipAddress: string;
    lastName: string;
    phone: string;
    state: string;
    status: string;
    updatedBy: string;
    updatedTime: string;
    zipcode: string
}
export class SiteInfoModel {
    createdBy: string;
    createdTime: string;
    id: number;
    siteName: string;
    sitePixel: string;
    siteUrl: string;
    status: string;
    updatedBy: string;
    updatedTime: string
}
export class PurchasedLeadsModel extends LeadsModel {
    amount: number;
    site: SiteInfoModel = new SiteInfoModel();;
    purchasedLead: string;
}

export class FieldsModel {
    displayName: string;
    leadFieldName: string;
    credit: number;
    value: boolean;
}

export class FieldsResponseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    displayName: string;
    leadFieldName: string;
    credit: number;
    updatedBy: string;
    updatedTime: string;
}
export class PurchaseLeadsRequestModel {
    leads: Array<number>;
    purchaseFields: Array<FieldsModel>;
    siteId: number;
    purchasedLeads: Array<number>;
}
export class PurchaseLeadsModel {
    amount: number;
}
export class AdditionalDetailsModel {
    fieldName: string;
    fieldValue: string;
}