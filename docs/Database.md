# Database

## Connection

Mongoose connects from `DB_URI`, defaulting to `mongodb://127.0.0.1:27017/nest-ecommerce`. Every active schema uses MongoDB timestamps (`createdAt`, `updatedAt`).

## Collections and relationships

| Collection | Important fields | References and constraints |
| --- | --- | --- |
| `users` | name, email, password, role, isDeleted | `email` is unique; password is excluded by default; soft deletion. |
| `categories` | name, slug, image | Unique name and slug; text index on name/slug. |
| `brands` | name, slug, logo | Unique name and slug; text index on name/slug. |
| `products` | title, slug, pricing, stock, images, ratings, isDeleted | References Category, Brand, and User (`createdBy`); text index on title/description; soft deletion. |
| `reviews` | rating, comment | References User and Product; compound unique index `(user, product)`. |
| `carts` | products, quantity, totalPrice | One cart is looked up per user; references User and Product array. |
| `orders` | products, address, payment/status, totals | References User and Product array; created from and clears the user's cart. |
| `coupons` | code, amount, isPercentage, expires | Unique uppercased code; validation rejects expired coupons. |

Product reads populate category, brand, and creator. Cart/order/review schemas declare references but their current services do not populate them.

## Integrity behaviors

- Category, brand, and product slugs are derived from names/titles.
- Product `finalPrice` is calculated in a schema `pre('save')` hook. The current `findByIdAndUpdate` update path does not run that hook.
- A review is limited to one per user/product by both service check and unique index.
- Product and user deletions are soft; category and brand deletions are physical.
- Cart products are append-only in the present implementation; repeated additions add another product ID and increase aggregate quantity/price.
