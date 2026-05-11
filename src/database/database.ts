import { eq, desc, count, sum, avg, sql } from 'drizzle-orm';
import { getDb, runMigrations } from './connection';
import * as schema from './schema';

import type {
  Mazo,
  Carta,
  NewJugador,
  Partida,
  NewPartida,
} from './schema';

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
      this.isInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call init() first.');
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
      const result = await this.db.select().from(schema.mazos).orderBy(schema.mazos.nombre);
      return result;
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
    puntuacionAzul: number;
    puntuacionRojo: number;
    totalCartas: number;
    cartasCorrectas: number;
    precision: number;
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
    totalGames: number;
    totalCards: number;
    averageAccuracy: number;
    gamesWonByBlue: number;
    gamesWonByRed: number;
    ties: number;
  }> {
    this.ensureInitialized();

    try {
      const stats = await this.db.select({
        totalGames: count(),
        totalCards: sum(schema.partidas.totalCartas),
        averageAccuracy: avg(schema.partidas.precision),
        gamesWonByBlue: sum(sql`CASE WHEN ${schema.partidas.equipoGanador} = 'azul' THEN 1 ELSE 0 END`),
        gamesWonByRed: sum(sql`CASE WHEN ${schema.partidas.equipoGanador} = 'rojo' THEN 1 ELSE 0 END`),
        ties: sum(sql`CASE WHEN ${schema.partidas.equipoGanador} IS NULL THEN 1 ELSE 0 END`),
      }).from(schema.partidas);

      const result = stats[0];
      return {
        totalGames: Number(result.totalGames) || 0,
        totalCards: Number(result.totalCards) || 0,
        averageAccuracy: Math.round(Number(result.averageAccuracy) || 0),
        gamesWonByBlue: Number(result.gamesWonByBlue) || 0,
        gamesWonByRed: Number(result.gamesWonByRed) || 0,
        ties: Number(result.ties) || 0,
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
    mazo_nombre: string;
    equipo_ganador: string | null;
    puntuacion_azul: number;
    puntuacion_rojo: number;
    total_cartas: number;
    cartas_correctas: number;
    precision: number;
  }>> {
    this.ensureInitialized();

    try {
      const result = await this.db.select({
        id: schema.partidas.id,
        fecha: schema.partidas.fecha,
        mazo_nombre: schema.mazos.nombre,
        equipo_ganador: schema.partidas.equipoGanador,
        puntuacion_azul: schema.partidas.puntuacionAzul,
        puntuacion_rojo: schema.partidas.puntuacionRojo,
        total_cartas: schema.partidas.totalCartas,
        cartas_correctas: schema.partidas.cartasCorrectas,
        precision: schema.partidas.precision,
      })
      .from(schema.partidas)
      .leftJoin(schema.mazos, eq(schema.partidas.mazoId, schema.mazos.id))
      .orderBy(desc(schema.partidas.fecha))
      .limit(limit);

      return result.map((row) => ({
        ...row,
        mazo_nombre: row.mazo_nombre ?? 'Unknown',
      }));
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
