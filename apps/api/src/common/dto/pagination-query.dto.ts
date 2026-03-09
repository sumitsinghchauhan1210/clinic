import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'page must be at least 1' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'limit must be at least 1' })
  @Max(MAX_LIMIT, { message: `limit must not exceed ${MAX_LIMIT}` })
  limit?: number;
}

export { DEFAULT_PAGE, DEFAULT_LIMIT, MAX_LIMIT };

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function getPaginationSkipTake(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): { skip: number; take: number } {
  const p = Math.max(1, Math.floor(page));
  const l = Math.min(MAX_LIMIT, Math.max(1, Math.floor(limit)));
  return { skip: (p - 1) * l, take: l };
}

export function toPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_LIMIT
): PaginatedResponse<T> {
  const p = Math.max(1, Math.floor(page));
  const l = Math.max(1, Math.floor(limit));
  const totalPages = Math.ceil(total / l) || 1;
  return { data, total, page: p, limit: l, totalPages };
}
