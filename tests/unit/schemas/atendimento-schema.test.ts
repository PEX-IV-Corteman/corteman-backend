import assert from "node:assert";
import { test } from "node:test";
import {
    createAtendimentoSchema,
    atendimentoIdParamSchema,
    listAtendimentosQuerySchema,
    updateAtendimentoSchema
} from "../../../src/schemas/atendimento-schema.js";

const validAtendimento = {
    servico_id: "550e8400-e29b-41d4-a716-446655440000",
    valor_atendimento: 9.99,
    metodo_pagamento: "PIX",
} as const;

const validAtendimentoQueryParams = {
    data_limite: "2026-12-25",
    valor_atendimento: 9.99,
    metodo_pagamento: "PIX",

} as const;

const validAtendimentoUpdateParams = {
    servico_id: "550e8400-e29b-41d4-a716-446655440001",
    valor_atendimento: 10.00,
    metodo_pagamento: "CARTAO"
} as const;

test("Should reject a invalid atendimento's id", () => {

    const result = atendimentoIdParamSchema.safeParse({ id: "invalid-id" });

    assert.strictEqual(result.success, false);

});

test("Should accept a valid 'atendimento' object", (t) => {

    const result = createAtendimentoSchema.safeParse({ ...validAtendimento });

    assert.strictEqual(result.success, true);

});

test("Should reject an atendimento's object with invalid 'servico's id", () => {

    const result = createAtendimentoSchema.safeParse(
        {
            ...validAtendimento,
            servico_id: "invalid-id"
        }
    );

    assert.strictEqual(result.success, false);

});

test("Should reject an atendimento's object with a negative 'atendimento's price", () => {

    const result = createAtendimentoSchema.safeParse({
        ...validAtendimento,
        valor_atendimento: -9.99
    });

    assert.strictEqual(result.success, false);

});

test("Should reject an atendimento's object with a payment method different than 'PIX', 'CARTAO' or 'DINHEIRO'", () => {

    const result = createAtendimentoSchema.safeParse({
        ...validAtendimento,
        metodo_pagamento: 'BOLETO'
    });

    assert.strictEqual(result.success, false);

});

test("Should accept a empty atendimento's query object", () => {

    const result = listAtendimentosQuerySchema.safeParse({});

    assert.strictEqual(result.success, true);

});

test("Should sanitize and transform atendimento's query params", () => {

    const result = listAtendimentosQuerySchema.safeParse({
        data_limite: " 2026-12-25   ",
        valor_max: "9.99 ",
        metodo_pagamento: "   dINHEiRo  "
    });

    assert.strictEqual(result.success, true);

    assert.deepStrictEqual(result.data, {
        data_limite: "2026-12-25",
        valor_max: 9.99,
        metodo_pagamento: "DINHEIRO"
    });

});

test("Should reject a non numeric max value for query", () => {

    const result = listAtendimentosQuerySchema.safeParse({
        ...validAtendimentoQueryParams,
        valor_max: "-9.99"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a invalid payment method for query", () => {

    const result = listAtendimentosQuerySchema.safeParse({
        ...validAtendimentoQueryParams,
        metodo_pagamento: "BOLETO"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a invalid date value for query", () => {

    const result = listAtendimentosQuerySchema.safeParse({
        ...validAtendimentoQueryParams,
        data_limite: " invalid-date "
    });

    assert.strictEqual(result.success, false);

});

test("Should accept a valid update object", () => {

    const result = updateAtendimentoSchema.safeParse({ ...validAtendimentoUpdateParams });

    assert.strictEqual(result.success, true);

});

test("Should reject a invalid 'servico' in a update object", () => {

    const result = updateAtendimentoSchema.safeParse({
        ...validAtendimentoUpdateParams,
        servico_id: " non-existent servico "
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a non numeric price in a update object", () => {

    const result = updateAtendimentoSchema.safeParse({
        ...validAtendimentoUpdateParams,
        valor_atendimento: " invalid-price "
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a negative price in a update object", () => {

    const result = updateAtendimentoSchema.safeParse({
        ...validAtendimentoUpdateParams,
        valor_atendimento: -10.00
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a payment method different than 'PIX', 'CARTAO' or 'DINHEIRO' in a update object", () => {

    const result = updateAtendimentoSchema.safeParse({
        ...validAtendimentoUpdateParams,
        metodo_pagamento: "BOLETO"
    });

    assert.strictEqual(result.success, false);

});


