import type {
    CreateServicoResponse,
    GetServicoResponse, UpdateServicoResponse
} from "../interfaces/dtos/servico.js";
import type { CreateServicoInput, ListServicosQuery, UpdateServicoInput } from "../schemas/servico-schema.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";

export class ServicoService {

    constructor(private repository: ServicoRepository) { };

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse> {

        return await this.repository.create(servicoData);

    }

    public async list(filters: ListServicosQuery): Promise<GetServicoResponse[]> {

        return await this.repository.list(filters);

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

}
