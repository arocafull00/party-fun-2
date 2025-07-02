import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Mazos table
export const mazos = sqliteTable('mazos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Cartas table
export const cartas = sqliteTable('cartas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mazoId: integer('mazo_id').notNull().references(() => mazos.id, { onDelete: 'cascade' }),
  texto: text('texto').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Equipos table
export const equipos = sqliteTable('equipos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Jugadores table
export const jugadores = sqliteTable('jugadores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  equipo: text('equipo', { enum: ['azul', 'rojo', 'azul_temp', 'rojo_temp'] }).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Partidas table
export const partidas = sqliteTable('partidas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fecha: text('fecha').notNull(),
  mazoId: integer('mazo_id').references(() => mazos.id),
  equipoGanador: text('equipo_ganador', { enum: ['azul', 'rojo'] }),
  puntuacionAzul: integer('puntuacion_azul').notNull().default(0),
  puntuacionRojo: integer('puntuacion_rojo').notNull().default(0),
  totalCartas: integer('total_cartas').notNull().default(0),
  cartasCorrectas: integer('cartas_correctas').notNull().default(0),
  precision: integer('precision').notNull().default(0),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Partida jugadores table (junction table)
export const partidaJugadores = sqliteTable('partida_jugadores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  partidaId: integer('partida_id').notNull().references(() => partidas.id, { onDelete: 'cascade' }),
  jugadorId: integer('jugador_id').notNull().references(() => jugadores.id, { onDelete: 'cascade' }),
  equipo: text('equipo', { enum: ['azul', 'rojo'] }).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Partida actual table (for current game state)
export const partidaActual = sqliteTable('partida_actual', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  mazoId: integer('mazo_id').notNull().references(() => mazos.id),
  rondaActual: integer('ronda_actual').notNull().default(1),
  turnoJugadorId: integer('turno_jugador_id'),
  cartasRestantes: text('cartas_restantes').notNull().default('[]'),
  puntajeAzul: integer('puntaje_azul').notNull().default(0),
  puntajeRojo: integer('puntaje_rojo').notNull().default(0),
  jugadoresAzul: text('jugadores_azul').notNull().default('[]'),
  jugadoresRojo: text('jugadores_rojo').notNull().default('[]'),
  cartasAcertadas: text('cartas_acertadas').notNull().default('[]'),
  cartasFalladas: text('cartas_falladas').notNull().default('[]'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const mazosRelations = relations(mazos, ({ many }) => ({
  cartas: many(cartas),
  partidas: many(partidas),
  partidasActuales: many(partidaActual),
}));

export const cartasRelations = relations(cartas, ({ one }) => ({
  mazo: one(mazos, {
    fields: [cartas.mazoId],
    references: [mazos.id],
  }),
}));

export const partidasRelations = relations(partidas, ({ one, many }) => ({
  mazo: one(mazos, {
    fields: [partidas.mazoId],
    references: [mazos.id],
  }),
  jugadores: many(partidaJugadores),
}));

export const jugadoresRelations = relations(jugadores, ({ many }) => ({
  partidas: many(partidaJugadores),
}));

export const partidaJugadoresRelations = relations(partidaJugadores, ({ one }) => ({
  partida: one(partidas, {
    fields: [partidaJugadores.partidaId],
    references: [partidas.id],
  }),
  jugador: one(jugadores, {
    fields: [partidaJugadores.jugadorId],
    references: [jugadores.id],
  }),
}));

export const partidaActualRelations = relations(partidaActual, ({ one }) => ({
  mazo: one(mazos, {
    fields: [partidaActual.mazoId],
    references: [mazos.id],
  }),
}));

// Type exports for TypeScript
export type Mazo = typeof mazos.$inferSelect;
export type NewMazo = typeof mazos.$inferInsert;

export type Carta = typeof cartas.$inferSelect;
export type NewCarta = typeof cartas.$inferInsert;

export type Equipo = typeof equipos.$inferSelect;
export type NewEquipo = typeof equipos.$inferInsert;

export type Jugador = typeof jugadores.$inferSelect;
export type NewJugador = typeof jugadores.$inferInsert;

export type Partida = typeof partidas.$inferSelect;
export type NewPartida = typeof partidas.$inferInsert;

export type PartidaJugador = typeof partidaJugadores.$inferSelect;
export type NewPartidaJugador = typeof partidaJugadores.$inferInsert;

export type PartidaActual = typeof partidaActual.$inferSelect;
export type NewPartidaActual = typeof partidaActual.$inferInsert; 