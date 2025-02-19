import { IDeal, IUser } from './models';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type DealsApiResponse = ApiResponse<IDeal[]>;

export type DealApiResponse = ApiResponse<IDeal>;

export type UserApiResponse = ApiResponse<IUser>;

export interface AuthApiResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}