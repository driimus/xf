# @driimus/xf

Composable object transformers with full type inference.

## Installation

```sh
pnpm add @driimus/xf
```

## Usage

### Compose property transformers using `define`

```ts
import { type PropertyTransformer, xf } from '@driimus/xf';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  type?: 'admin' | 'user';
};

const transformer = xf.define(
  {
    fullName(user) { return `${user.firstName} ${user.lastName}`; },
  } satisfies PropertyTransformer<User>,
  {
    type(user) { return user.type ?? 'user'; },
  } satisfies PropertyTransformer<User>,
);
```

### Compute transformed properties using `apply`

```ts
import { type PropertyTransformer, xf } from '@driimus/xf';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  type?: 'admin' | 'user';
};

const data: User = { id: '1', firstName: 'Adam', lastName: 'Jones' };

const out = xf.apply(
  {
    fullName(user) { return `${user.firstName} ${user.lastName}`; },
  },
  data
); // { fullName: 'Adam Jones' }
```

### Nested transforms

There is no dedicated construct for nested transformations.
Instead, implementers should explicitly instruct how to transform properties which correspond to another data model: 

```ts
import { type PropertyTransformer, xf } from "@driimus/xf";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  type?: "admin" | "user";
  address?: Address;
  posts: Post[];
};

type Address = {
  street: string;
  city: string;
  country: string;
};

type Post = {
  id: string;
  text: string;
};

const PostOutput = xf.define({
  text(post) {
    return post.text;
  },
} satisfies PropertyTransformer<Post>);

const AddressOutput = xf.define({
  fullAddress(address) {
    return [address.street, address.city, address.country].join(", ");
  },
} satisfies PropertyTransformer<Address>);

const UserOutput = xf.define({
  fullName(user) {
    return `${user.firstName} ${user.lastName}`;
  },
  address(user) {
    if (user.address) return xf.apply(AddressOutput, user.address).fullAddress;
  },
  posts(user) {
    return user.posts.map((post) => xf.apply(PostOutput, post));
  },
} satisfies PropertyTransformer<User>);

xf.apply(UserOutput, {
  id: "1",
  firstName: "Adam",
  lastName: "Jones",
  address: {
    street: "123 Main St",
    city: "Los Angeles",
    country: "USA",
  },
  posts: [
    { id: "1", text: "Spiral out" },
    { id: "2", text: "Keep going" },
  ],
}); // { fullName: 'Adam Jones', address: '123 Main St, Los Angeles, USA', posts: [{ text: 'Spiral out' }, { text: 'Keep going' }] }
```
