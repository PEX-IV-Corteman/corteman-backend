import type { AtendimentoRepository } from "../interfaces/atendimento-repository.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse } from "../interfaces/dtos/atendimento.js";
import type { CreateAtendimentoInput, ListAtendimentosQuery } from "../schemas/atendimento-schema.js";

export class AtendimentoService {

    constructor(private readonly repository: AtendimentoRepository) {};

    public async create(atentimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null> {

        const created = await this.repository.create(atentimentoData);
        return created;

    }
    
    public async list(filters?: ListAtendimentosQuery): Promise<GetAtendimentoReponse[]> {

        const atendimentos = await this.repository.list(filters);
        return atendimentos;

    }

}
