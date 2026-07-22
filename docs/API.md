# REST API

All routes use the URI version prefix `/v1` and return the global success envelope. Routes marked **admin** require `Authorization: Bearer <token>` for a user with role `admin`; routes marked **authenticated** require a valid bearer token.

| Area | Method and path | Access | Purpose |
| --- | --- | --- | --- |
| App | `GET /` | Public | Health-style hello response. |
| Auth | `POST /auth/register` | Public | Register and receive a JWT. |
| Auth | `POST /auth/login` | Public | Authenticate and receive a JWT. |
| Users | `POST /users` | Admin | Create a user. |
| Users | `GET /users/me` | Authenticated | Current profile. |
| Users | `DELETE /users/:id` | Admin | Soft-delete a user. |
| Categories | `POST /categories` | Admin | Create category. |
| Categories | `GET /categories` | Authenticated | List categories. |
| Categories | `GET /categories/:id` | Authenticated | Read category. |
| Categories | `PUT /categories/:id` | Admin | Update category. |
| Categories | `DELETE /categories/:id` | Admin | Delete category. |
| Brands | `POST /brands` | Admin | Create brand. |
| Brands | `GET /brands` | Authenticated | List brands. |
| Brands | `GET /brands/:id` | Authenticated | Read brand. |
| Brands | `PUT /brands/:id` | Admin | Update brand. |
| Brands | `DELETE /brands/:id` | Admin | Delete brand. |
| Products | `POST /products` | Admin | Create product. |
| Products | `GET /products` | Authenticated | List active products. |
| Products | `GET /products/:id` | Authenticated | Read an active product. |
| Products | `PUT /products/:id` | Admin | Update product. |
| Products | `DELETE /products/:id` | Admin | Soft-delete product. |
| Reviews | `POST /reviews` | Authenticated | Create one review per user/product. |
| Cart | `POST /cart` | Authenticated | Add a product and quantity to caller's cart. |
| Orders | `POST /orders` | Authenticated | Create order from caller's cart. |
| Coupons | `POST /coupons` | Admin | Create coupon. |
| Coupons | `POST /coupons/validate` | Authenticated | Validate non-expired code. |
| Uploads | `POST /uploads/single` | Public* | Upload image field `file`. |
| Uploads | `POST /uploads/multiple` | Public* | Upload up to ten images field `files`. |

`*` Upload routes advertise bearer auth in Swagger but do not currently apply `JwtAuthGuard`.

Swagger UI at `/docs` contains the generated operation list and retains an entered bearer token between page refreshes.

## GraphQL coupon operations

The GraphQL endpoint also exposes authenticated `findAllCoupons` and admin-only `createCoupon`. Their input and result fields, plus request examples, are documented in [GraphQL.md](GraphQL.md). The existing REST coupon endpoints remain unchanged.
