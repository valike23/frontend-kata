import  { HttpStatusCode } from "axios";
import axios from "axios";

export interface IResponseType<M> {
    data: M | null;
    statusCode: HttpStatusCode;
    message: string;
}

const BASE_URL = 'http://localhost:3000/';
export class HttpHelper {
    static async Get< M>(url: string): Promise<IResponseType<M>> {
        try {
           
             const {data} = await axios.get(BASE_URL + url);
             console.log("the final data", data.data)
             return {
                 data: data.data,
                 statusCode: data.status_code,
                 message: data.message
             };
         } catch (error) {
             if (axios.isAxiosError(error)) {
               if(error.response?.status === HttpStatusCode.Unauthorized) {
                 location.href = '/';
               }
                 return {
                     data: null,
                     statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                     message: error.message
                 };
             } else {
             
                 return {
                     data: null,
                     statusCode: HttpStatusCode.InternalServerError,
                     message: 'An unexpected error occurred'
                 };
             }
         }
    }

    static  async POST<T, M>(url: string, body: T): Promise<IResponseType<M>> {
        try {
           
            const {data} = await axios.post(BASE_URL + url, body);
            return {
                data: data.data,
                statusCode: data.status_code,
                message: data.message
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error);
                return {
                    data: error.response?.data,
                    statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                    message: error.message
                };
            } else {
            
                return {
                    data: null,
                    statusCode: HttpStatusCode.InternalServerError,
                    message: 'An unexpected error occurred'
                };
            }
        }
    }

    static  async PUT<T, M>(url: string, body: T): Promise<IResponseType<M>> {
        try {
           
            const {data} = await axios.put(BASE_URL + url, body);
            return {
                data: data.data,
                statusCode: data.status_code,
                message: data.message
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {

                return {
                    data: null,
                    statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                    message: error.message
                };
            } else {
            
                return {
                    data: null,
                    statusCode: HttpStatusCode.InternalServerError,
                    message: 'An unexpected error occurred'
                };
            }
        }
    }

    static async POST_FILE< M>(url: string, body: FormData): Promise<IResponseType<M>> {
        try {
            axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
            const {data} = await axios.post(BASE_URL + url, body);
            return {
                data: data.data,
                statusCode: data.status_code,
                message: data.message
            };
        }
        catch (error) {
            if (axios.isAxiosError(error)) {

                return {
                    data: null,
                    statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                    message: error.message
                };
            } else {
            
                return {
                    data: null,
                    statusCode: HttpStatusCode.InternalServerError,
                    message: 'An unexpected error occurred'
                };
            }
        }
    }
    static async DELETE<M>(url: string, id: number):Promise<IResponseType<M>>{
        try {
           
            const {data} = await axios.delete(BASE_URL + url + `?id=${id}`);
            return {
                data: data.data,
                statusCode: data.status_code,
                message: data.message
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {

                return {
                    data: null,
                    statusCode: error.response?.status || HttpStatusCode.InternalServerError,
                    message: error.message
                };
            } else {
            
                return {
                    data: null,
                    statusCode: HttpStatusCode.InternalServerError,
                    message: 'An unexpected error occurred'
                };
            }
        }

    }
}