import assert from "node:assert";
import { test } from "node:test";
import { Prisma } from "../../../generated/prisma/client.js";
import type { CreateServicoResponse } from "../../../src/interfaces/dtos/servico.js";
import type { ServicoRepository } from "../../../src/interfaces/servico-repository.js";
import type { CreateServicoInput } from "../../../src/schemas/servico-schema.js";
import { ServicoService } from "../../../src/services/servico-service.js";

test("Should create a new 'serviço' and return it", async (t) => {
    const fakeServicoRepository = {
        create: t.mock.fn(async (servico: CreateServicoInput): Promise<CreateServicoResponse> => ({
            servico_id: "123",
            nome_servico: servico.nome_servico,
            valor_servico: new Prisma.Decimal(servico.valor_servico)
        })),
        list: async () => [],
        find: async () => null,
        update: async () => {},
        delete: async () => {},
        filter: async () => []
    } satisfies ServicoRepository;
    const servicoService = new ServicoService(fakeServicoRepository);
    const servicoData = {
        nome_servico: "Corte masculino",
        valor_servico: 45.9
    };

    const created = await servicoService.create(servicoData);

    assert.deepStrictEqual(created, {
        servico_id: "123",
        nome_servico: servicoData.nome_servico,
        valor_servico: new Prisma.Decimal(servicoData.valor_servico)
    });
    assert.strictEqual(fakeServicoRepository.create.mock.callCount(), 1);
    assert.strictEqual(
        fakeServicoRepository.create.mock.calls[0]?.arguments[0],
        servicoData
    );
});
