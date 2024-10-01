# xf

Per-property object transformation

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
