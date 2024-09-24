import { randomInt, randomUUID } from "node:crypto";
import { describe, expectTypeOf, it } from "vitest";
import { xf } from "../src/index.js";

describe("xf", async () => {
  describe("#define", () => {
    it("should combine inputs into a new transformer", () => {
      type Input = Record<
        string,
        (obj: {
          name: string;
          age: number;
        }) => unknown
      >;

      const a = {
        id() {
          return "1";
        },
      } satisfies Input;
      const b = {
        parent(obj) {
          return { id: obj.name };
        },
      } satisfies Input;

      const transformer = xf.define(a, b);

      expectTypeOf(transformer).toMatchTypeOf(a);
      expectTypeOf(transformer).toMatchTypeOf(b);
    });
  });

  describe("#apply", () => {
    it("should transform the input object", () => {
      const obj = {
        firstName: "C",
        lastName: "P",
        id: randomUUID(),
        age: randomInt(100),
      };

      const out = xf.apply(
        {
          doubleAge(obj) {
            return obj.age * 2;
          },
          fullName(obj) {
            return [obj.firstName, obj.lastName].join(" ");
          },
        },
        obj,
      );

      expectTypeOf(out).toEqualTypeOf<{ doubleAge: number; fullName: string }>();
    });
  });
});
