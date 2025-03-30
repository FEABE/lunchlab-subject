import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponse } from '../interfaces/pagination.interface';

type OrderBy = { id: 'asc' | 'desc' };

@Injectable()
export class PaginationService {
  async getPaginatedData<
    T,
    W extends Record<string, unknown>,
    S extends Record<string, boolean>,
  >({
    model,
    params: { cursor, take = 10 },
    select,
    where = {} as W,
    orderBy = { id: 'asc' } as OrderBy,
  }: {
    model: {
      findMany: (args: {
        take?: number;
        skip?: number;
        cursor?: { id: number };
        where?: W;
        orderBy?: OrderBy;
        select?: S;
      }) => Promise<T[]>;
    };
    params: PaginationDto;
    select: S;
    where?: W;
    orderBy?: OrderBy;
  }): Promise<PaginatedResponse<T>> {
    const items = await model.findMany({
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where,
      orderBy,
      select,
    });

    let nextCursor: number | undefined = undefined;
    if (items.length > take) {
      const nextItem = items.pop() as T & { id: number };
      nextCursor = nextItem.id;
    }

    return {
      data: items,
      nextCursor,
      count: items.length,
    };
  }
}
