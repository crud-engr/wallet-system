import express from 'express';
import { globalErrorHandler } from '@/middleware/error';

const app = express();

// Parse incoming JSON bodies — required for all API endpoints
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Wallet system is running' });
});

// import authRoutes from "@/routes/auth";
// import walletRoutes from "@/routes/wallet";
// import transactionRoutes from "@/routes/transaction";
//
// app.use("/api/auth", authRoutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/transactions", transactionRoutes);

// Must be registered AFTER all routes — Express identifies error handlers by
// their 4-parameter signature (err, req, res, next).
app.use(globalErrorHandler);

export default app;
