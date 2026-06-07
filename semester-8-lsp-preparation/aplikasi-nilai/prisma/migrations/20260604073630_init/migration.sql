-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'GURU', 'SISWA');

-- CreateEnum
CREATE TYPE "StatusKelulusan" AS ENUM ('LULUS', 'TIDAK_LULUS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "siswa" (
    "id" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guru" (
    "id" TEXT NOT NULL,
    "idGuru" TEXT NOT NULL,
    "namaGuru" TEXT NOT NULL,
    "mataPelajaran" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nilai" (
    "id" TEXT NOT NULL,
    "nilaiTugas" DOUBLE PRECISION NOT NULL,
    "nilaiUTS" DOUBLE PRECISION NOT NULL,
    "nilaiUAS" DOUBLE PRECISION NOT NULL,
    "nilaiAkhir" DOUBLE PRECISION NOT NULL,
    "statusKelulusan" "StatusKelulusan" NOT NULL,
    "siswaId" TEXT NOT NULL,
    "guruId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nilai_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_nis_key" ON "siswa"("nis");

-- CreateIndex
CREATE UNIQUE INDEX "siswa_userId_key" ON "siswa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "guru_idGuru_key" ON "guru"("idGuru");

-- CreateIndex
CREATE UNIQUE INDEX "guru_userId_key" ON "guru"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "nilai_siswaId_guruId_key" ON "nilai"("siswaId", "guruId");

-- AddForeignKey
ALTER TABLE "siswa" ADD CONSTRAINT "siswa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guru" ADD CONSTRAINT "guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_siswaId_fkey" FOREIGN KEY ("siswaId") REFERENCES "siswa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nilai" ADD CONSTRAINT "nilai_guruId_fkey" FOREIGN KEY ("guruId") REFERENCES "guru"("id") ON DELETE CASCADE ON UPDATE CASCADE;
