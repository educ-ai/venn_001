import { NetworkingService } from 'business_logic/Networking/NetworkingService';

const delay = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

class NetworkingServiceMockFailure implements NetworkingService {
  async get<T = any>(_endpoint: string): Promise<T> {
    await delay(1000);
    throw new Error('Network request failed');
  }

  async post<T = any>(_endpoint: string, _body: any): Promise<T> {
    await delay(1000);
    throw new Error('Network request failed');
  }
}

export default NetworkingServiceMockFailure;
