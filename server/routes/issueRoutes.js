// Issue routes — /api/issues

import express from 'express';
import { getIssues, createIssue, returnBook } from '../controllers/issueController.js';

const router = express.Router();

router.get('/', getIssues);
router.post('/', createIssue);
router.put('/:id/return', returnBook);

export default router;
