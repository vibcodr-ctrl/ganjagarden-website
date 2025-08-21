CREATE TABLE `api_usage` (
	`id` text PRIMARY KEY DEFAULT (hex(randomblob(4))) NOT NULL,
	`api_type` text NOT NULL,
	`endpoint` text NOT NULL,
	`tokens_used` integer,
	`cost` real,
	`date` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `knowledge_base` (
	`id` text PRIMARY KEY DEFAULT (hex(randomblob(4))) NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`problem_type` text NOT NULL,
	`symptoms` text,
	`causes` text,
	`solutions` text,
	`prevention` text,
	`image_urls` text,
	`is_active` integer DEFAULT true NOT NULL,
	`uploaded_by` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `special_orders` (
	`id` text PRIMARY KEY DEFAULT (hex(randomblob(4))) NOT NULL,
	`chat_session_id` text,
	`customer_email` text NOT NULL,
	`customer_name` text,
	`customer_phone` text,
	`request_details` text NOT NULL,
	`requested_quantity` integer,
	`requested_strain` text,
	`requested_date` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_notes` text,
	`total_price` real,
	`admin_id` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`chat_session_id`) REFERENCES `chat_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`admin_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `chat_messages` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `chat_messages` ADD `metadata` text;