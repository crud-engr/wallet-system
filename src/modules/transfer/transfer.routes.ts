import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validate } from '@/middleware/validate';
import { TransferSchema } from './transfer.schema';
import { transferHandler } from './transfer.controller';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Transfer
 *   description: Funds transfer between users
 */

/**
 * @swagger
 * /api/transfer:
 *   post:
 *     summary: Transfer funds to another user
 *     tags: [Transfer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipient_email, amount]
 *             properties:
 *               recipient_email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               amount:
 *                 type: number
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Transfer successful
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
 *                           example: 500.00
 *                         transaction:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             type:
 *                               type: string
 *                               example: TRANSFER
 *                             amount:
 *                               type: number
 *                               example: 500.00
 *                             reference:
 *                               type: string
 *                               example: TRF-A1B2C3D4-...
 *                             recipient:
 *                               type: object
 *                               properties:
 *                                 name:
 *                                   type: string
 *                                 email:
 *                                   type: string
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *       400:
 *         description: Insufficient balance or self-transfer attempt
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
 *       404:
 *         description: Recipient not found
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
router.post('/', validate(TransferSchema), transferHandler);

export default router;
