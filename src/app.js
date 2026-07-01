const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const voterRoutes = require('./routes/voter.routes');
const candidateRoutes = require('./routes/candidate.routes');
const voteRoutes = require('./routes/vote.routes');
const authRoutes = require('./routes/auth.routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API de Votaciones en funcionamiento.',
    docs: '/api-docs',
  });
});

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/voters', voterRoutes);
app.use('/candidates', candidateRoutes);
app.use('/votes', voteRoutes);

// 404 y manejador de errores (deben ir al final)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
