import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollController from './app/controllers/EnrollController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerOrderController from './app/controllers/AnswerOrderController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rotas

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.get('/students/:id/help-orders', HelpOrderController.index);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

routes.post('/enrollments', EnrollController.store);
routes.get('/enrollments', EnrollController.index);
routes.put('/enrollments', EnrollController.update);
routes.delete('/enrollments/:id', EnrollController.destroy);

routes.post('/students/:id/checkin', CheckinController.store);
routes.get('/students/:id/checkin', CheckinController.index);

routes.post('/help-orders/:_id/answer', AnswerOrderController.store);
routes.get('/help-orders', AnswerOrderController.index);

export default routes;
