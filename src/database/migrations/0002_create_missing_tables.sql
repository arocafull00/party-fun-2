-- Create missing tables that are in schema but not in database

-- Create jugadores table
CREATE TABLE IF NOT EXISTS `jugadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`equipo` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

-- Create equipos table  
CREATE TABLE IF NOT EXISTS `equipos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nombre` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

-- Create partida_jugadores table
CREATE TABLE IF NOT EXISTS `partida_jugadores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`partida_id` integer NOT NULL,
	`jugador_id` integer NOT NULL,
	`equipo` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`partida_id`) REFERENCES `partidas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`jugador_id`) REFERENCES `jugadores`(`id`) ON UPDATE no action ON DELETE cascade
); 