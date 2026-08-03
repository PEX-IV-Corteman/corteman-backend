import assert from "node:assert";
import { test } from "node:test";
import { Prisma } from "../../../generated/prisma/client.js";
import type { CreateServicoResponse, GetServicoResponse, UpdateServicoResponse } from "../../../src/interfaces/dtos/servico.js";
import type { ServicoRepository } from "../../../src/interfaces/servico-repository.js";
import type {
    CreateServicoInput,
    ListServicosQuery,
    UpdateServicoInput
} from "../../../src/schemas/servico-schema.js";
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
        update: async () => ({
            servico_id: "123",
            nome_servico: "Corte masculino",
            valor_servico: new Prisma.Decimal(45.9)
        }),
        delete: async () => {}
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

test("Should update a 'serviço' and return it", async (t) => {
    const updateResult: UpdateServicoResponse = {
        servico_id: "123",
        nome_servico: "Corte e barba",
        valor_servico: new Prisma.Decimal(65)
    };
    const fakeServicoRepository = {
        create: async (servico: CreateServicoInput): Promise<CreateServicoResponse> => ({
            servico_id: "123",
            nome_servico: servico.nome_servico,
            valor_servico: new Prisma.Decimal(servico.valor_servico)
        }),
        list: async () => [],
        find: async () => null,
        update: t.mock.fn(async (
            _servicoId: string,
            _servicoData: UpdateServicoInput
        ): Promise<UpdateServicoResponse> => updateResult),
        delete: async () => {}
    } satisfies ServicoRepository;
    const servicoService = new ServicoService(fakeServicoRepository);
    const updateData = {
        nome_servico: "Corte e barba",
        valor_servico: 65
    };

    const updated = await servicoService.update("123", updateData);

    assert.strictEqual(updated, updateResult);
    assert.strictEqual(fakeServicoRepository.update.mock.callCount(), 1);
    assert.strictEqual(
        fakeServicoRepository.update.mock.calls[0]?.arguments[0],
        "123"
    );
    assert.strictEqual(
        fakeServicoRepository.update.mock.calls[0]?.arguments[1],
        updateData
    );
});

test("Should list services using the provided filters", async (t) => {
    const listResult: GetServicoResponse[] = [{
        servico_id: "123",
        nome_servico: "Corte masculino",
        valor_servico: new Prisma.Decimal(45.9)
    }];
    const fakeServicoRepository = {
        create: async (servico: CreateServicoInput): Promise<CreateServicoResponse> => ({
            servico_id: "123",
            nome_servico: servico.nome_servico,
            valor_servico: new Prisma.Decimal(servico.valor_servico)
        }),
        list: t.mock.fn(async (_filters?: ListServicosQuery): Promise<GetServicoResponse[]> => listResult),
        find: async () => null,
        update: async () => ({
            servico_id: "123",
            nome_servico: "Corte masculino",
            valor_servico: new Prisma.Decimal(45.9)
        }),
        delete: async () => {}
    } satisfies ServicoRepository;
    const servicoService = new ServicoService(fakeServicoRepository);
    const filters = {
        nome_servico: "Corte",
        valor_max: 50
    };

    const listed = await servicoService.list(filters);

    assert.strictEqual(listed, listResult);
    assert.strictEqual(fakeServicoRepository.list.mock.callCount(), 1);
    assert.strictEqual(
        fakeServicoRepository.list.mock.calls[0]?.arguments[0],
        filters
    );
});
