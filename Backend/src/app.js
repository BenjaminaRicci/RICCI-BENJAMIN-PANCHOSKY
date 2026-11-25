import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());
// Express 5 deja req.body sin definir cuando la petición no trae cuerpo.
app.use((req, res, next) => {
    req.body ??= {};
    next();
});
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
