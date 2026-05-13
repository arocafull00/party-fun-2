import { eq, desc, count, sum, sql } from 'drizzle-orm';
import { getDb, runMigrations } from './connection';
import * as schema from './schema';
import defaultDecksJson from '../data/default-decks.json';

import type {
  Mazo,
  Carta,
  NewJugador,
  Partida,
  NewPartida,
} from './schema';

type DefaultDeckSeed = { nombre: string; cartas: string[] };

const defaultDecksSeed = defaultDecksJson as DefaultDeckSeed[];

const defaultDeckNames = new Set(defaultDecksSeed.map((d) => d.nombre));

class DatabaseManager {
  private isInitialized = false;

  private get db() {
    return getDb();
  }

  public async init(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('Initializing database...');
      await runMigrations();
      await this.ensureDefaultDecks();
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  public async syncDefaultDecks(): Promise<void> {
    this.ensureInitialized();
    await this.ensureDefaultDecks();
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call init() first.');
    }
  }

  private async ensureDefaultDecks(): Promise<void> {
    for (const deck of defaultDecksSeed) {
      const found = await this.db
        .select({ id: schema.mazos.id })
        .from(schema.mazos)
        .where(eq(schema.mazos.nombre, deck.nombre))
        .limit(1);
      if (found.length > 0) {
        continue;
      }

      const inserted = await this.db
        .insert(schema.mazos)
        .values({ nombre: deck.nombre })
        .returning({ id: schema.mazos.id });
      const mazoId = inserted[0].id;

      for (const texto of deck.cartas) {
        await this.db.insert(schema.cartas).values({ mazoId, texto });
      }
    }
  }

  // Mazo methods
  async createMazo(nombre: string): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.insert(schema.mazos).values({ nombre }).returning({ id: schema.mazos.id });
      return result[0].id;
    } catch (error) {
      console.error('Error creating mazo:', error);
      throw error;
    }
  }

  async getMazos(): Promise<Mazo[]> {
    this.ensureInitialized();

    try {
      const result = await this.db.select().from(schema.mazos);
      return result.sort((a, b) => {
        const aIsDefault = defaultDeckNames.has(a.nombre);
        const bIsDefault = defaultDeckNames.has(b.nombre);
        if (aIsDefault !== bIsDefault) {
          return aIsDefault ? 1 : -1;
        }
        return a.nombre.localeCompare(b.nombre, 'es');
      });
    } catch (error) {
      console.error('Error getting mazos:', error);
      throw error;
    }
  }

  async deleteMazo(id: number): Promise<void> {
    this.ensureInitialized();

    try {
      await this.db.delete(schema.mazos).where(eq(schema.mazos.id, id));
    } catch (error) {
      console.error('Error deleting mazo:', error);
      throw error;
    }
  }

  async updateMazo(id: number, nombre: string): Promise<void> {
    this.ensureInitialized();

    try {
      await this.db.update(schema.mazos)
        .set({ nombre })
        .where(eq(schema.mazos.id, id));
    } catch (error) {
      console.error('Error updating mazo:', error);
      throw error;
    }
  }

  async getMazo(id: number): Promise<Mazo | undefined> {
    this.ensureInitialized();

    try {
      const result = await this.db.select().from(schema.mazos).where(eq(schema.mazos.id, id));
      return result[0];
    } catch (error) {
      console.error('Error getting mazo:', error);
      throw error;
    }
  }

  async updateMazoWithCards(id: number, nombre: string, cards: string[]): Promise<void> {
    this.ensureInitialized();

    try {
      await this.db.update(schema.mazos)
        .set({ nombre })
        .where(eq(schema.mazos.id, id));

      await this.db.delete(schema.cartas).where(eq(schema.cartas.mazoId, id));

      for (const card of cards) {
        await this.addCarta(id, card);
      }
    } catch (error) {
      console.error('Error updating mazo with cards:', error);
      throw error;
    }
  }

  // Carta methods
  async addCarta(mazo_id: number, texto: string): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.insert(schema.cartas).values({
        mazoId: mazo_id,
        texto
      }).returning({ id: schema.cartas.id });
      return result[0].id;
    } catch (error) {
      console.error('Error adding carta:', error);
      throw error;
    }
  }

  async getCartasByMazo(mazo_id: number): Promise<Carta[]> {
    this.ensureInitialized();

    try {
      const result = await this.db.select()
        .from(schema.cartas)
        .where(eq(schema.cartas.mazoId, mazo_id))
        .orderBy(schema.cartas.texto);
      return result;
    } catch (error) {
      console.error('Error getting cartas by mazo:', error);
      throw error;
    }
  }

  async countCartasByMazo(mazo_id: number): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.select({ value: count() })
        .from(schema.cartas)
        .where(eq(schema.cartas.mazoId, mazo_id));
      return result[0]?.value ?? 0;
    } catch (error) {
      console.error('Error counting cartas by mazo:', error);
      throw error;
    }
  }

  async deleteCarta(id: number): Promise<void> {
    this.ensureInitialized();

    try {
      await this.db.delete(schema.cartas).where(eq(schema.cartas.id, id));
    } catch (error) {
      console.error('Error deleting carta:', error);
      throw error;
    }
  }

  // Partida methods
  async savePartida(partida: Omit<NewPartida, 'id'>): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.insert(schema.partidas).values(partida).returning({ id: schema.partidas.id });
      return result[0].id;
    } catch (error) {
      console.error('Error saving partida:', error);
      throw error;
    }
  }

  async getPartidas(): Promise<Partida[]> {
    this.ensureInitialized();

    try {
      const result = await this.db.select().from(schema.partidas).orderBy(desc(schema.partidas.fecha));
      return result;
    } catch (error) {
      console.error('Error getting partidas:', error);
      throw error;
    }
  }

  // Create a new game/partida
  async createPartida(gameData: {
    fecha: string;
    mazoId: number;
    equipoGanador: 'azul' | 'rojo' | null;
  }): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.insert(schema.partidas).values(gameData as NewPartida).returning({ id: schema.partidas.id });
      return result[0].id;
    } catch (error) {
      console.error('Error creating partida:', error);
      throw error;
    }
  }

  // Create a new player
  async createJugador(playerData: {
    nombre: string;
    equipo: 'azul' | 'rojo';
  }): Promise<number> {
    this.ensureInitialized();

    try {
      const result = await this.db.insert(schema.jugadores).values(playerData).returning({ id: schema.jugadores.id });
      return result[0].id;
    } catch (error) {
      console.error('Error creating jugador:', error);
      throw error;
    }
  }

  // Link a player to a game
  async addPlayerToGame(partidaId: number, jugadorId: number, equipo: 'azul' | 'rojo'): Promise<void> {
    this.ensureInitialized();

    try {
      await this.db.insert(schema.partidaJugadores).values({
        partidaId,
        jugadorId,
        equipo,
      });
    } catch (error) {
      console.error('Error linking player to game:', error);
      throw error;
    }
  }

  // Get game statistics
  async getGameStatistics(): Promise<{
    gamesWonByBlue: number;
    gamesWonByRed: number;
  }> {
    this.ensureInitialized();

    try {
      const stats = await this.db.select({
        gamesWonByBlue: sum(sql`CASE WHEN ${schema.partidas.equipoGanador} = 'azul' THEN 1 ELSE 0 END`),
        gamesWonByRed: sum(sql`CASE WHEN ${schema.partidas.equipoGanador} = 'rojo' THEN 1 ELSE 0 END`),
      }).from(schema.partidas);

      const result = stats[0];
      return {
        gamesWonByBlue: Number(result.gamesWonByBlue) || 0,
        gamesWonByRed: Number(result.gamesWonByRed) || 0,
      };
    } catch (error) {
      console.error('Error getting game statistics:', error);
      throw error;
    }
  }

  async getPlayerWins(): Promise<Array<{
    nombre: string;
    wins: number;
  }>> {
    this.ensureInitialized();

    try {
      const result = await this.db.select({
        nombre: schema.jugadores.nombre,
        wins: count(),
      })
      .from(schema.partidaJugadores)
      .innerJoin(schema.partidas, eq(schema.partidaJugadores.partidaId, schema.partidas.id))
      .innerJoin(schema.jugadores, eq(schema.partidaJugadores.jugadorId, schema.jugadores.id))
      .where(
        sql`${schema.partidas.equipoGanador} IS NOT NULL AND ${schema.partidaJugadores.equipo} = ${schema.partidas.equipoGanador}`
      )
      .groupBy(schema.jugadores.nombre)
      .orderBy(desc(count()), schema.jugadores.nombre);

      return result.map((row) => ({
        nombre: row.nombre,
        wins: Number(row.wins) || 0,
      }));
    } catch (error) {
      console.error('Error getting player wins:', error);
      throw error;
    }
  }

  // Get players for a specific game
  async getGamePlayers(partidaId: number): Promise<Array<{
    id: number;
    nombre: string;
    equipo: string;
  }>> {
    this.ensureInitialized();

    try {
      const result = await this.db.select({
        id: schema.jugadores.id,
        nombre: schema.jugadores.nombre,
        equipo: schema.jugadores.equipo,
      })
      .from(schema.jugadores)
      .innerJoin(schema.partidaJugadores, eq(schema.jugadores.id, schema.partidaJugadores.jugadorId))
      .where(eq(schema.partidaJugadores.partidaId, partidaId))
      .orderBy(schema.jugadores.equipo, schema.jugadores.nombre);

      return result;
    } catch (error) {
      console.error('Error getting game players:', error);
      throw error;
    }
  }

}

export const database = new DatabaseManager();

// Export types for backward compatibility
export type {
  Mazo,
  Carta,
  Jugador,
  Partida,
  PartidaJugador,
} from './schema';
