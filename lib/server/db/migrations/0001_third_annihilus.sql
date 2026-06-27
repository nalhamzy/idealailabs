CREATE TABLE `whatsapp_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`waba_id` text NOT NULL,
	`phone_number_id` text NOT NULL,
	`display_phone_number` text,
	`business_name` text,
	`access_token` text NOT NULL,
	`status` text DEFAULT 'connected' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
