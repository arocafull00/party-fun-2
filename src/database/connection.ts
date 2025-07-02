import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';
import * as schema from './schema';

// Initialize database connection
let expo: any = null;
let db: any = null;

const initializeDatabase = () => {
  try {
    if (!expo) {
      console.log('Opening database connection...');
      expo = openDatabaseSync('partyfun.db', { enableChangeListener: true });
      console.log('Database connection opened successfully');
    }
    
    if (!db) {
      console.log('Creating drizzle instance...');
      db = drizzle(expo, { schema });
      console.log('Drizzle instance created successfully');
    }
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
};

// Export database instance (lazy initialization)
export const getDb = () => {
  if (!db) {
    return initializeDatabase();
  }
  return db;
};

// For backward compatibility
export { getDb as db };

// Run migrations
export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    const database = getDb();
    await migrate(database, migrations);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}; 