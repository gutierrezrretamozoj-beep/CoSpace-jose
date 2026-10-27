// prisma/seed.ts
import { PrismaClient, Role, SpaceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Limpieza inicial controlada para permitir reejecución limpia
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  // 1. Crear el usuario Administrador inicial (con contraseña hasheada)
  const adminPasswordHash: string = await bcrypt.hash('Admin1234!', 10);
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@cospace.com',
      password: adminPasswordHash,
      role: Role.ADMIN,
    },
  });

  // 2. Crear los 3 espacios de coworking iniciales con imágenes de Unsplash
  await prisma.space.createMany({
    data: [
      {
        name: 'Escritorio Compartido Hot Desk 01',
        description: 'Puesto individual flexible en área compartida con conexión de alta velocidad y café ilimitado.',
        type: SpaceType.DESK,
        pricePerHour: 15.0,
        imageUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80',
        isActive: true,
      },
      {
        name: 'Sala de Reuniones Ejecutiva Alpha',
        description: 'Capacidad para 8 personas con pantalla 4K interactiva y mesa para conferencias.',
        type: SpaceType.MEETING_ROOM,
        pricePerHour: 45.0,
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        isActive: true,
      },
      {
        name: 'Cabina Telefónica Focus Box A',
        description: 'Espacio acústicamente insonorizado para llamadas privadas y máxima concentración.',
        type: SpaceType.BOOTH,
        pricePerHour: 20.0,
        imageUrl: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&q=80',
        isActive: true,
      },
    ],
  });

  console.log('Seed ejecutado con éxito: Admin y Espacios listos.');
}

main()
  .catch((error: Error) => {
    console.error('Error al ejecutar el seed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });