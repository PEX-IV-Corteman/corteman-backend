import { prisma } from "../config/db.js";
import type {
    CreateServicoInput, CreateServicoResponse,
    GetServicoResponse, UpdateServicoRequest
} from "../interfaces/dtos/servico.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";
import type { ServicoFilters } from "../tools/servico-validation.js";

export class ServicoService {

    constructor(private repository: ServicoRepository) { };

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse> {

        const created = await this.repository.create(servicoData);
        return created;

    }

    public async get(): Promise<GetServicoResponse[]> {

        const servicos = await this.repository.get();
        return servicos;

    }

    public async find(servicoId: string): Promise<GetServicoResponse | null> {

        const servico = await this.repository.find(servicoId);
        return servico;

    }

    public async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {

        await this.repository.update(servicoId, servicoData);

    }

    public async delete(servicoId: string): Promise<void> {

        await this.repository.delete(servicoId);

    }

    public async filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]> {

        const servicos = await this.repository.filter(servicoData);
        return servicos;

    }
    
}
