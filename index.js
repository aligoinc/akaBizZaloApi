import express from 'express';
import indexRouter from './routes/index.js';
import { swaggerUi, swaggerSpec } from './swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Sử dụng routes
app.use('/', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
