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
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of transactions per page
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
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               amount:
 *                                 type: number
 *                                 example: 500.00
 *                               type:
 *                                 type: string
 *                                 enum: [FUND, TRANSFER, WITHDRAWAL]
 *                               status:
 *                                 type: string
 *                                 enum: [PENDING, SUCCESS, FAILED]
 *                               reference:
 *                                 type: string
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getTransactionsHandler);

export default router;
