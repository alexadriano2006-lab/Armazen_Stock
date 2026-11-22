import express from 'express';
import { errorMiddleware } from "./shared/midllewares/error.middleware.js";
import userRoute from './modules/users/users.routes.js'

const app = express()

app.use(express.json())

app.get('/health', (_req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'API ON',
  });
});


app.use('/users', userRoute)

app.use(errorMiddleware);

export default app;