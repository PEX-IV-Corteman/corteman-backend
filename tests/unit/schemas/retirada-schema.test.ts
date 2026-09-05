import assert from "node:assert";
import test from "node:test";
import { createRetiradaSchema, listRetiradaParamSchema, retiradaIdParamSchema, updateRetiradaSchema } from "../../../src/schemas/retirada-schema.js";


const validRetiradaId = "550e8400-e29b-41d4-a716-446655440000" as const;

const validRetirada = {
    valor_retirada: 500,
    destino: "EMPRESA",
    justificativa: "Troca do bebedouro"
} as const;

const validRetiradaUpdate = {
    ...validRetirada,
    realizada_em: "2026-09-05"
} as const;


// create

test("Should reject a retirada's id which is not in uuid format", () => {

    const result = retiradaIdParamSchema.safeParse({ id: "invalid-id" });

    assert.strictEqual(result.success, false);

});

test("Should accept a valid uuid as retirada's id", () => {

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

test("Should reject a retirada object whose 'valor_retirada' is greater than DECIMAL(10, 2)", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        valor_retirada: 100_000_000
    });

    assert.strictEqual(result.success, false);

});

test("Shoud accept a retirada object which has a valid 'destino' value", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        destino: "PESSOAL"
    });

    assert.strictEqual(result.success, true);

});

test("Should reject a retirada object whose 'destino' is not 'EMPRESA' or 'PESSOAL'", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        destino: "INVALID"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a retirada object with no 'justificativa'", () => {

    const { valor_retirada, destino } = validRetirada;

    const result = createRetiradaSchema.safeParse({
        valor_retirada,
        destino
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a retirada object whose 'justificativa' is not a text", () => {

    const result = createRetiradaSchema.safeParse({
        ...validRetirada,
        justificativa: 123456
    });

    assert.strictEqual(result.success, false);

});

test("Should sanitize and transform the create params", () => {

    const { valor_retirada, justificativa } = validRetirada;

    const result = createRetiradaSchema.safeParse({
        valor_retirada,
        destino: "  emPreSA   ",
        justificativa
    });

    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.data, validRetirada);

})

// list

test("Should accept a empty retirada's query object", () => {

    const result = listRetiradaParamSchema.safeParse({});

    assert.strictEqual(result.success, true);

});

test("Should sanitize and transform retirada's query params", () => {

    const valid = {
        valor_max: 500,
        destino: "EMPRESA",
        data_limite: "2026-09-03"
    };

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "    500",
        destino: "EmpresA",
        data_limite: "2026-09-03"
    });

    assert.deepStrictEqual(result.data, valid);

});

test("Should reject a query object whose 'valor_max' is empty", () => {

    const { destino } = validRetirada;

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "",
        destino,
        data_limite: "2026-09-04"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a query object whose 'valor_max' is not in text format", () => {

    const { destino } = validRetirada;

    const result = listRetiradaParamSchema.safeParse({
        valor_max: 500,
        destino,
        data_limite: "2026-09-04"
    });

    assert.strictEqual(result.success, false);
});

test("Should accept a query object with no 'valor_max field", () => {

    const { destino } = validRetirada;

    const result = listRetiradaParamSchema.safeParse({
        destino,
        data_limite: "2026-09-04"
    });

    assert.strictEqual(result.success, true);

});

test("Should accept a query object with no 'data_limite' field", () => {

    const { destino } = validRetirada;

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "200",
        destino
    });

    assert.strictEqual(result.success, true);

});

test("Should accept a query object with no 'destino' field", () => {

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "200",
        data_limite: "2026-09-04"
    });

    assert.strictEqual(result.success, true);

});

test("Should reject a query object whose 'data_limite' is not in 'yyyy-mm-dd' text format", () => {

    const { destino } = validRetirada;

    const queryobj = {
        valor_max: "200",
        destino,
        data_limite: 20260904
    };

    const result1 = listRetiradaParamSchema.safeParse(queryobj);

    const result2 = listRetiradaParamSchema.safeParse({
        ...queryobj,
        data_limte: "20260904"
    });

    assert.strictEqual(result1.success, false);
    assert.strictEqual(result2.success, false);

});

test("Should reject a query object whose 'valor_max' is not a positive number", () => {

    const { destino } = validRetirada;

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "-200"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a query object whose 'valor_max' is higher than DECIMAL(10, 2)", () => {

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "100000000"
    });

    assert.strictEqual(result.success, false);

});

test("Should reject a query object whose 'valor_max' has more than two decimal places", () => {

    const result = listRetiradaParamSchema.safeParse({
        valor_max: "150.095"
    });

    assert.strictEqual(result.success, false);

});


// update

test("Sould reject an object with no params to update", () => {

    const result = updateRetiradaSchema.safeParse({});

    assert.strictEqual(result.success, false);

});

test("Should accept an object with all params to update", () => {

    const result = updateRetiradaSchema.safeParse(validRetiradaUpdate);

    assert.strictEqual(result.success, true);

});

test("Should reject an object whose 'valor_retirada' is not a positive number", () => {

    const result1 = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        valor_retirada: "invalid"
    });

    const result2 = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        valor_retirada: -124.99
    });

    const result3 = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        valor_retirada: ""
    });

    assert.strictEqual(result1.success, false);
    assert.strictEqual(result2.success, false);
    assert.strictEqual(result3.success, false);

});

test("Should accept an object with no 'valor_retirada' to update", () => {

    const { destino, justificativa, realizada_em } = validRetiradaUpdate;

    const result = updateRetiradaSchema.safeParse({
        destino,
        justificativa,
        realizada_em
    });

    assert.strictEqual(result.success, true);

});

test("Should accept an object with no 'justificativa' to update", () => {

    const { valor_retirada, destino, realizada_em } = validRetiradaUpdate;

    const result = updateRetiradaSchema.safeParse({
        valor_retirada,
        destino,
        realizada_em
    });

    assert.strictEqual(result.success, true);

});

test("Should reject an object whose 'justificativa' is not a text", () => {

    const result = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        justificativa: 123
    });

    assert.strictEqual(result.success, false);

});

test("Should reject an object whose 'justificativa' \
    exceeds the limit of characters to update", () => {

    const MAX_CHARACTERS = 80;

    const result = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        justificativa: 'a'.repeat(MAX_CHARACTERS + 1)
    });

    assert.strictEqual(result.success, false);

});

test("Should accept an object with no 'destino' to update", () => {

    const { valor_retirada, justificativa, realizada_em } = validRetiradaUpdate;

    const result = updateRetiradaSchema.safeParse({
        valor_retirada,
        justificativa,
        realizada_em
    });

    assert.strictEqual(result.success, true);

});

test("Should reject an object whose 'destino' is not 'EMPRESA or 'PESSOAL' to update", () => {

    const result = updateRetiradaSchema.safeParse({
        ...validRetiradaUpdate,
        destino: "INVALID"
    });

    assert.strictEqual(result.success, false);

});

test("Should accept an object with no 'realizada_em' to update", () => {

    const { valor_retirada, destino, justificativa } = validRetiradaUpdate;

    const result = updateRetiradaSchema.safeParse({
        valor_retirada,
        destino,
        justificativa
    });

    assert.strictEqual(result.success, true);

});

test("Should reject an object whose 'realizada_em' is not in 'yyyy-mm-dd' \
    text format to update", () => {

        const result1 = updateRetiradaSchema.safeParse({
            ...validRetiradaUpdate,
            realizada_em: "20260905"
        });

        const result2 = updateRetiradaSchema.safeParse({
            ...validRetiradaUpdate,
            realizada_em: 20260905
        });

        const result3 = updateRetiradaSchema.safeParse({
            ...validRetiradaUpdate,
            realizada_em: "2026"
        })

        assert.strictEqual(result1.success, false);
        assert.strictEqual(result2.success, false);
        assert.strictEqual(result3.success, false);

    });

test("Should accept an object whose 'realizada_em' is in 'yyyy-mm-dd' \
    text format to update", () => {
        
        const result = updateRetiradaSchema.safeParse({
            ...validRetirada,
            realizada_em: "2012-12-12"
        });

        assert.strictEqual(result.success, true);

    });



