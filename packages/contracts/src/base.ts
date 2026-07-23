export interface ApiMeta {
  requestId: string;
  timestamp: string;
}

export interface ApiSuccess<T> {
  code: 0;
  message: 'ok';
  data: T;
  meta: ApiMeta;
}

export interface ApiFailed<T> {
  code: number;
  message: string;
  data?: T | null;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailed<T>;
