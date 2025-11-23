// Local database client implementation using IndexedDB
import { openDB, IDBPDatabase } from 'idb';
import type { Database, Tables, TablesInsert, TablesUpdate } from './types';
import { seedDatabase } from './seed';

const DB_NAME = 'integrityment_db';
const DB_VERSION = 2;

// List of all tables in our schema
const TABLES = [
  'departments',
  'users',
  'ai_events',
  'ai_alerts',
  'employees',
  'incidents',
  'rewards_punishments',
  'chat_groups',
  'chat_group_members',
  'chat_messages',
  'ai_risk_assessments',
  'ai_analytics',
  'company_policies',
  'data_processing_logs',
  'app_settings',
  'conversations',
  'messages',
  'feedbacks',
  'holidays',
  'leave_requests',
  'notifications',
  'permissions',
  'roles',
  'resignations_terminations',
  'risk_incidents',
  'role_permissions',
  'user_roles',
  'permission_logs',
  'kpis',
  'approvals',
  'pending_employees',
  'meetings',
  'calls'
];

class LocalDatabase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dbPromise: Promise<IDBPDatabase<any>>;
  private listeners: { [table: string]: ((payload: { eventType: string; new: Record<string, unknown> }) => void)[] } = {};

  constructor() {
    this.dbPromise = this.initDB();
  }

  private async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        TABLES.forEach(table => {
          if (!db.objectStoreNames.contains(table)) {
            db.createObjectStore(table, { keyPath: 'id' });
          }
        });
      },
      async blocking() {
        // Handle blocking if needed
      },
      async terminated() {
        // Handle termination
      },
    }).then(async (db) => {
      await seedDatabase(db);
      return db;
    });
  }

  // Subscribe to table changes
  on(table: string, callback: (payload: { eventType: string; new: Record<string, unknown> }) => void) {
    if (!this.listeners[table]) {
      this.listeners[table] = [];
    }
    this.listeners[table].push(callback);
  }

  // Notify listeners of changes
  public notifyListeners(table: string, event: string, data: Record<string, unknown>) {
    if (this.listeners[table]) {
      this.listeners[table].forEach(callback => {
        try {
          callback({ eventType: event, new: data });
        } catch (error) {
          console.error('Error in listener callback:', error);
        }
      });
    }
  }

  // Generate a UUID
  public generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Get current timestamp
  public getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Table operations
  from<T extends keyof Database['public']['Tables']>(table: T) {
    return new LocalQueryBuilder<T>(table, this.dbPromise, this);
  }

  // Channel for real-time subscriptions
  channel(channelName: string) {
    return new LocalChannel(channelName, this);
  }

  // Direct DB access for complex operations if needed
  async getDB() {
    return this.dbPromise;
  }
}

// Query builder for local database operations
class LocalQueryBuilder<T extends keyof Database['public']['Tables']> {
  private table: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private dbPromise: Promise<IDBPDatabase<any>>;
  private dbInstance: LocalDatabase;
  private filters: { [key: string]: unknown } = {};
  private orFilters: { [key: string]: unknown } = {};
  private orderColumn: string | null = null;
  private orderDirection: 'asc' | 'desc' = 'asc';
  private limitCount: number | null = null;
  private selectColumns: string[] = [];
  private isHead: boolean = false;
  private countOption: 'exact' | 'planned' | 'estimated' | null = null;

  constructor(
    table: T,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dbPromise: Promise<IDBPDatabase<any>>,
    dbInstance: LocalDatabase
  ) {
    this.table = table;
    this.dbPromise = dbPromise;
    this.dbInstance = dbInstance;
  }

  // Filter by column equality
  eq(column: string, value: unknown): this {
    this.filters[column] = value;
    return this;
  }

  // Filter with OR condition
  or(filters: string): this {
    const filterParts = filters.split(',');
    const orFilters: { [key: string]: unknown } = {};

    filterParts.forEach(part => {
      const [column, operator, value] = part.split('.');
      if (column && operator && value) {
        if (operator === 'ilike') {
          const cleanValue = (value as string).replace(/[%]/g, '').toLowerCase();
          orFilters[column] = cleanValue;
        } else {
          orFilters[column] = value;
        }
      }
    });

    this.orFilters = orFilters;
    return this;
  }

  // Filter with LIKE condition
  ilike(column: string, pattern: string): this {
    this.filters[column] = pattern.replace(/[%]/g, '');
    return this;
  }

  // Filter with IN condition
  in(column: string, values: unknown[]): this {
    if (values.length > 0) {
      this.filters[column] = values[0];
    }
    return this;
  }

  // Order results
  order(column: string, options?: { ascending?: boolean }): this {
    this.orderColumn = column;
    this.orderDirection = options?.ascending === false ? 'desc' : 'asc';
    return this;
  }

  // Limit results
  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  // Maybe single result
  maybeSingle(): this {
    this.limitCount = 1;
    return this;
  }

  // Select specific columns and execute query
  select(columns?: string, options?: { head?: boolean; count?: 'exact' | 'planned' | 'estimated' }): LocalQueryBuilder<T> {
    if (columns) {
      this.selectColumns = columns.split(',').map(col => col.trim());
    }

    if (options) {
      if (options.head) {
        this.isHead = true;
      }
      if (options.count) {
        this.countOption = options.count;
      }
    }

    return this;
  }

  // Make the builder thenable
  then<TResult1 = { data: Tables<T>[] | null; error: Error | null; count?: number }, TResult2 = never>(
    onfulfilled?: ((value: { data: Tables<T>[] | null; error: Error | null; count?: number }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  // Execute the query
  async execute(): Promise<{ data: Tables<T>[] | null; error: Error | null; count?: number }> {
    try {
      const db = await this.dbPromise;
      let results = await db.getAll(this.table) as Tables<T>[];

      // Apply regular filters
      Object.keys(this.filters).forEach(key => {
        const filterValue = this.filters[key];
        results = results.filter(item => {
          if (key.includes(':')) {
            const [relation, field] = key.split(':');
            return (item as Record<string, unknown>)[relation] && ((item as Record<string, unknown>)[relation] as Record<string, unknown>)[field] === filterValue;
          }
          return (item as Record<string, unknown>)[key] === filterValue;
        });
      });

      // Apply OR filters
      if (Object.keys(this.orFilters).length > 0) {
        const orResults = (await db.getAll(this.table) as Tables<T>[]).filter(item => {
          return Object.keys(this.orFilters).some(key => {
            const filterValue = this.orFilters[key];
            if (typeof (item as Record<string, unknown>)[key] === 'string') {
              return ((item as Record<string, unknown>)[key] as string).toLowerCase().includes((filterValue as string).toLowerCase());
            }
            return (item as Record<string, unknown>)[key] === filterValue;
          });
        });

        // Merge and deduplicate
        const resultMap = new Map();
        results.forEach(item => resultMap.set(item.id, item));
        orResults.forEach(item => resultMap.set(item.id, item));
        results = Array.from(resultMap.values());
      }

      // Apply ordering
      if (this.orderColumn) {
        results.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[this.orderColumn!];
          const bVal = (b as Record<string, unknown>)[this.orderColumn!];

          if (aVal < bVal) return this.orderDirection === 'asc' ? -1 : 1;
          if (aVal > bVal) return this.orderDirection === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply limit
      if (this.limitCount !== null) {
        results = results.slice(0, this.limitCount);
      }

      // Handle head requests
      if (this.isHead && this.countOption) {
        return {
          data: null,
          error: null,
          count: results.length
        };
      }

      return { data: results, error: null, count: results.length };
    } catch (error) {
      console.error('DB Query Error:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  // Direct DB access for complex operations if needed
  async insert(data: TablesInsert<T> | TablesInsert<T>[]): Promise<{ data: Tables<T>[] | null; error: Error | null }> {
    try {
      const db = await this.dbPromise;
      const items = Array.isArray(data) ? data : [data];
      const newItems: Tables<T>[] = [];

      const tx = db.transaction(this.table, 'readwrite');
      const store = tx.objectStore(this.table);

      const promises = items.map(async (item) => {
        const newItem = {
          ...item,
          id: (item as Record<string, unknown>).id || this.dbInstance.generateUUID(),
          created_at: (item as Record<string, unknown>).created_at || this.dbInstance.getCurrentTimestamp()
        } as unknown as Tables<T>;

        await store.put(newItem);
        newItems.push(newItem);

        // Notify listeners
        this.dbInstance.notifyListeners(this.table as string, 'INSERT', newItem as unknown as Record<string, unknown>);
      });

      await Promise.all(promises);
      await tx.done;

      return { data: newItems, error: null };
    } catch (error) {
      console.error('DB Insert Error:', error);
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  // Update data
  async update(data: TablesUpdate<T>): Promise<{ data: Tables<T>[] | null; error: Error | null }> {
    try {
      const db = await this.dbPromise;
      const updatedItems: Tables<T>[] = [];

      // For now, we rely on ID filter for updates as per previous implementation logic
      const idFilter = this.filters['id'];

      if (idFilter) {
        const tx = db.transaction(this.table, 'readwrite');
        const store = tx.objectStore(this.table);

        const existingItem = await store.get(idFilter as string);

        if (existingItem) {
          const updatedItem = { ...existingItem, ...data };
          await store.put(updatedItem);
          updatedItems.push(updatedItem);

          // Notify listeners
          this.dbInstance.notifyListeners(this.table as string, 'UPDATE', updatedItem as unknown as Record<string, unknown>);
        }

        await tx.done;
      } else {
        // Warning: Bulk update without ID not fully implemented in this simple wrapper
        // In a real app, we'd query first then update all
        console.warn('Update called without ID filter - not supported in this simple implementation');
      }

      return { data: updatedItems, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  // Delete data
  async delete(): Promise<{ data: null; error: Error | null }> {
    try {
      const db = await this.dbPromise;
      const idFilter = this.filters['id'];

      if (idFilter) {
        const tx = db.transaction(this.table, 'readwrite');
        const store = tx.objectStore(this.table);

        const existingItem = await store.get(idFilter as string);

        if (existingItem) {
          await store.delete(idFilter as string);

          // Notify listeners
          this.dbInstance.notifyListeners(this.table as string, 'DELETE', existingItem as unknown as Record<string, unknown>);
        }

        await tx.done;
      }

      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }
}

// Real-time subscription channel
class LocalChannel {
  private name: string;
  private db: LocalDatabase;

  constructor(name: string, db: LocalDatabase) {
    this.name = name;
    this.db = db;
  }

  on(event: string, filter: { event: string; schema: string; table: string }, callback: (payload: { eventType: string; new: Record<string, unknown> }) => void) {
    this.db.on(filter.table, (payload) => {
      if (filter.event === '*' || filter.event === payload.eventType) {
        callback(payload);
      }
    });
    return this;
  }

  subscribe(callback?: (status: string) => void) {
    if (callback) {
      setTimeout(() => callback('SUBSCRIBED'), 0);
    }
    return this;
  }

  unsubscribe() {
    return;
  }
}

// Export singleton instance
export const localDb = new LocalDatabase();

// Export createClient function for compatibility
export const createClient = () => localDb;