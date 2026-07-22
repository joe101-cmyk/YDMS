# Deployment

## Required configuration

The application loads `config/.env` through `ConfigModule`. Set at least:

```dotenv
PORT=5000
DB_URI=mongodb://user:password@host:27017/nest-ecommerce
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
```

`REDIS_URL` is present in `appConfig` but no active module uses it. Uploads are written to the local `./uploads` directory, so production needs a writable persistent volume or an external object-storage replacement.

## Commands

```bash
npm ci
npm run build
npm run start:prod
```

For development, use `npm run start:dev`. Test commands are `npm test` and `npm run test:e2e`.

## Production checklist

- Use a managed MongoDB deployment, restricted database credentials, and backups.
- Set all secrets explicitly; do not use the development fallback JWT secret.
- Terminate TLS at the application or trusted proxy and configure CORS for actual frontend origins.
- Keep `/docs` and `/graphql` exposure deliberate; apply network/auth controls appropriate to the environment.
- Run the generated `dist/main` process behind a supervisor/container health policy.
- Persist uploaded files or migrate uploads to object storage before horizontal scaling.
