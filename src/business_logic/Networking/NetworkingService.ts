export interface NetworkingService {
  get<T = any>(endpoint: string): Promise<T>;
  post<T = any>(endpoint: string, body: any): Promise<T>;
}
