import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { getTransactionsHandler } from './transaction.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction history
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get the authenticated user's transaction history
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           amount:
 *                             type: number
 *                             example: 500.00
 *                           type:
 *                             type: string
 *                             enum: [FUND, TRANSFER, WITHDRAWAL]
 *                           status:
 *                             type: string
 *                             enum: [PENDING, SUCCESS, FAILED]
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getTransactionsHandler);

export default router;
