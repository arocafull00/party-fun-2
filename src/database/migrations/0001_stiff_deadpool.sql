CREATE TABLE `cartas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mazo_id` integer NOT NULL,
	`texto` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`mazo_id`) REFERENCES `mazos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `mazos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mazos_nombre_unique` ON `mazos` (`nombre`);--> statement-breakpoint
DROP TABLE `baterias`;--> statement-breakpoint
DROP TABLE `palabras`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_partida_actual` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mazo_id` integer NOT NULL,
	`ronda_actual` integer DEFAULT 1 NOT NULL,
	`turno_jugador_id` integer,
	`cartas_restantes` text DEFAULT '[]' NOT NULL,
	`puntaje_azul` integer DEFAULT 0 NOT NULL,
	`puntaje_rojo` integer DEFAULT 0 NOT NULL,
	`jugadores_azul` text DEFAULT '[]' NOT NULL,
	`jugadores_rojo` text DEFAULT '[]' NOT NULL,
	`cartas_acertadas` text DEFAULT '[]' NOT NULL,
	`cartas_falladas` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`mazo_id`) REFERENCES `mazos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_partida_actual`("id", "mazo_id", "ronda_actual", "turno_jugador_id", "cartas_restantes", "puntaje_azul", "puntaje_rojo", "jugadores_azul", "jugadores_rojo", "cartas_acertadas", "cartas_falladas", "created_at", "updated_at") SELECT "id", "mazo_id", "ronda_actual", "turno_jugador_id", "cartas_restantes", "puntaje_azul", "puntaje_rojo", "jugadores_azul", "jugadores_rojo", "cartas_acertadas", "cartas_falladas", "created_at", "updated_at" FROM `partida_actual`;--> statement-breakpoint
DROP TABLE `partida_actual`;--> statement-breakpoint
ALTER TABLE `__new_partida_actual` RENAME TO `partida_actual`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_partidas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fecha` text NOT NULL,
	`mazo_id` integer,
	`equipo_ganador` text,
	`puntuacion_azul` integer DEFAULT 0 NOT NULL,
	`puntuacion_rojo` integer DEFAULT 0 NOT NULL,
	`total_cartas` integer DEFAULT 0 NOT NULL,
	`cartas_correctas` integer DEFAULT 0 NOT NULL,
	`precision` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`mazo_id`) REFERENCES `mazos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_partidas`("id", "fecha", "mazo_id", "equipo_ganador", "puntuacion_azul", "puntuacion_rojo", "total_cartas", "cartas_correctas", "precision", "created_at") SELECT "id", "fecha", "mazo_id", "equipo_ganador", "puntuacion_azul", "puntuacion_rojo", "total_cartas", "cartas_correctas", "precision", "created_at" FROM `partidas`;--> statement-breakpoint
DROP TABLE `partidas`;--> statement-breakpoint
ALTER TABLE `__new_partidas` RENAME TO `partidas`;