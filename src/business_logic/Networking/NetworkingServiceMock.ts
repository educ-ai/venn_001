import { NetworkingService } from 'business_logic/Networking/NetworkingService';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

class NetworkingServiceMock implements NetworkingService {
  async get<T = any>(_endpoint: string): Promise<T> {
    await delay(1000);
    return { valid: true } as T;
  }

  async post<T = any>(_endpoint: string, _body: any): Promise<T> {
    await delay(1000);
    return {} as T;
  }
}

export default NetworkingServiceMock;
