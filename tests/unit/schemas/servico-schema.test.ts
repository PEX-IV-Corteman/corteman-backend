import assert from "node:assert";
import { test } from "node:test";
import { createServicoSchema } from "../../../src/schemas/servico-schema.js";

test("Should accept a valid service value", () => {
    const result = createServicoSchema.safeParse({
        nome_servico: "Corte masculino",
        valor_servico: 45.9
    });

    assert.strictEqual(result.success, true);
});

test("Should reject a service value with more than two decimal places", () => {
    const result = createServicoSchema.safeParse({
        nome_servico: "Corte masculino",
        valor_servico: 0.001
    });

    assert.strictEqual(result.success, false);
});

test("Should reject a service value greater than DECIMAL(10,2)", () => {
    const result = createServicoSchema.safeParse({
        nome_servico: "Corte masculino",
        valor_servico: 100_000_000
    });

    assert.strictEqual(result.success, false);
});
