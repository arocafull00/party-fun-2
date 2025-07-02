CREATE TABLE `baterias` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `baterias_nombre_unique` ON `baterias` (`nombre`);--> statement-breakpoint
CREATE TABLE `equipos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `jugadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`equipo` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `palabras` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bateria_id` integer NOT NULL,
	`texto` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`bateria_id`) REFERENCES `baterias`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partida_actual` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bateria_id` integer NOT NULL,
	`ronda_actual` integer DEFAULT 1 NOT NULL,
	`turno_jugador_id` integer,
	`palabras_restantes` text DEFAULT '[]' NOT NULL,
	`puntaje_azul` integer DEFAULT 0 NOT NULL,
	`puntaje_rojo` integer DEFAULT 0 NOT NULL,
	`jugadores_azul` text DEFAULT '[]' NOT NULL,
	`jugadores_rojo` text DEFAULT '[]' NOT NULL,
	`palabras_acertadas` text DEFAULT '[]' NOT NULL,
	`palabras_falladas` text DEFAULT '[]' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`bateria_id`) REFERENCES `baterias`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `partida_jugadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partida_id` integer NOT NULL,
	`jugador_id` integer NOT NULL,
	`equipo` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`partida_id`) REFERENCES `partidas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`jugador_id`) REFERENCES `jugadores`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `partidas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fecha` text NOT NULL,
	`bateria_id` integer,
	`equipo_ganador` text,
	`puntuacion_azul` integer DEFAULT 0 NOT NULL,
	`puntuacion_rojo` integer DEFAULT 0 NOT NULL,
	`total_palabras` integer DEFAULT 0 NOT NULL,
	`palabras_correctas` integer DEFAULT 0 NOT NULL,
	`precision` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`bateria_id`) REFERENCES `baterias`(`id`) ON UPDATE no action ON DELETE no action
);
