// utils/config.js

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
    storage: process.env.STORAGE,
  },
  jwt: {
    accessToken: process.env.ACCESS_TOKEN_KEY,
    refreshToken: process.env.REFRESH_TOKEN_KEY,
    maxAgeSec: process.env.ACCESS_TOKEN_AGE,
  },
  s3: {
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  storage: {
    s3: 's3',
    local: 'local',
  },
};

module.exports = config;
