import { test } from "node:test";
import type { CreateServicoInput, CreateServicoResponse } from "../../../src/interfaces/dtos/servico.js";
import { ServicoService } from "../../../src/services/servico-service.js";
import assert from "node:assert";
import { Prisma } from "../../../generated/prisma/client.js";




test("should create a new 'serviço' and return it", async (t) => {
    
    const fakeServicoRepository = {
        create: t.mock.fn(async (servico: CreateServicoInput): Promise<CreateServicoResponse> => {
            return {  
                servico_id: "123",
                ...servico
            }
        })
    }

    const fakeServicoService = new ServicoService(fakeServicoRepository);
    
    const fakeServico = {
        nome_servico: "Lancer",
        valor_servico: Prisma.Decimal(999.99)
    }

    const created = await fakeServicoService.create(fakeServico);

    assert.deepStrictEqual(created, {
        servico_id: (await created).servico_id,
        ...fakeServico
    });
    
    assert.strictEqual(
        fakeServicoRepository.create.mock.callCount(),
        1
    );

    assert.strictEqual(
        fakeServicoRepository.create.mock.calls[0]?.arguments[0],
        fakeServico
    );

});
