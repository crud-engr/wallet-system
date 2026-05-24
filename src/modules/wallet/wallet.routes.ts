import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { FundSchema } from './wallet.schema';
import { fundWalletHandler } from './wallet.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Wallet
 *   description: Wallet management
 */

/**
 * @swagger
 * /api/wallet/fund:
 *   post:
 *     summary: Top up the authenticated user's wallet
 *     tags: [Wallet]
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
 *                 example: 100.00
 *     responses:
 *       200:
 *         description: Wallet funded successfully
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
 *                           example: 150.00
 *                         transaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             type:
 *                               type: string
 *                               example: FUND
 *                             amount:
 *                               type: number
 *                               example: 100.00
 *                             reference:
 *                               type: string
 *                             createdAt:
 *                               type: string
 *                               format: date-time
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
router.post('/fund', validate(FundSchema), fundWalletHandler);

export default router;
