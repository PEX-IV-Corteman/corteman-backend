import assert from "node:assert";
import { test } from "node:test";
import type { CreateAtendimentoInput, ListAtendimentosQuery } from "../../../src/schemas/atendimento-schema.js";
import type { CreateAtendimentoResponse, GetAtendimentoResponse } from "../../../src/interfaces/dtos/atendimento.js";
import type { AtendimentoRepository } from "../../../src/interfaces/atendimento-repository.js";
import { AtendimentoService } from "../../../src/services/atendimento-service.js";


const validAtendimento = {
    atendimento_id: "550e8400-e29b-41d4-a716-446655440002",
    servico_id: "550e8400-e29b-41d4-a716-446655440003",
    valor_atendimento: 9.99,
    metodo_pagamento: "CARTAO",
    realizado_em: "2026-12-15"
} as const;

test("Should create a new 'atendimento' and return it", async (t) => {

    const fakeAtendimentoRepository = {
        create: t.mock.fn(async (atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse> => ({
            atendimento_id: "550e8400-e29b-41d4-a716-446655440002",
            servico_id: atendimentoData.servico_id,
            valor_atendimento: 9.99,
            metodo_pagamento: "CARTAO",
            realizado_em: "2026-12-15"
        })),

        list: async () => [],
        find: async () => null,
        update: async () => ({...validAtendimento}),
        delete: async () => { }

    } satisfies AtendimentoRepository;

    const atendimentoService = new AtendimentoService(fakeAtendimentoRepository);

    const atendimentoData = {
        servico_id: "550e8400-e29b-41d4-a716-446655440003",
        valor_atendimento: 9.99,
        metodo_pagamento: "CARTAO"
    } as CreateAtendimentoInput

    const created = await atendimentoService.create(atendimentoData);

    assert.deepStrictEqual(created, {
        atendimento_id: "550e8400-e29b-41d4-a716-446655440002",
        servico_id: atendimentoData.servico_id,
        valor_atendimento: atendimentoData.valor_atendimento,
        metodo_pagamento: atendimentoData.metodo_pagamento,
        realizado_em: "2026-12-15"
    });

    assert.strictEqual(fakeAtendimentoRepository.create.mock.callCount(), 1);

    assert.deepStrictEqual(
        fakeAtendimentoRepository.create.mock.calls[0]?.arguments[0],
        atendimentoData
    );

});

test("Should return a list of 'atendimento' using the provided filters", async (t) => {

    const fakeAtendimentoRepository = {
        create: async () => ({...validAtendimento}),
        list: t.mock.fn(async (filters: ListAtendimentosQuery): Promise<GetAtendimentoResponse[]> => (
            [{
                ...validAtendimento,
                valor_atendimento: 30.0

            }])
        ),
        find: async () => null,
        update: async () => ({...validAtendimento}),
        delete: async () => { }
    } satisfies AtendimentoRepository

    const atendimentoService = new AtendimentoService(fakeAtendimentoRepository);

    const atendimentoFilters = {
        data_limite: "2026-12-15",
        valor_max: 35.9,
        metodo_pagamento: "CARTAO"
    } as ListAtendimentosQuery;

    const atendimentos = await atendimentoService.list(atendimentoFilters);

    assert.deepStrictEqual(atendimentos, [{
        ...validAtendimento,
        valor_atendimento: 30.0
    }]);

    assert.strictEqual(fakeAtendimentoRepository.list.mock.callCount(), 1);

    assert.deepStrictEqual(
        fakeAtendimentoRepository.list.mock.calls[0]?.arguments[0],
        atendimentoFilters
    );

});

