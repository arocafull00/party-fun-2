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

// Jugadores table
export const jugadores = sqliteTable('jugadores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nombre: text('nombre').notNull(),
  equipo: text('equipo', { enum: ['azul', 'rojo'] }).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Partidas table
export const partidas = sqliteTable('partidas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  fecha: text('fecha').notNull(),
  mazoId: integer('mazo_id').references(() => mazos.id),
  equipoGanador: text('equipo_ganador', { enum: ['azul', 'rojo'] }),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Partida jugadores table (junction table)
export const partidaJugadores = sqliteTable('partida_jugadores', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  partidaId: integer('partida_id').notNull().references(() => partidas.id, { onDelete: 'cascade' }),
  jugadorId: integer('jugador_id').notNull().references(() => jugadores.id, { onDelete: 'cascade' }),
  equipo: text('equipo', { enum: ['azul', 'rojo'] }).notNull(),
});

// Relations
export const mazosRelations = relations(mazos, ({ many }) => ({
  cartas: many(cartas),
  partidas: many(partidas),
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

// Type exports for TypeScript
export type Mazo = typeof mazos.$inferSelect;
export type NewMazo = typeof mazos.$inferInsert;

export type Carta = typeof cartas.$inferSelect;
export type NewCarta = typeof cartas.$inferInsert;

export type Jugador = typeof jugadores.$inferSelect;
export type NewJugador = typeof jugadores.$inferInsert;

export type Partida = typeof partidas.$inferSelect;
export type NewPartida = typeof partidas.$inferInsert;

export type PartidaJugador = typeof partidaJugadores.$inferSelect;
export type NewPartidaJugador = typeof partidaJugadores.$inferInsert;
