import assert from "node:assert";
import { test } from "node:test";
import {
    createServicoSchema,
    listServicosQuerySchema,
    servicoIdParamsSchema,
    updateServicoSchema
} from "../../../src/schemas/servico-schema.js";

test("Should accept a valid 'servico' object", () => {
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

test("Should accept updating only one service field", () => {
    const result = updateServicoSchema.safeParse({
        nome_servico: "  Corte e barba  "
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.data?.nome_servico, "Corte e barba");
});

test("Should reject an empty service update", () => {
    const result = updateServicoSchema.safeParse({});

    assert.strictEqual(result.success, false);
});

test("Should apply the monetary rules to a service update", () => {
    const result = updateServicoSchema.safeParse({
        valor_servico: 45.999
    });

    assert.strictEqual(result.success, false);
});

test("Should reject an invalid service id", () => {
    const result = servicoIdParamsSchema.safeParse({ id: "invalid-id" });

    assert.strictEqual(result.success, false);
});

test("Should accept an empty service list query", () => {
    const result = listServicosQuerySchema.safeParse({});

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, {});
});

test("Should sanitize and transform service list filters", () => {
    const result = listServicosQuerySchema.safeParse({
        nome_servico: "  Corte  ",
        valor_max: "50.90"
    });

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, {
        nome_servico: "Corte",
        valor_max: 50.9
    });
});

test("Should reject a non-numeric maximum service value", () => {
    const result = listServicosQuerySchema.safeParse({ valor_max: "abc" });

    assert.strictEqual(result.success, false);
});

test("Should reject unknown service list filters", () => {
    const result = listServicosQuerySchema.safeParse({ ativo: "true" });

    assert.strictEqual(result.success, false);
});
