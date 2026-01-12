import {
  NetworkingService,
  RequestOptions,
  ResponseContentType,
} from 'business_logic/Networking/NetworkingService';
import { log } from 'utils/logger';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

enum RequestContentType {
  JSON = 'application/json',
}

class NetworkingServiceImpl implements NetworkingService {
  constructor(private apiUrlPath: string) {}

  private async sendRequest(
    endpoint: string,
    fetchOptions: RequestInit,
    requestContentType: RequestContentType | null = null,
    expectedResponseType: ResponseContentType = ResponseContentType.JSON,
  ) {
    if (requestContentType) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Content-Type': requestContentType,
      };
    }

    const url = `${this.apiUrlPath}/${endpoint}`;
    log('[NetworkingServiceImpl] Request:', fetchOptions.method, url);

    try {
      const response = await fetch(url, fetchOptions);

      log('[NetworkingServiceImpl] Response status:', response.status, response.ok ? 'OK' : 'FAIL');

      const responseContentType = response.headers.get('content-type') || '';
      log('[NetworkingServiceImpl] Content-Type:', responseContentType);

      const isJsonResponse = responseContentType.includes('application/json');
      const isPlainTextResponse = responseContentType.includes('text/plain');

      if (isJsonResponse) {
        const jsonObject = await response.json();
        log('[NetworkingServiceImpl] JSON response:', JSON.stringify(jsonObject));

        if (response.ok) {
          return jsonObject;
        }

        log('[NetworkingServiceImpl] Throwing HttpError:', response.status, jsonObject['message']);
        throw new HttpError(response.status, jsonObject['message']);
      } else if (isPlainTextResponse) {
        const text = await response.text();
        log('[NetworkingServiceImpl] Plain text response:', text);

        if (response.ok && expectedResponseType === ResponseContentType.PlainText) {
          return { message: text };
        }

        throw new HttpError(response.status, text || 'Unexpected plain text response');
      } else {
        const text = await response.text();
        log('[NetworkingServiceImpl] Unknown content type response:', text);
        throw new HttpError(response.status, text || 'Unexpected response type');
      }
    } catch (error) {
      log('[NetworkingServiceImpl] Caught error:', error);
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.sendRequest(
      endpoint,
      {
        method: HttpMethod.GET,
        signal: options?.signal,
      },
      null,
      options?.expectedResponseType ?? ResponseContentType.JSON,
    );
  }

  async post<T = any>(endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    return this.sendRequest(
      endpoint,
      {
        method: HttpMethod.POST,
        body: JSON.stringify(body),
        signal: options?.signal,
      },
      RequestContentType.JSON,
      options?.expectedResponseType ?? ResponseContentType.JSON,
    );
  }
}

export default NetworkingServiceImpl;
