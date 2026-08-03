import type {
    CreateServicoResponse,
    GetServicoResponse, UpdateServicoResponse
} from "../interfaces/dtos/servico.js";
import type { CreateServicoInput, UpdateServicoInput } from "../schemas/servico-schema.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";
import type { ServicoFilters } from "../tools/servico-validation.js";

export class ServicoService {

    constructor(private repository: ServicoRepository) { };

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse> {

        return await this.repository.create(servicoData);

    }

    public async list(): Promise<GetServicoResponse[]> {

        const servicos = await this.repository.list();
        return servicos;

    }

    public async find(servicoId: string): Promise<GetServicoResponse | null> {

        const servico = await this.repository.find(servicoId);
        return servico;

    }

    public async update(servicoId: string, servicoData: UpdateServicoInput): Promise<UpdateServicoResponse> {

        return await this.repository.update(servicoId, servicoData);

    }

    public async delete(servicoId: string): Promise<void> {

        await this.repository.delete(servicoId);

    }

    public async filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]> {

        const servicos = await this.repository.filter(servicoData);
        return servicos;

    }
    
}
