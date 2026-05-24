import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { WithdrawSchema } from './withdraw.schema';
import { withdrawHandler } from './withdraw.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Withdraw
 *   description: Wallet withdrawals
 */

/**
 * @swagger
 * /api/withdraw:
 *   post:
 *     summary: Withdraw funds from the authenticated user's wallet
 *     tags: [Withdraw]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 200.00
 *     responses:
 *       200:
 *         description: Withdrawal successful
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
 *                         balance:
 *                           type: number
 *                           example: 300.00
 *                         transaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             type:
 *                               type: string
 *                               example: WITHDRAWAL
 *                             amount:
 *                               type: number
 *                               example: 200.00
 *                             reference:
 *                               type: string
 *                               example: WDR-A1B2C3D4-...
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *       400:
 *         description: Insufficient balance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validate(WithdrawSchema), withdrawHandler);

export default router;
