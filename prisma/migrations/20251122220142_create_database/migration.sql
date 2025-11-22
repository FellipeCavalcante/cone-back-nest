/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment_method" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "gateway" VARCHAR(30) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "brand" VARCHAR(20),
    "last4" VARCHAR(4),
    "exp_month" INTEGER,
    "exp_year" INTEGER,
    "holder_name" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "payment_method_id" UUID,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "gateway" VARCHAR(30) NOT NULL,
    "gateway_charge_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invoice" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "pdf_url" VARCHAR(500),
    "due_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "plan_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "next_billing_date" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "payment_method_id" UUID,
    "gateway_subscription_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enterprise" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_enterprise" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "enterprise_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sector" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "enterprise_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sector_task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sector_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "sector_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "enterprise_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_project" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "project_task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_sector" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "sector_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "project_sector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(50) NOT NULL,
    "file_size" INTEGER,
    "s3_key" VARCHAR(500) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profile_photo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "attachment_id" UUID NOT NULL,
    "user_id" UUID,
    "enterprise_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."task_attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "task_id" UUID NOT NULL,
    "attachment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_attachment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" UUID NOT NULL,
    "attachment_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE INDEX "payment_method_user_id_idx" ON "public"."payment_method"("user_id");

-- CreateIndex
CREATE INDEX "payment_user_id_idx" ON "public"."payment"("user_id");

-- CreateIndex
CREATE INDEX "payment_payment_method_id_idx" ON "public"."payment"("payment_method_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_payment_id_key" ON "public"."invoice"("payment_id");

-- CreateIndex
CREATE INDEX "invoice_user_id_idx" ON "public"."invoice"("user_id");

-- CreateIndex
CREATE INDEX "user_plan_user_id_idx" ON "public"."user_plan"("user_id");

-- CreateIndex
CREATE INDEX "user_plan_plan_id_idx" ON "public"."user_plan"("plan_id");

-- CreateIndex
CREATE INDEX "user_plan_payment_method_id_idx" ON "public"."user_plan"("payment_method_id");

-- CreateIndex
CREATE INDEX "user_enterprise_user_id_idx" ON "public"."user_enterprise"("user_id");

-- CreateIndex
CREATE INDEX "user_enterprise_enterprise_id_idx" ON "public"."user_enterprise"("enterprise_id");

-- CreateIndex
CREATE INDEX "sector_enterprise_id_idx" ON "public"."sector"("enterprise_id");

-- CreateIndex
CREATE INDEX "user_task_user_id_idx" ON "public"."user_task"("user_id");

-- CreateIndex
CREATE INDEX "user_task_task_id_idx" ON "public"."user_task"("task_id");

-- CreateIndex
CREATE INDEX "sector_task_sector_id_idx" ON "public"."sector_task"("sector_id");

-- CreateIndex
CREATE INDEX "sector_task_task_id_idx" ON "public"."sector_task"("task_id");

-- CreateIndex
CREATE INDEX "project_enterprise_id_idx" ON "public"."project"("enterprise_id");

-- CreateIndex
CREATE INDEX "user_project_user_id_idx" ON "public"."user_project"("user_id");

-- CreateIndex
CREATE INDEX "user_project_project_id_idx" ON "public"."user_project"("project_id");

-- CreateIndex
CREATE INDEX "project_task_project_id_idx" ON "public"."project_task"("project_id");

-- CreateIndex
CREATE INDEX "project_task_task_id_idx" ON "public"."project_task"("task_id");

-- CreateIndex
CREATE INDEX "project_sector_project_id_idx" ON "public"."project_sector"("project_id");

-- CreateIndex
CREATE INDEX "project_sector_sector_id_idx" ON "public"."project_sector"("sector_id");

-- CreateIndex
CREATE UNIQUE INDEX "attachment_s3_key_key" ON "public"."attachment"("s3_key");

-- CreateIndex
CREATE UNIQUE INDEX "profile_photo_attachment_id_key" ON "public"."profile_photo"("attachment_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_photo_user_id_key" ON "public"."profile_photo"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_photo_enterprise_id_key" ON "public"."profile_photo"("enterprise_id");

-- CreateIndex
CREATE INDEX "profile_photo_user_id_idx" ON "public"."profile_photo"("user_id");

-- CreateIndex
CREATE INDEX "profile_photo_enterprise_id_idx" ON "public"."profile_photo"("enterprise_id");

-- CreateIndex
CREATE INDEX "task_attachment_task_id_idx" ON "public"."task_attachment"("task_id");

-- CreateIndex
CREATE INDEX "task_attachment_attachment_id_idx" ON "public"."task_attachment"("attachment_id");

-- CreateIndex
CREATE INDEX "project_attachment_project_id_idx" ON "public"."project_attachment"("project_id");

-- CreateIndex
CREATE INDEX "project_attachment_attachment_id_idx" ON "public"."project_attachment"("attachment_id");

-- AddForeignKey
ALTER TABLE "public"."payment_method" ADD CONSTRAINT "payment_method_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."invoice" ADD CONSTRAINT "invoice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_plan" ADD CONSTRAINT "user_plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_plan" ADD CONSTRAINT "user_plan_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_plan" ADD CONSTRAINT "user_plan_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_photo" ADD CONSTRAINT "profile_photo_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_photo" ADD CONSTRAINT "profile_photo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."profile_photo" ADD CONSTRAINT "profile_photo_enterprise_id_fkey" FOREIGN KEY ("enterprise_id") REFERENCES "public"."enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_attachment" ADD CONSTRAINT "task_attachment_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."task_attachment" ADD CONSTRAINT "task_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_attachment" ADD CONSTRAINT "project_attachment_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_attachment" ADD CONSTRAINT "project_attachment_attachment_id_fkey" FOREIGN KEY ("attachment_id") REFERENCES "public"."attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
