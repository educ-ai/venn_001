import { NetworkingService } from './NetworkingService';

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

enum ContentType {
  JSON = 'application/json',
}

class NetworkingServiceImpl implements NetworkingService {
  constructor(private apiUrlPath: string) {}

  private async sendRequest(
    endpoint: string,
    options: RequestInit,
    contentType: ContentType | null = null,
    expectResponse: boolean = true,
  ) {
    if (contentType) {
      options.headers = {
        ...options.headers,
        'Content-Type': contentType,
      };
    }

    try {
      const response = await fetch(`${this.apiUrlPath}/${endpoint}`, options);

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonObject = await response.json();
        if (response.ok) {
          return jsonObject;
        }

        throw new HttpError(response.status, jsonObject['message']);
      } else {
        if (response.ok && !expectResponse) {
          return {};
        }
        const text = await response.text();
        throw new HttpError(response.status, text || 'Response was not JSON');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
    }
  }

  async get<T = any>(endpoint: string): Promise<T> {
    return this.sendRequest(endpoint, {
      method: HttpMethod.GET,
    });
  }

  async post<T = any>(endpoint: string, body: any): Promise<T> {
    return this.sendRequest(
      endpoint,
      {
        method: HttpMethod.POST,
        body: JSON.stringify(body),
      },
      ContentType.JSON,
    );
  }
}

export default NetworkingServiceImpl;
