import axios from 'axios';
import { AxiosResponse, AxiosError, AxiosRequestConfig, ResponseType } from 'axios'
import { stringify } from 'qs';
import { plainToClass } from 'class-transformer';

import { Settings } from '@/config';

import { DataResponse, IBaseModel, IBaseRequest, PageInfo, ListItem, DataRequest } from '@/model';

export interface IBaseService<R extends IBaseRequest, T extends IBaseModel> {
    getItem(id: string): Promise<T>;
    getItems(request: R): Promise<DataResponse<T>>;
    getAll(): Promise<DataResponse<T>>;

    post(data: T, endPoint?: string): Promise<T>;
    put(data: T, endPoint?: string): Promise<T>;
    delete(id: string): Promise<boolean>;
    export(request: R, fileName: string, endPoint?: string): void;
}
export interface EntityType<T> {
    new(): T;
}

export abstract class ServiceHelper { 
    protected baseUrl: string = Settings.ApiUrl;

    protected apiUrl: string = `${this.baseUrl}/${Settings.ApiPath}`;

    protected deserialize<T>(classType: EntityType<T>, source: any): T {
        let raw = plainToClass<T, any>(classType, source);

        let item: T = raw;

        return item;
    }

    httpGet(route: string, request: any, responseType?: ResponseType): Promise<AxiosResponse<any>> {
        const params: any = {};
        if (request) {
            for (const key in request) {
                if (key.charAt(0) != "_") {
                    if (request[key] instanceof Date) {
                        const dateString: any = request[key];

                        const date: Date = new Date(dateString);

                        if (date)
                            params[key] = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
                    }
                    else {
                        const value: any = request[key];

                        if (value || value === false)
                            params[key] = request[key];
                    }
                }
            }
        }

        const path = `${this.apiUrl}/${route}`;
        const config: AxiosRequestConfig = {
            params: params,
            'paramsSerializer': params => {
                return stringify(params, { arrayFormat: 'repeat' })
            }
        };

        if (responseType) config.responseType = responseType;

        return axios.get<any>(path, config);
    }


    protected httpPost(route: string, data: any): Promise<AxiosResponse<any>> {
        const path = `${this.apiUrl}/${route}`;

        return axios.post(path, data);
    }

    protected httpPut(route: string, data: any): Promise<AxiosResponse<any>> {
        const path = `${this.apiUrl}/${route}`;

        return axios.put(path, data);
    }

    protected httpDelete(route: string): Promise<AxiosResponse<any>> {
        const path = `${this.apiUrl}/${route}`;

        return axios.delete(path);
    }
}

export class BaseService<R extends IBaseRequest, T extends IBaseModel> extends ServiceHelper {

    protected eType: EntityType<T>;
    
    constructor(protected path: string) {
        super();
    }

    protected format(item: T) { }

    protected construct(data: any) {
        if (this.eType) {
            let item: T = this.deserialize<T>(this.eType, data);

            this.format(item);
            return item;
        }
        else
            return data;
    }

    getItem(id: string): Promise<T> {
        let path = this.path;
        path = `${path}/${id}`;

        return this.httpGet(path, null).then(
            (response: AxiosResponse) => {
                return response.data;
            },
            (reason: AxiosError) => {
                return null;
            }
        );
    }

    getAll(): Promise<DataResponse<T>> {
        const request: any = new DataRequest();
        request._skipPaging = true;

        return this.getItems(request);
    }

    getItems(request: R, additionalPath?:string): Promise<DataResponse<T>> {
        if (request._skipPaging) {
            //request.page = undefined;
            //request.pageSize = undefined;
        }

        let path = '';
        if(additionalPath) path = `${this.path}/${additionalPath}`
        else path = this.path;

        request._loading = true;
        return this.httpGet(`${path}`, request).then(
            (response: AxiosResponse) => {
                request._loading = false;

                return response.data;
            },
            (reason: AxiosError) => {
                request._loading = false;

                throw reason;
            }
        );
    }

    post(data: T, endPoint?: string): Promise<T> {
        let path = this.path;
        if (endPoint) path = `${path}/${endPoint}`;

        return this.httpPost(path, data).then(response => {
            return response.data;
        });
    }

    protected searchPost(request: R, endPoint?: string): Promise<DataResponse<T>> {
        /*if (request._skipPaging) {
            request.page = undefined;
            request.pageSize = undefined;
        }*/

        request._loading = true;

        let path = this.path;
        if (endPoint) path = `${path}/${endPoint}`;

        return this.httpPost(path, request).then(
            (response: AxiosResponse) => {
                request._loading = false;

                let result = new DataResponse<T>();

                if (response.data) {
                    let items: T[] = [];

                    if (response.data.data) {
                        response.data.data.forEach((item: any) => {
                            items.push(this.construct(item));
                        });
                    }

                    result = response.data;
                    result.data = items;
                }

                return result;
            },
            (reason: AxiosError) => {
                request._loading = false;

                throw reason;
            }
        );
    }

    put(data: T, endPoint?: string): Promise<T> {
        let path = this.path;
        if (endPoint) path = `${path}/${endPoint}`;

        return this.httpPut(path, data).then(response => {
            return response.data;
        });
    }

    delete(id: string): Promise<boolean> {
        const path = `${this.path}/${id}`;

        return this.httpDelete(path).then((response: AxiosResponse) => {
            return true;
        });
    }

    upload(formData: FormData, route: string) {
        const path = `${this.path}/${route}`;

        const config: AxiosRequestConfig = { headers: { 'Content-Type': 'multipart/form-data' } };

        return axios.post(`${this.apiUrl}/${path}`, formData, config).then(response => {
            return response.data;
        });
    }

    export(request: R, fileName: string, endPoint?: string): void {
        let path = `${this.path}/export`;
        if (endPoint) path = endPoint;

        this.httpGet(path, request, "blob").then(response => {
            const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement("a");
            fileLink.href = fileUrl;
            fileLink.setAttribute("download", fileName);
            fileLink.style.display = "none";
            document.body.appendChild(fileLink);

            fileLink.click();
            document.body.removeChild(fileLink);
        });
    }
}