import express from 'express';
import cors from 'cors';
import indexRouter from './routes/index.js';
import { swaggerUi, swaggerSpec } from './swagger.js';
import akaBizRunningService from './services/akaBizRunningService.js';

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Sử dụng routes
app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  akaBizRunningService.start();
});
