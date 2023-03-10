import { BaseModel } from './base.model';

export class NotificationsModel extends BaseModel {
    createdBy: string;
    createdTime: string;
    id: number;
    message: string;
    timeinMillis: string;
    type: string;
    updatedBy: string;
    updatedTime: string;
    userId: number;
    uuid: string
}