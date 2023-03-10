import { BaseModel, DataRequest } from './base.model';

export class SitesModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    siteName: string;
    sitePixel: string;
    siteUrl: string;
    status: string;
    updatedBy: string;
    updatedTime: string;
}
export class SitesRequestModel extends DataRequest {   
}
export class CreateSiteModel {
}
export class CreateSiteRequestModel {
    siteName: string;
    siteUrl: string;
    url: string = "https://";
}
export class PixelSiteModel {
}
export class PixelSiteRequestModel {  
    siteId: number;
}