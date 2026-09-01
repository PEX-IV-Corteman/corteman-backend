import assert from "node:assert";
import test from "node:test";
import { createRetiradaSchema, retiradaIdParamSchema } from "../../../src/schemas/retirada-schema.js";


const validRetiradaId = "550e8400-e29b-41d4-a716-446655440000" as const;

const validRetirada = {
    valor_retirada: 500,
    destino: "EMPRESA",
    justificativa: "Troca do bebedouro"
} as const;



test("Should accept a valid retirada's id", () => {

    const result = retiradaIdParamSchema.safeParse({ id: "invalid-id" });

    assert.strictEqual(result.success, false);

});

test("Should accept a valid retirada's id", () => {

    const result = retiradaIdParamSchema.safeParse({ id: validRetiradaId });

    assert.strictEqual(result.success, true);

});

test("Should accept a valid retirada object", () => {

    const result = createRetiradaSchema.safeParse(validRetirada);

    assert.strictEqual(result.success, true);

});

test("Should reject a retirada object with no 'valor_retirada'", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        valor_retirada: ""
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a retirada object whose 'valor_retirada' is a negative number", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        valor_retirada: -500
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a retirada object whose 'valor_retirada' has more than two decimal places", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        valor_retirada: 500.99999
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a retirada objec whose 'valor_retirada' is greater than DECIMAL(10, 2)", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        valor_retirada: 100_000_000
    });

    assert.strictEqual(result.success, false);

});
