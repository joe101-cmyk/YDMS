# Modules

| Module | Controllers / resolvers | Providers | Responsibility |
| --- | --- | --- | --- |
| App | `AppController` | `AppService` | Root composition and sample root routes. |
| Auth | `AuthController` | `AuthService`, `JwtStrategy` | Registration/login and JWT configuration. |
| Users | `UsersController` | `UsersService` | User creation, profile lookup, and soft deletion. |
| Category | `CategoryController` | `CategoryService` | Category CRUD and slugs. |
| Brand | `BrandController` | `BrandService` | Brand CRUD and slugs. |
| Product | `ProductController`, `ProductResolver` | `ProductService` | Product CRUD, active-product filtering, references, and GraphQL CRUD. |
| Review | `ReviewController` | `ReviewService` | One review per user/product. |
| Cart | `CartController` | `CartService` | Per-user product cart aggregates. |
| Order | `OrderController` | `OrderService` | Checkout from a cart and cart clearing. |
| Coupon | `CouponController`, `CouponResolver` | `CouponService` | Coupon creation, listing through GraphQL, and expiry validation. |
| Uploads | `UploadsController` | None | Disk-backed image upload handling. |
| Mail | None | `MailService` | Placeholder module/service. |

Feature modules register their own Mongoose schemas via `MongooseModule.forFeature`. Users, Category, Brand, Product, and Coupon export their services; other feature services are currently module-private. Review, Cart, and Order each register the additional schemas their service queries.

The `common` folder is not a Nest module; it contains reusable configuration, guards, decorators, interceptors, filters, types, pipes, and utilities.
