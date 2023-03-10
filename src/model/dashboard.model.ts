import { BaseModel, DataRequest } from './base.model';

export class DashboardRequestModel extends DataRequest {
    siteId: number;
}
export class DashboardModel {
    leadsAvaialable: number;
    purchasedLeads: number;
    leadsByDate: any;
    topLocationsByLeads: any;
    totalAmountByDate: any;
    totalSpent: number;
    sites: number;
}