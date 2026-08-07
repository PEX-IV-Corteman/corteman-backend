import type { AtendimentoRepository } from "../interfaces/atendimento-repository.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse, UpdateAtendimentoResponse } from "../interfaces/dtos/atendimento.js";
import type { CreateAtendimentoInput, ListAtendimentosQuery, UpdateAtendimentoInput } from "../schemas/atendimento-schema.js";

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

    public async find(atendimentoId: string): Promise<GetAtendimentoReponse | null> {

        const atendimento = await this.repository.find(atendimentoId);
        return atendimento;
        
    }

    public async update(atendimentoId: string, atendimentoData: UpdateAtendimentoInput): Promise<UpdateAtendimentoResponse> {

        const updatedAtendimento = await this.repository.update(atendimentoId, atendimentoData);
        return updatedAtendimento;

    }

    public async delete(atendimentoId: string): Promise<void> {

        await this.repository.delete(atendimentoId);

    }

}
