import { NextRequest, NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { mysqlPool } from '@/lib/mysql';

export const runtime = 'nodejs';

const tables = [
  'cows',
  'pregnancies',
  'deliveries',
  'medical_records',
  'vaccinations',
  'milk_records',
  'feed_records',
  'expenses',
  'audit_logs',
  'notifications'
] as const;

type TableName = (typeof tables)[number];

type ActionBody = {
  action: 'insert' | 'update';
  table: TableName;
  id?: string;
  values: Record<string, unknown>;
};

const isTableName = (value: unknown): value is TableName =>
  typeof value === 'string' && tables.includes(value as TableName);

export async function GET() {
  try {
    const entries = await Promise.all(tables.map(async table => {
      const [rows] = await mysqlPool.query<RowDataPacket[]>(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      return [table, rows] as const;
    }));

    return NextResponse.json(Object.fromEntries(entries));
  } catch (error) {
    console.error('Unable to load MySQL data:', error);
    return NextResponse.json({ error: 'Unable to load MySQL data.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ActionBody;
    if (!isTableName(body.table) || !['insert', 'update'].includes(body.action)) {
      return NextResponse.json({ error: 'Invalid database action.' }, { status: 400 });
    }

    const entries = Object.entries(body.values);
    if (!entries.length) {
      return NextResponse.json({ error: 'No values supplied.' }, { status: 400 });
    }

    if (body.action === 'insert') {
      const columns = entries.map(([column]) => `\`${column}\``).join(', ');
      const placeholders = entries.map(() => '?').join(', ');
      const [result] = await mysqlPool.query<ResultSetHeader>(
        `INSERT INTO ${body.table} (${columns}) VALUES (${placeholders})`,
        entries.map(([, value]) => value ?? null)
      );
      return NextResponse.json({ id: result.insertId });
    }

    if (!body.id) return NextResponse.json({ error: 'An id is required.' }, { status: 400 });
    const assignments = entries.map(([column]) => `\`${column}\` = ?`).join(', ');
    await mysqlPool.query(
      `UPDATE ${body.table} SET ${assignments} WHERE id = ?`,
      [...entries.map(([, value]) => value ?? null), body.id]
    );
    return NextResponse.json({ id: body.id });
  } catch (error) {
    console.error('Unable to write MySQL data:', error);
    return NextResponse.json({ error: 'Unable to write MySQL data.' }, { status: 500 });
  }
}
