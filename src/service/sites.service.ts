import { IBaseService, BaseService } from './base.service';
import { 
    DataResponse, 
    SitesModel, 
    SitesRequestModel, 
    CreateSiteRequestModel, 
    CreateSiteModel,
    PixelSiteRequestModel,
    PixelSiteModel
} from '@/model';

export interface ISitesService extends IBaseService<SitesRequestModel, SitesModel> {
    getSites(request: SitesRequestModel) : Promise<DataResponse<SitesModel>>
    createSite(request: CreateSiteRequestModel): Promise<CreateSiteModel>;
    deleteSite(siteId: number): Promise<any>;
    generatePixel(request: PixelSiteRequestModel): Promise<PixelSiteModel>;
}
export class SitesService extends BaseService<SitesRequestModel, SitesModel> implements ISitesService {

    constructor() {
        super('admin')
    }

    public getSites(request: SitesRequestModel) : Promise<DataResponse<SitesModel>> {
        return this.searchPost(request, 'getAllSites').then(response => {
            return response;
        })
    }

    public createSite(request: CreateSiteRequestModel): Promise<CreateSiteModel> {
        return this.httpPost('admin/site', request).then(response => {
            return response.data;
        })
    }

    public deleteSite(siteId: number): Promise<any> {
        return this.httpPut('admin/site/'+siteId, null).then(response => {
            return response.data;
        })
    }

    public generatePixel(request: PixelSiteRequestModel): Promise<PixelSiteModel> {
        return this.httpGet('admin/generatePixel', request).then(response => {
            return response.data;
        })
    }

}