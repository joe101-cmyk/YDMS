export const appConfig = {
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'super-secret-key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mongodbUri: process.env.DB_URI || 'mongodb://127.0.0.1:27017/nest-ecommerce',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
