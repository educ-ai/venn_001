import {
  NetworkingService,
  RequestOptions,
} from 'business_logic/Networking/NetworkingService';

class AbortError extends Error {
  constructor() {
    super('Aborted');
    this.name = 'AbortError';
  }
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(resolve, ms);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new AbortError());
      });
    }
  });
}

class NetworkingServiceMockFailure implements NetworkingService {
  async get<T = any>(_endpoint: string, options?: RequestOptions): Promise<T> {
    await delay(1000, options?.signal);
    throw new Error('Network request failed');
  }

  async post<T = any>(
    _endpoint: string,
    _body: any,
    options?: RequestOptions,
  ): Promise<T> {
    await delay(1000, options?.signal);
    throw new Error('Network request failed');
  }
}

export default NetworkingServiceMockFailure;
