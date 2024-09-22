import { randomInt, randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { xf } from "./index.js";

describe("xf", async () => {
  describe("#define", () => {
    it("should combine inputs into a new transformer", () => {
      type TransformInput = {
        name: string;
        age: number;
      };
      
      type Input = Record<
      string,
      (obj: TransformInput) => unknown
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
      
      expect(Object.getOwnPropertyNames(a)).toStrictEqual(["id"]);
      expect(Object.getOwnPropertyNames(b)).toStrictEqual(["parent"]);
      expect(Object.getOwnPropertyNames(transformer)).toStrictEqual(["id", "parent"]);
    });
  });
  
  describe("#toObject", () => {
    it("should transform the input object", () => {
      const obj = {
        firstName: "C",
        lastName: "P",
        id: randomUUID(),
        age: randomInt(100),
      };
      
      const out = xf.toObject(
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
      
      expect(out).toStrictEqual({
        doubleAge: obj.age * 2,
        fullName: `${obj.firstName} ${obj.lastName}`,
      });
    });
  });
});
