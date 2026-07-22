# GraphQL

Apollo GraphQL is exposed at `/graphql`. The schema is generated from TypeScript decorators at startup and written to `src/schema.gql` (a generated artifact, not a source file to edit).

## Product CRUD

| Operation | Kind | Access | Arguments |
| --- | --- | --- | --- |
| `findAllProducts` | Query | Authenticated | None |
| `findProductById` | Query | Authenticated | `id: ID!` |
| `createProduct` | Mutation | Admin | `input: CreateProductInput!` |
| `updateProduct` | Mutation | Admin | `id: ID!`, `input: UpdateProductInput!` |
| `deleteProduct` | Mutation | Admin | `id: ID!` |

`CreateProductInput` requires `title`, `price`, `category`, and `brand`; it accepts optional description, discount, stock, images, and creator ID. `UpdateProductInput` makes all writable fields optional. Product results expose identifiers, pricing fields, inventory, image URLs, category/brand/creator identifiers, rating aggregates, and `isDeleted`.

Example query:

```graphql
query {
  findAllProducts {
    id
    title
    finalPrice
    category
    brand
  }
}
```

Send `Authorization: Bearer <token>` with GraphQL requests. The resolver uses the same JWT and role guards as the REST controller; only admins can create, update, or delete. Delete returns `true` after the existing Product service performs its soft delete.

## Coupon operations

| Operation | Kind | Access | Arguments |
| --- | --- | --- | --- |
| `findAllCoupons` | Query | Authenticated | None |
| `createCoupon` | Mutation | Admin | `input: CreateCouponInput!` |

`CreateCouponInput` reuses the validation rules from `CreateCouponDto`: a non-empty code, non-negative amount, optional percentage flag, ISO date expiry, and optional creator ID. Coupon results expose `id`, `code`, `amount`, `isPercentage`, `expires`, and `createdBy`.

Example query:

```graphql
query {
  findAllCoupons {
    id
    code
    amount
    expires
  }
}
```

Example mutation:

```graphql
mutation {
  createCoupon(
    input: {
      code: "SUMMER25"
      amount: 25
      expires: "2027-01-01"
    }
  ) {
    id
    code
  }
}
```
