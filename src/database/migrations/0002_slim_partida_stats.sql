PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_partidas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`fecha` text NOT NULL,
	`mazo_id` integer,
	`equipo_ganador` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`mazo_id`) REFERENCES `mazos`(`id`) ON UPDATE no action ON DELETE no action
);--> statement-breakpoint
INSERT INTO `__new_partidas` (`id`, `fecha`, `mazo_id`, `equipo_ganador`, `created_at`)
SELECT `id`, `fecha`, `mazo_id`, `equipo_ganador`, `created_at` FROM `partidas`;--> statement-breakpoint
DROP TABLE `partidas`;--> statement-breakpoint
ALTER TABLE `__new_partidas` RENAME TO `partidas`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
