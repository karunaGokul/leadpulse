import { Vue } from 'vue-class-component';
import { Provide } from 'vue-property-decorator'
import { IAuthenticationService, AuthenticationService } from '@/service';

import { ISitesService, SitesService } from '@/service';
import { IDashboardService, DashboardService } from '@/service';
import { ILeadsService, LeadsService } from '@/service';
import { IUserService, UserService } from '@/service';
import { ICreditHistoryService, CreditHistoryService } from '@/service';
import { INotificationsService, NotificationsService } from '@/service';
import { IConsumerDataService, ConsumerDataService } from '@/service';
import { ISupportService, SupportService } from '@/service';
import { IDataRequestFormService, DataRequestFormService } from '@/service';

export class DIContainer extends Vue {
    @Provide('authService') authService: IAuthenticationService = new AuthenticationService();
    @Provide('sitesService') sitesService: ISitesService = new SitesService();
    @Provide('dashboardService') dashboardService: IDashboardService = new DashboardService();
    @Provide('leadsService') leadsService: ILeadsService = new LeadsService();
    @Provide('userService') userService: IUserService = new UserService();
    @Provide('CreditHistoryService') CreditHistoryService: ICreditHistoryService = new CreditHistoryService();
    @Provide('notificationsService') NotificationsService: INotificationsService = new NotificationsService();
    @Provide('consumerService') ConsumerDataService: IConsumerDataService = new ConsumerDataService();
    @Provide('supportService') SupportService: ISupportService = new SupportService();
    @Provide('dataRequestFormService') DataRequestFormService: IDataRequestFormService = new DataRequestFormService();
}