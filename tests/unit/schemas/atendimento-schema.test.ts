import assert from "node:assert";
import { test } from "node:test";
import { createAtendimentoSchema, atendimentoIdParamSchema } from "../../../src/schemas/atendimento-schema.js";

const validAtendimento = {
    servico_id: "550e8400-e29b-41d4-a716-446655440000",
    valor_atendimento: 9.99,
    metodo_pagamento: "PIX",
} as const;

test("Should reject a invalid atendimento's id", () => {

    const result = atendimentoIdParamSchema.safeParse({ id: "invalid-id" });

    assert.strictEqual(result.success, false);

});

test("Should accept a valid 'atendimento' object", (t) => {

    const result = createAtendimentoSchema.safeParse({...validAtendimento});

    assert.strictEqual(result.success, true);

});

test("Should reject an 'atendimento's object with invalid 'servico's id", () => {

    const result = createAtendimentoSchema.safeParse(
        {
            ...validAtendimento,
            servico_id: "invalid-id"
        }
    );

    assert.strictEqual(result.success, false);

});

test("Should reject an 'atendimento's object with a negative 'atendimento's price", () => {

    const result = createAtendimentoSchema.safeParse({
        ...validAtendimento,
        valor_atendimento: -9.99
    });

    assert.strictEqual(result.success, false);

});
