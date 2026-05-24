import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { globalErrorHandler } from '@/middleware/error';
import { swaggerSpec } from '@/config/swagger';
import authRoutes from '@/modules/auth/auth.routes';
import walletRoutes from '@/modules/wallet/wallet.routes';
import transferRoutes from '@/modules/transfer/transfer.routes';

const app = express();

// Parse incoming JSON bodies — required for all API endpoints
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Wallet system is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/transfer', transferRoutes);

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Must be registered AFTER all routes — Express identifies error handlers by
// their 4-parameter signature (err, req, res, next).
app.use(globalErrorHandler);

export default app;
