import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  // Créer une nouvelle tâche
  async create(data: { title: string; description?: string; date?: string }): Promise<Todo> {
    const dateValue = data.date ? new Date(data.date) : new Date(Date.now() + 24 * 60 * 60 * 1000); // J+1
    return this.prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        date: dateValue,
      },
    });
  }

  // Récupérer toutes les tâches pour un jour donné
  async findAll(date?: string): Promise<Todo[]> {
    const dateValue = date ? new Date(date) : new Date(Date.now() + 24 * 60 * 60 * 1000); // J+1
    const startOfDay = new Date(dateValue);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateValue);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.todo.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  // Récupérer une tâche par id
  async findOne(id: number): Promise<Todo | null> {
    return this.prisma.todo.findUnique({ where: { id } });
  }

  // Mettre à jour une tâche
  async update(id: number, data: { title?: string; description?: string; done?: boolean }): Promise<Todo> {
    return this.prisma.todo.update({ where: { id }, data });
  }

  // Supprimer une tâche
  async remove(id: number): Promise<{ message: string }> {
    await this.prisma.todo.delete({ where: { id } });
    return { message: `Todo ${id} supprimé` };
  }
}
