const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const familyRoutes = require('./src/routes/familyRoutes');
const seedDatabase = require('./src/utils/seed');

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Vue.js default development server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api/auth', authRoutes);
app.use('/api', familyRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ force: true }).then(async () => {
  console.log('Database synced');
  await seedDatabase();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
