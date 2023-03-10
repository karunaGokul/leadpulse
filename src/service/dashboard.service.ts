import { IBaseService, BaseService } from './base.service';
import { DashboardRequestModel, DashboardModel } from '@/model';

export interface IDashboardService extends IBaseService<DashboardRequestModel, DashboardModel> {
    getDashboardInfo(request: DashboardRequestModel): Promise<DashboardModel>;

}
export class DashboardService extends BaseService<DashboardRequestModel, DashboardModel> implements IDashboardService {

    constructor() {
        super('dashboard');
    }

    getDashboardInfo(request: DashboardRequestModel): Promise<DashboardModel> {
        return this.httpGet('admin/getDashBoardInfo', request).then((response) => {
            return response.data;
        })
    }

}