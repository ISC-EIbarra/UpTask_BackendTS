import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController';
import { handleInputErrors } from '../middleware/validation';
import { TaskController } from '../controllers/TaskController';
import { ProjectExists } from '../middleware/project';
import { TaskBelongsToProject, TaskExists } from '../middleware/task';

const router = Router();

router.post(
  '/',
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  handleInputErrors,
  ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
  '/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  ProjectController.getProjectById
);

router.put(
  '/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  body('projectName')
    .notEmpty()
    .withMessage('El nombre del proyecto es obligatorio'),
  body('clientName')
    .notEmpty()
    .withMessage('El nombre del cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  handleInputErrors,
  ProjectController.updateProject
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  ProjectController.deleteProject
);

/* Routes for Tasks */
router.param('projectId', ProjectExists);

router.post(
  '/:projectId/tasks',
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obligatoria'),
  handleInputErrors,
  TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

router.param('taskId', TaskExists);
router.param('taskId', TaskBelongsToProject);

router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  TaskController.getTaskById
);

router.put(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción de la tarea es obligatoria'),
  handleInputErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  handleInputErrors,
  TaskController.deleteTask
);

router.post(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('ID no válido'),
  body('status').notEmpty().withMessage('El status es obligatorio'),
  handleInputErrors,
  TaskController.updateStatus
);

export default router;
