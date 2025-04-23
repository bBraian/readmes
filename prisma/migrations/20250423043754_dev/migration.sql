-- CreateTable
CREATE TABLE "Readmes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "users" TEXT NOT NULL,

    CONSTRAINT "Readmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "Readmes" ADD CONSTRAINT "Readmes_users_fkey" FOREIGN KEY ("users") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
