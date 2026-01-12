/**
 * MIME types for HTTP request/response content negotiation.
 */
export enum ContentType {
  JSON = 'application/json',
  PlainText = 'text/plain',
}

export type RequestOptions = {
  /** Allows request cancellation via AbortController. */
  signal?: AbortSignal;
  /** Expected response format. Mismatches throw HttpError. Defaults to JSON. */
  expectedResponseType?: ContentType;
};

/**
 * HTTP client abstraction. Implementations handle request/response serialization,
 * error mapping, and content type negotiation.
 */
export interface NetworkingService {
  get<T = any>(endpoint: string, options?: RequestOptions): Promise<T>;
  post<T = any>(endpoint: string, body: any, options?: RequestOptions): Promise<T>;
}
