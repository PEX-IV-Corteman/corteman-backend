import type {
    CreateServicoResponse,
    GetServicoResponse, UpdateServicoResponse
} from "../interfaces/dtos/servico.js";
import type { CreateServicoInput, ListServicosQuery, UpdateServicoInput } from "../schemas/servico-schema.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";

export class ServicoService {

    constructor(private readonly repository: ServicoRepository) { };

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse> {

        return await this.repository.create(servicoData);

    }

    public async list(filters: ListServicosQuery): Promise<GetServicoResponse[]> {

        return await this.repository.list(filters);

    }

    public async find(servicoId: string): Promise<GetServicoResponse | null> {

        return await this.repository.find(servicoId);

    }

    public async update(servicoId: string, servicoData: UpdateServicoInput): Promise<UpdateServicoResponse> {

        return await this.repository.update(servicoId, servicoData);

    }

    public async delete(servicoId: string): Promise<void> {

        return await this.repository.delete(servicoId);

    }

}
