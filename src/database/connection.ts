import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';
import * as schema from './schema';

// Open the database
const expo = openDatabaseSync('partyfun.db', { enableChangeListener: true });

// Create drizzle instance
export const db = drizzle(expo, { schema });

// Run migrations
export const runMigrations = async () => {
  try {
    console.log('Running database migrations...');
    await migrate(db, migrations);
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}; 