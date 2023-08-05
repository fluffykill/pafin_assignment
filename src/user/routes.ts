import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from './controller';
import { authenticateToken } from '../../authentication';

const router = Router();

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export {
  router as UserRouter
};