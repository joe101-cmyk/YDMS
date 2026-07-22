# Architecture

## Overview

The application is a modular NestJS e-commerce backend. `AppModule` loads configuration, an asynchronous Mongoose connection, Apollo GraphQL (code-first), and feature modules. MongoDB is the sole active persistence layer; the legacy `src/DB`, `src/DTO`, `src/security`, and `src/enum` files are not imported by the active module graph.

## Request flow

```text
HTTP / GraphQL request
  -> Nest global middleware and validation
  -> JWT and role guards (where applied)
  -> controller or resolver
  -> feature service
  -> injected Mongoose model
  -> MongoDB
```

REST requests pass through the global logging and response interceptors, producing `{ success, message, data }`. The global exception filter returns `{ success: false, message, data: null }`. GraphQL bypasses those REST envelopes so resolver return values match the schema.

## Application composition

`AppModule` imports `ConfigModule` globally, connects through `MongooseModule.forRootAsync`, enables Apollo with `autoSchemaFile: src/schema.gql`, and registers Auth, Users, Category, Brand, Product, Review, Cart, Coupon, Order, Uploads, and Mail.

`main.ts` enables URI versioning (default `v1`), CORS, Helmet, compression, global validation (`whitelist`, `forbidNonWhitelisted`, `transform`), exception handling, logging, response transformation, and Swagger.

## Layers and conventions

- **Controllers** define REST routes, Swagger tags/operations, and access guards.
- **Resolvers** define GraphQL queries/mutations and call the same services as REST.
- **Services** own business rules, duplicate checks, slugs, soft deletion, and persistence calls.
- **Schemas** are Mongoose class schemas decorated with `@Schema` and `@Prop`.
- **DTOs** use `class-validator`; update DTOs use `PartialType`.
- **Providers** are class-based `@Injectable()` services and guards, injected through their feature module.

Formatting follows Prettier with single quotes and trailing commas. The codebase favors explicit imports, async service methods, Nest exception classes, and constructor injection. Some legacy files use a different double-quoted style and are not active.

## Current implementation notes

- `AppController` also defines unguarded `/products` and `/products/:id` sample routes, which duplicate the Product controller paths. These legacy routes should be removed or renamed in a future cleanup to avoid route-order ambiguity.
- Deleting a category or brand does not currently check for referenced products.
- Swagger discovers operations and security metadata, but most DTO fields do not yet have Swagger property decorators; detailed request schemas can be added later without changing runtime validation.

## GraphQL architecture

Apollo is configured code-first. Product and Coupon GraphQL object/input types live within their feature modules, with resolvers delegating to the corresponding services. `ProductResolver` provides its CRUD operations; `CouponResolver` provides authenticated coupon listing and admin coupon creation. The Coupon input inherits the REST DTO validation metadata, so GraphQL and REST apply the same coupon validation rules.
