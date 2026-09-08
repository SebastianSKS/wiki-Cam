CREATE TABLE `regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`seat` text NOT NULL,
	`inegi_key` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `regions_slug_unique` ON `regions` (`slug`);--> statement-breakpoint
CREATE TABLE `species` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`common_name_es` text NOT NULL,
	`genus` text NOT NULL,
	`species_epithet` text NOT NULL,
	`kingdom` text NOT NULL,
	`phylum` text NOT NULL,
	`class` text NOT NULL,
	`order` text NOT NULL,
	`family` text NOT NULL,
	`conservation_status` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`habitat` text NOT NULL,
	`image_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `species_slug_unique` ON `species` (`slug`);--> statement-breakpoint
CREATE TABLE `species_regions` (
	`species_id` integer NOT NULL,
	`region_id` integer NOT NULL,
	PRIMARY KEY(`species_id`, `region_id`),
	FOREIGN KEY (`species_id`) REFERENCES `species`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`region_id`) REFERENCES `regions`(`id`) ON UPDATE no action ON DELETE cascade
);
