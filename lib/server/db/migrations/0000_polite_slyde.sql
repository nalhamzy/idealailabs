CREATE TABLE `demo_events` (
	`id` text PRIMARY KEY NOT NULL,
	`demo_key` text NOT NULL,
	`type` text NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`locale` text DEFAULT 'en' NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company` text,
	`business_type` text,
	`project_type` text NOT NULL,
	`budget` text,
	`timeline` text,
	`preferred_channel` text,
	`demo_interest` text,
	`message` text NOT NULL,
	`consent_whatsapp` integer,
	`status` text DEFAULT 'new' NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`assigned_to` text,
	`notes` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `spa_appointments` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_name` text NOT NULL,
	`phone` text NOT NULL,
	`service_id` text NOT NULL,
	`service_name` text NOT NULL,
	`staff_id` text NOT NULL,
	`staff_name` text NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'confirmed' NOT NULL,
	`messages` text DEFAULT '[]' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `store_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`items` text DEFAULT '[]' NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending_payment' NOT NULL,
	`payment_provider` text DEFAULT 'demo' NOT NULL,
	`payment_session_id` text,
	`checkout_url` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
