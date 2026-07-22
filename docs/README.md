# E-Commerce NestJS Backend

This directory documents the current NestJS/MongoDB e-commerce API. The application exposes a versioned REST API, Swagger UI, and a code-first GraphQL API with Product and Coupon operations.

## Documentation map

- [Architecture](Architecture.md) — application layers, request flow, and conventions.
- [API](API.md) — REST endpoints.
- [GraphQL](GraphQL.md) — schema access and Product CRUD operations.
- [Database](Database.md) — MongoDB collections, indexes, and references.
- [Authentication](Authentication.md) — registration, JWTs, and roles.
- [Modules](Modules.md) — responsibilities and providers for every module.
- [Deployment](Deployment.md) — configuration, build, and production notes.

## Local endpoints

- REST API: `http://localhost:5000/v1`
- Swagger UI: `http://localhost:5000/docs`
- GraphQL: `http://localhost:5000/graphql`

The port defaults to `5000`; set `PORT` to change it. See [Socket](Socket.md) for the authenticated Socket.IO architecture and event reference.
