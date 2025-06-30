import * as SQLite from 'expo-sqlite';

export interface Bateria {
  id: number;
  nombre: string;
}

export interface Palabra {
  id: number;
  bateria_id: number;
  texto: string;
}

export interface Jugador {
  id: number;
  nombre: string;
  equipo: string;
}

export interface Equipo {
  id: number;
  nombre: string;
}

export interface Partida {
  id: number;
  fecha: string;
  bateria_id: number;
  equipo_ganador: string | null;
  puntuacion_azul: number;
  puntuacion_rojo: number;
  total_palabras: number;
  palabras_correctas: number;
  precision: number;
}

export interface PartidaJugador {
  id: number;
  partida_id: number;
  jugador_id: number;
  equipo: 'azul' | 'rojo';
}

export interface PartidaActual {
  id: number;
  bateria_id: number;
  ronda_actual: number;
  turno_jugador_id: number;
  palabras_restantes: string;
  puntaje_azul: number;
  puntaje_rojo: number;
  jugadores_azul: string;
  jugadores_rojo: string;
  palabras_acertadas: string;
  palabras_falladas: string;
}

class DatabaseManager {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    try {
      console.log('Starting database initialization...');
      
      if (this.isInitialized && this.db) {
        console.log('Database already initialized');
        return;
      }

      // Open database with proper error handling
      this.db = await SQLite.openDatabaseAsync('partyfun.db', {
        enableChangeListener: true,
      });
      
      if (!this.db) {
        throw new Error('Failed to open database connection');
      }
      
      console.log('Database connection opened successfully');
      
      // Configure database settings
      await this.configurateDatabase();
      
      // Create all tables
      await this.createTables();
      
      // Verify database integrity
      await this.verifyDatabase();
      
      // Initialize with default data if needed
      await this.initializeDefaultData();
      
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      this.db = null;
      this.isInitialized = false;
      throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async configurateDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      // Enable WAL mode for better performance and concurrency
      await this.db.execAsync('PRAGMA journal_mode = WAL;');
      
      // Enable foreign key constraints
      await this.db.execAsync('PRAGMA foreign_keys = ON;');
      
      // Set synchronous mode for better performance
      await this.db.execAsync('PRAGMA synchronous = NORMAL;');
      
      // Set cache size
      await this.db.execAsync('PRAGMA cache_size = 10000;');
      
      console.log('Database configuration completed');
    } catch (error) {
      console.error('Error configuring database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      console.log('Creating database tables...');
      
      // Create baterias table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS baterias (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create palabras table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS palabras (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bateria_id INTEGER NOT NULL,
          texto TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bateria_id) REFERENCES baterias (id) ON DELETE CASCADE
        );
      `);

      // Create equipos table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS equipos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create jugadores table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS jugadores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre TEXT NOT NULL,
          equipo TEXT NOT NULL CHECK (equipo IN ('azul', 'rojo')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create partidas table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS partidas (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha TEXT NOT NULL,
          bateria_id INTEGER,
          equipo_ganador TEXT CHECK (equipo_ganador IN ('azul', 'rojo') OR equipo_ganador IS NULL),
          puntuacion_azul INTEGER NOT NULL DEFAULT 0,
          puntuacion_rojo INTEGER NOT NULL DEFAULT 0,
          total_palabras INTEGER NOT NULL DEFAULT 0,
          palabras_correctas INTEGER NOT NULL DEFAULT 0,
          precision INTEGER NOT NULL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bateria_id) REFERENCES baterias (id)
        );
      `);

      // Create partida_jugadores table
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS partida_jugadores (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          partida_id INTEGER NOT NULL,
          jugador_id INTEGER NOT NULL,
          equipo TEXT NOT NULL CHECK (equipo IN ('azul', 'rojo')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (partida_id) REFERENCES partidas (id) ON DELETE CASCADE,
          FOREIGN KEY (jugador_id) REFERENCES jugadores (id) ON DELETE CASCADE
        );
      `);

      // Create partida_actual table (for current game state)
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS partida_actual (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bateria_id INTEGER NOT NULL,
          ronda_actual INTEGER NOT NULL DEFAULT 1,
          turno_jugador_id INTEGER,
          palabras_restantes TEXT NOT NULL DEFAULT '[]',
          puntaje_azul INTEGER NOT NULL DEFAULT 0,
          puntaje_rojo INTEGER NOT NULL DEFAULT 0,
          jugadores_azul TEXT NOT NULL DEFAULT '[]',
          jugadores_rojo TEXT NOT NULL DEFAULT '[]',
          palabras_acertadas TEXT NOT NULL DEFAULT '[]',
          palabras_falladas TEXT NOT NULL DEFAULT '[]',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bateria_id) REFERENCES baterias (id)
        );
      `);

      // Create indexes for better performance
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_palabras_bateria_id ON palabras(bateria_id);
      `);
      
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_partidas_fecha ON partidas(fecha);
      `);
      
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_partida_jugadores_partida_id ON partida_jugadores(partida_id);
      `);

      console.log('All database tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  private async verifyDatabase(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      console.log('Verifying database integrity...');
      
      // Check if all tables exist
      const tables = await this.db.getAllAsync(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
      `) as Array<{ name: string }>;
      
      const expectedTables = ['baterias', 'palabras', 'equipos', 'jugadores', 'partidas', 'partida_jugadores', 'partida_actual'];
      const existingTables = tables.map(t => t.name);
      
      console.log('Existing tables:', existingTables);
      
      for (const expectedTable of expectedTables) {
        if (!existingTables.includes(expectedTable)) {
          throw new Error(`Required table '${expectedTable}' not found`);
        }
      }
      
      // Test basic database functionality
      const testResult = await this.db.getFirstAsync('SELECT 1 as test') as { test: number } | null;
      if (!testResult || testResult.test !== 1) {
        throw new Error('Database test query failed');
      }
      
      console.log('Database verification completed successfully');
    } catch (error) {
      console.error('Error verifying database:', error);
      throw error;
    }
  }

  private async initializeDefaultData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      console.log('Checking for default data...');
      
      // Check if we have any baterias
      const bateriasCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM baterias') as { count: number };
      
      if (bateriasCount.count === 0) {
        console.log('No baterias found, creating default battery...');
        
        // Create a default battery with some sample words
        const defaultBatteryId = await this.createBateria('Batería Básica');
        
        const defaultWords = [
          'Casa', 'Perro', 'Gato', 'Coche', 'Libro', 'Mesa', 'Silla', 'Agua',
          'Fuego', 'Tierra', 'Aire', 'Sol', 'Luna', 'Estrella', 'Mar', 'Montaña',
          'Árbol', 'Flor', 'Pájaro', 'Pez', 'Música', 'Baile', 'Comida', 'Amor'
        ];
        
        for (const word of defaultWords) {
          await this.addPalabra(defaultBatteryId, word);
        }
        
        console.log(`Default battery created with ${defaultWords.length} words`);
      }
      
      console.log('Default data initialization completed');
    } catch (error) {
      console.error('Error initializing default data:', error);
      // Don't throw here, as this is not critical for app functionality
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized || !this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
  }

  // Bateria methods
  async createBateria(nombre: string): Promise<number> {
    this.ensureInitialized();
    
    try {
      const result = await this.db!.runAsync('INSERT INTO baterias (nombre) VALUES (?)', [nombre]);
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating bateria:', error);
      throw error;
    }
  }

  async getBaterias(): Promise<Bateria[]> {
    this.ensureInitialized();
    
    try {
      const result = await this.db!.getAllAsync('SELECT id, nombre FROM baterias ORDER BY nombre') as Bateria[];
      return result;
    } catch (error) {
      console.error('Error getting baterias:', error);
      throw error;
    }
  }

  async deleteBateria(id: number): Promise<void> {
    this.ensureInitialized();
    
    try {
      await this.db!.runAsync('DELETE FROM baterias WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting bateria:', error);
      throw error;
    }
  }

  // Palabra methods
  async addPalabra(bateria_id: number, texto: string): Promise<number> {
    this.ensureInitialized();
    
    try {
      const result = await this.db!.runAsync(
        'INSERT INTO palabras (bateria_id, texto) VALUES (?, ?)',
        [bateria_id, texto]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error adding palabra:', error);
      throw error;
    }
  }

  async getPalabrasByBateria(bateria_id: number): Promise<Palabra[]> {
    this.ensureInitialized();
    
    try {
      const result = await this.db!.getAllAsync(
        'SELECT id, bateria_id, texto FROM palabras WHERE bateria_id = ? ORDER BY texto',
        [bateria_id]
      ) as Palabra[];
      return result;
    } catch (error) {
      console.error('Error getting palabras by bateria:', error);
      throw error;
    }
  }

  async deletePalabra(id: number): Promise<void> {
    this.ensureInitialized();
    
    try {
      await this.db!.runAsync('DELETE FROM palabras WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting palabra:', error);
      throw error;
    }
  }

  // Partida methods
  async savePartida(partida: Omit<Partida, 'id'>): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.runAsync(
        `INSERT INTO partidas (
          fecha, bateria_id, equipo_ganador, puntuacion_azul, puntuacion_rojo, 
          total_palabras, palabras_correctas, precision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          partida.fecha, 
          partida.bateria_id, 
          partida.equipo_ganador, 
          partida.puntuacion_azul, 
          partida.puntuacion_rojo,
          partida.total_palabras,
          partida.palabras_correctas,
          partida.precision
        ]
      );
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error saving partida:', error);
      throw error;
    }
  }

  async getPartidas(): Promise<Partida[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getAllAsync('SELECT * FROM partidas ORDER BY fecha DESC');
      return result as Partida[];
    } catch (error) {
      console.error('Error getting partidas:', error);
      throw error;
    }
  }

  // Partida actual methods
  async savePartidaActual(partida: Omit<PartidaActual, 'id'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO partida_actual 
         (id, bateria_id, ronda_actual, turno_jugador_id, palabras_restantes, puntaje_azul, puntaje_rojo, jugadores_azul, jugadores_rojo, palabras_acertadas, palabras_falladas) 
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          partida.bateria_id,
          partida.ronda_actual,
          partida.turno_jugador_id,
          partida.palabras_restantes,
          partida.puntaje_azul,
          partida.puntaje_rojo,
          partida.jugadores_azul,
          partida.jugadores_rojo,
          partida.palabras_acertadas,
          partida.palabras_falladas
        ]
      );
    } catch (error) {
      console.error('Error saving partida actual:', error);
      throw error;
    }
  }

  async getPartidaActual(): Promise<PartidaActual | null> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.getFirstAsync('SELECT * FROM partida_actual WHERE id = 1');
      return result as PartidaActual | null;
    } catch (error) {
      console.error('Error getting partida actual:', error);
      throw error;
    }
  }

  async clearPartidaActual(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync('DELETE FROM partida_actual WHERE id = 1');
    } catch (error) {
      console.error('Error clearing partida actual:', error);
      throw error;
    }
  }

  // Create a new game/partida
  async createPartida(gameData: {
    fecha: string;
    bateria_id: number;
    equipo_ganador: string | null;
    puntuacion_azul: number;
    puntuacion_rojo: number;
    total_palabras: number;
    palabras_correctas: number;
    precision: number;
  }): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.runAsync(
        `INSERT INTO partidas (
          fecha, bateria_id, equipo_ganador, puntuacion_azul, 
          puntuacion_rojo, total_palabras, palabras_correctas, precision
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          gameData.fecha,
          gameData.bateria_id,
          gameData.equipo_ganador,
          gameData.puntuacion_azul,
          gameData.puntuacion_rojo,
          gameData.total_palabras,
          gameData.palabras_correctas,
          gameData.precision
        ]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating partida:', error);
      throw error;
    }
  }

  // Create a new player
  async createJugador(playerData: {
    nombre: string;
    equipo: string;
  }): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const result = await this.db.runAsync(
        'INSERT INTO jugadores (nombre, equipo) VALUES (?, ?)',
        [playerData.nombre, playerData.equipo]
      );
      
      return result.lastInsertRowId;
    } catch (error) {
      console.error('Error creating jugador:', error);
      throw error;
    }
  }

  // Link a player to a game
  async addPlayerToGame(partidaId: number, jugadorId: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      await this.db.runAsync(
        'INSERT INTO partida_jugadores (partida_id, jugador_id) VALUES (?, ?)',
        [partidaId, jugadorId]
      );
    } catch (error) {
      console.error('Error linking player to game:', error);
      throw error;
    }
  }

  // Get game statistics
  async getGameStatistics(): Promise<{
    totalGames: number;
    totalWords: number;
    averageAccuracy: number;
    gamesWonByBlue: number;
    gamesWonByRed: number;
    ties: number;
  }> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const row = await this.db.getFirstAsync(`
        SELECT 
          COUNT(*) as totalGames,
          SUM(total_palabras) as totalWords,
          AVG(precision) as averageAccuracy,
          SUM(CASE WHEN equipo_ganador = 'azul' THEN 1 ELSE 0 END) as gamesWonByBlue,
          SUM(CASE WHEN equipo_ganador = 'rojo' THEN 1 ELSE 0 END) as gamesWonByRed,
          SUM(CASE WHEN equipo_ganador IS NULL THEN 1 ELSE 0 END) as ties
        FROM partidas
      `);
      
      return {
        totalGames: (row as any)?.totalGames || 0,
        totalWords: (row as any)?.totalWords || 0,
        averageAccuracy: Math.round((row as any)?.averageAccuracy || 0),
        gamesWonByBlue: (row as any)?.gamesWonByBlue || 0,
        gamesWonByRed: (row as any)?.gamesWonByRed || 0,
        ties: (row as any)?.ties || 0,
      };
    } catch (error) {
      console.error('Error getting game statistics:', error);
      throw error;
    }
  }

  // Get recent games with details
  async getRecentGames(limit: number = 10): Promise<Array<{
    id: number;
    fecha: string;
    bateria_nombre: string;
    equipo_ganador: string | null;
    puntuacion_azul: number;
    puntuacion_rojo: number;
    total_palabras: number;
    palabras_correctas: number;
    precision: number;
  }>> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const rows = await this.db.getAllAsync(`
        SELECT 
          p.id,
          p.fecha,
          b.nombre as bateria_nombre,
          p.equipo_ganador,
          p.puntuacion_azul,
          p.puntuacion_rojo,
          p.total_palabras,
          p.palabras_correctas,
          p.precision
        FROM partidas p
        LEFT JOIN baterias b ON p.bateria_id = b.id
        ORDER BY p.fecha DESC
        LIMIT ?
      `, [limit]);
      
      return rows as any[] || [];
    } catch (error) {
      console.error('Error getting recent games:', error);
      throw error;
    }
  }

  // Get players for a specific game
  async getGamePlayers(partidaId: number): Promise<Array<{
    id: number;
    nombre: string;
    equipo: string;
  }>> {
    if (!this.db) throw new Error('Database not initialized');
    
    try {
      const rows = await this.db.getAllAsync(`
        SELECT j.id, j.nombre, j.equipo
        FROM jugadores j
        INNER JOIN partida_jugadores pj ON j.id = pj.jugador_id
        WHERE pj.partida_id = ?
        ORDER BY j.equipo, j.nombre
      `, [partidaId]);
      
      return rows as any[] || [];
    } catch (error) {
      console.error('Error getting game players:', error);
      throw error;
    }
  }
}

export const database = new DatabaseManager(); 