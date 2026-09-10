type DbRow = Record<string, any>;
type ApiResult<T> = { data: T; error: null } | { data: null; error: Error };

type QueryBuilder = {
  select: (columns?: string) => QueryBuilder;
  order: (column: string, options?: { ascending?: boolean }) => Promise<ApiResult<DbRow[]>>;
  single: () => Promise<ApiResult<DbRow>>;
  eq: (column: string, value: string) => Promise<ApiResult<null>>;
};

const request = async (body?: Record<string, unknown>): Promise<Record<string, unknown>> => {
  const response = await fetch('/api/gaushala', {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  const payload = await response.json() as Record<string, unknown>;
  if (!response.ok) throw new Error(String(payload.error || 'MySQL request failed.'));
  return payload;
};

const failed = (error: unknown): ApiResult<never> => ({
  data: null,
  error: error instanceof Error ? error : new Error(String(error))
});

export const mysqlApi = {
  from(table: string) {
    let values: Record<string, unknown> | undefined;
    let action: 'insert' | 'update' = 'insert';

    const builder: QueryBuilder = {
      select: () => builder,
      order: async () => {
        try {
          const payload = await request();
          return { data: (payload[table] || []) as DbRow[], error: null };
        } catch (error) {
          return failed(error);
        }
      },
      single: async () => {
        try {
          const payload = await request({ action: 'insert', table, values });
          return { data: { id: String(payload.id), ...values } as DbRow, error: null };
        } catch (error) {
          return failed(error);
        }
      },
      eq: async (_column, id) => {
        try {
          await request({ action, table, id, values });
          return { data: null, error: null };
        } catch (error) {
          return failed(error);
        }
      }
    };

    return {
      select: builder.select,
      insert(insertValues: Record<string, unknown>) {
        action = 'insert';
        values = insertValues;
        return builder;
      },
      update(updateValues: Record<string, unknown>) {
        action = 'update';
        values = updateValues;
        return builder;
      }
    };
  }
};
