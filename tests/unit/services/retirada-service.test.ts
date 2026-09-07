import assert from "node:assert";
import { test } from "node:test";
import { Prisma } from "../../../generated/prisma/client.js";
import type {
    CreateRetiradaResponse,
    GetRetiradaResponse,
    UpdateRetiradaResponse
} from "../../../src/interfaces/dtos/retirada.js";
import type { RetiradaRepository } from "../../../src/interfaces/repositories/retirada-repository.js";
import type {
    CreateRetiradaInput,
    ListRetiradaQueryInput,
    UpdateRetiradaInput
} from "../../../src/schemas/retirada-schema.js";
import { RetiradaService } from "../../../src/services/retirada-service.js";

const validRetirada = {
    valor_retirada: new Prisma.Decimal(150),
    destino: "EMPRESA",
    justificativa: "Compra de materiais"
} as const;

test("Should create a new 'retirada' and return it", async (t) => {
    const fakeRetiradaRepository = {
        create: t.mock.fn(async (_retiradaData: CreateRetiradaInput): Promise<CreateRetiradaResponse> => validRetirada),
        list: async () => [],
        find: async () => null,
        update: async () => validRetirada,
        delete: async () => {}
    } satisfies RetiradaRepository;
    const retiradaService = new RetiradaService(fakeRetiradaRepository);
    const retiradaData: CreateRetiradaInput = {
        valor_retirada: 150,
        destino: "EMPRESA",
        justificativa: "Compra de materiais"
    };

    const created = await retiradaService.create(retiradaData);

    assert.strictEqual(created, validRetirada);
    assert.strictEqual(fakeRetiradaRepository.create.mock.callCount(), 1);
    assert.strictEqual(fakeRetiradaRepository.create.mock.calls[0]?.arguments[0], retiradaData);
});

test("Should list 'retiradas' using the provided filters", async (t) => {
    const listResult: GetRetiradaResponse[] = [validRetirada];
    const fakeRetiradaRepository = {
        create: async () => validRetirada,
        list: t.mock.fn(async (_filters: ListRetiradaQueryInput): Promise<GetRetiradaResponse[]> => listResult),
        find: async () => null,
        update: async () => validRetirada,
        delete: async () => {}
    } satisfies RetiradaRepository;
    const retiradaService = new RetiradaService(fakeRetiradaRepository);
    const filters: ListRetiradaQueryInput = {
        valor_max: 200,
        data_limite: "2026-12-15",
        destino: "EMPRESA"
    };

    const listed = await retiradaService.list(filters);

    assert.strictEqual(listed, listResult);
    assert.strictEqual(fakeRetiradaRepository.list.mock.callCount(), 1);
    assert.strictEqual(fakeRetiradaRepository.list.mock.calls[0]?.arguments[0], filters);
});

test("Should find a 'retirada' by its id", async (t) => {
    const fakeRetiradaRepository = {
        create: async () => validRetirada,
        list: async () => [],
        find: t.mock.fn(async (_retiradaId: string): Promise<GetRetiradaResponse | null> => validRetirada),
        update: async () => validRetirada,
        delete: async () => {}
    } satisfies RetiradaRepository;
    const retiradaService = new RetiradaService(fakeRetiradaRepository);

    const found = await retiradaService.find("550e8400-e29b-41d4-a716-446655440002");

    assert.strictEqual(found, validRetirada);
    assert.strictEqual(fakeRetiradaRepository.find.mock.callCount(), 1);
    assert.strictEqual(
        fakeRetiradaRepository.find.mock.calls[0]?.arguments[0],
        "550e8400-e29b-41d4-a716-446655440002"
    );
});

test("Should update a 'retirada' and return it", async (t) => {
    const updateResult: UpdateRetiradaResponse = {
        valor_retirada: new Prisma.Decimal(180),
        destino: "PESSOAL",
        justificativa: "Despesa pessoal"
    };
    const fakeRetiradaRepository = {
        create: async () => validRetirada,
        list: async () => [],
        find: async () => null,
        update: t.mock.fn(async (
            _retiradaId: string,
            _retiradaData: UpdateRetiradaInput
        ): Promise<UpdateRetiradaResponse> => updateResult),
        delete: async () => {}
    } satisfies RetiradaRepository;
    const retiradaService = new RetiradaService(fakeRetiradaRepository);
    const updateData: UpdateRetiradaInput = {
        valor_retirada: 180,
        destino: "PESSOAL",
        justificativa: "Despesa pessoal"
    };

    const updated = await retiradaService.update(
        "550e8400-e29b-41d4-a716-446655440002",
        updateData
    );

    assert.strictEqual(updated, updateResult);
    assert.strictEqual(fakeRetiradaRepository.update.mock.callCount(), 1);
    assert.strictEqual(
        fakeRetiradaRepository.update.mock.calls[0]?.arguments[0],
        "550e8400-e29b-41d4-a716-446655440002"
    );
    assert.strictEqual(fakeRetiradaRepository.update.mock.calls[0]?.arguments[1], updateData);
});

test("Should delete a 'retirada' by its id", async (t) => {
    const fakeRetiradaRepository = {
        create: async () => validRetirada,
        list: async () => [],
        find: async () => null,
        update: async () => validRetirada,
        delete: t.mock.fn(async (_retiradaId: string): Promise<void> => {})
    } satisfies RetiradaRepository;
    const retiradaService = new RetiradaService(fakeRetiradaRepository);

    await retiradaService.delete("550e8400-e29b-41d4-a716-446655440002");

    assert.strictEqual(fakeRetiradaRepository.delete.mock.callCount(), 1);
    assert.strictEqual(
        fakeRetiradaRepository.delete.mock.calls[0]?.arguments[0],
        "550e8400-e29b-41d4-a716-446655440002"
    );
});

