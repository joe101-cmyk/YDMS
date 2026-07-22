# Authentication and authorization

Registration delegates to `UsersService`, which rejects duplicate email addresses, hashes passwords using bcrypt with 10 rounds, and defaults the role to `user`. Login fetches the normally hidden password, verifies it with bcrypt, and returns a JWT with `sub`, `email`, and `role` claims.

JWT configuration comes from `JWT_SECRET` and `JWT_EXPIRES_IN` (default `7d`). `JwtStrategy` reads a bearer token, validates expiry/signature, loads the user by `sub`, and makes `{ id, email, role }` available on the request.

`JwtAuthGuard` protects REST routes and obtains the request correctly for GraphQL resolver contexts. `RolesGuard` reads roles supplied by `@Roles(...)`; product/category/brand/coupon/user mutations are admin-only. `@CurrentUser()` is the REST parameter decorator used by `/users/me`.

The fallback JWT secret is suitable only for development. Production must set a long, unique `JWT_SECRET` and use TLS so bearer tokens are not exposed in transit.
