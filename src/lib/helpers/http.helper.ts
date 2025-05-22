import { HttpStatusCode } from "axios";
import axios, { type AxiosInstance } from "axios";

export interface IResponseType<M> {
  data: M | null;
  statusCode: HttpStatusCode;
  message: string;
}

const BASE_URL = "http://localhost:3000/";

// A JSON client that always sends application/json
const jsonClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// A “bare” client for file uploads—Axios will auto-set multipart boundaries for FormData
const formClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export class HttpHelper {
  static async Get<M>(url: string): Promise<IResponseType<M>> {
    try {
      const { data } = await jsonClient.get(url);
      return {
        data: data.data,
        statusCode: data.status_code,
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          location.href = "/";
        }
        return {
          data: null,
          statusCode: error.response?.status ?? HttpStatusCode.InternalServerError,
          message: error.message,
        };
      }
      return {
        data: null,
        statusCode: HttpStatusCode.InternalServerError,
        message: "An unexpected error occurred",
      };
    }
  }

  static async POST<T, M>(url: string, body: T): Promise<IResponseType<M>> {
    try {
      // Using the JSON-configured client
      const resp = await jsonClient.post(url, body);
      return {
        data: resp.data.data,
        statusCode: resp.status,
        message: resp.statusText,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: error.response?.data ?? null,
          statusCode: error.response?.status ?? HttpStatusCode.InternalServerError,
          message: error.message,
        };
      }
      return {
        data: null,
        statusCode: HttpStatusCode.InternalServerError,
        message: "An unexpected error occurred",
      };
    }
  }

  static async PUT<T, M>(url: string, body: T): Promise<IResponseType<M>> {
    try {
      const { data } = await jsonClient.put(url, body);
      return {
        data: data.data,
        statusCode: data.status_code,
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          statusCode: error.response?.status ?? HttpStatusCode.InternalServerError,
          message: error.message,
        };
      }
      return {
        data: null,
        statusCode: HttpStatusCode.InternalServerError,
        message: "An unexpected error occurred",
      };
    }
  }

  static async POST_FILE<M>(url: string, body: FormData): Promise<IResponseType<M>> {
    try {
      // Use the formClient and let Axios detect the correct multipart boundary
      const { data } = await formClient.post(url, body, {
        headers: {
          // You can omit this entirely in a browser — axios will set the correct
          // multipart/form-data; boundary=... header for you.
          "Content-Type": "multipart/form-data",
        },
      });
      return {
        data: data.data,
        statusCode: data.status_code,
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          statusCode: error.response?.status ?? HttpStatusCode.InternalServerError,
          message: error.message,
        };
      }
      return {
        data: null,
        statusCode: HttpStatusCode.InternalServerError,
        message: "An unexpected error occurred",
      };
    }
  }

  static async DELETE<M>(url: string, id: number): Promise<IResponseType<M>> {
    try {
      const { data } = await jsonClient.delete(`${url}?id=${id}`);
      return {
        data: data.data,
        statusCode: data.status_code,
        message: data.message,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          data: null,
          statusCode: error.response?.status ?? HttpStatusCode.InternalServerError,
          message: error.message,
        };
      }
      return {
        data: null,
        statusCode: HttpStatusCode.InternalServerError,
        message: "An unexpected error occurred",
      };
    }
  }
}
