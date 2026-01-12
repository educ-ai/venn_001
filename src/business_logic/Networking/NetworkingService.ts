export enum ResponseContentType {
  JSON = 'application/json',
  PlainText = 'text/plain',
}

export type RequestOptions = {
  signal?: AbortSignal;
  expectedResponseType?: ResponseContentType;
};

export interface NetworkingService {
  get<T = any>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T = any>(endpoint: string, body: any, options?: RequestOptions): Promise<T>;
}
