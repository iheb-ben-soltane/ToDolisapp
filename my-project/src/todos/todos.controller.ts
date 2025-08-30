import {Controller, Get, Post, Patch, Delete,Body,Param, Query,} from '@nestjs/common';
import { ApiTags, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TodosService } from './todos.service';

@Controller('todos')
@ApiTags('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  // ✅ Créer une tâche
  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Apprendre NestJS' },
        description: { type: 'string', example: 'Suivre le tuto Todo List' },
        date: { type: 'string', format: 'date', example: '2025-08-17' },
      },
      required: ['title'],
    },
  })
  @ApiResponse({ status: 201, description: 'La tâche a été créée.' })
  create(@Body() body: { title: string; description?: string; date?: string }) {
    return this.todosService.create(body);
  }

  // ✅ Récupérer toutes les tâches (optionnellement par date)
  @Get()
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Date au format YYYY-MM-DD (par défaut J+1)',
    example: '2025-08-17',
  })
  @ApiResponse({ status: 200, description: 'Liste des tâches.' })
  findAll(@Query('date') date?: string) {
    return this.todosService.findAll(date);
  }

  // ✅ Récupérer une tâche par ID
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Identifiant de la tâche', example: 1 })
  @ApiResponse({ status: 200, description: 'La tâche demandée.' })
  @ApiResponse({ status: 404, description: 'Tâche introuvable.' })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(+id);
  }

  // ✅ Mettre à jour une tâche
  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Identifiant de la tâche', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', example: 'Titre mis à jour' },
        description: { type: 'string', example: 'Nouvelle description' },
        done: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'La tâche mise à jour.' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.todosService.update(+id, body);
  }

  // ✅ Supprimer une tâche
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Identifiant de la tâche', example: 1 })
  @ApiResponse({ status: 200, description: 'Tâche supprimée avec succès.' })
  remove(@Param('id') id: string) {
    return this.todosService.remove(+id);
  }
}
