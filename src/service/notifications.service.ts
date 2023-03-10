import { IBaseService, BaseService } from './base.service';
import { NotificationsModel } from '@/model';

export interface INotificationsService extends IBaseService<any, NotificationsModel> {
    getNotifications(): Promise<Array<NotificationsModel>>;
    getNotificationCount(): Promise<number>;
}
export class NotificationsService extends BaseService<any, NotificationsModel> implements INotificationsService {

    constructor() {
        super('notifications');
    }

    public getNotifications(): Promise<Array<NotificationsModel>> {
        return this.httpGet('admin/getNotifications', null).then((response) => {
            return response.data;
        })
    }

    public getNotificationCount(): Promise<number> {
        return this.httpGet('admin/getNotificationCount', null).then((response) => {
            return response.data;
        })
    }

}