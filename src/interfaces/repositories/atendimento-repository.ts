import type { CreateAtendimentoInput, ListAtendimentosQuery, UpdateAtendimentoInput } from "../../schemas/atendimento-schema.js";
import type { CreateAtendimentoResponse, GetAtendimentoResponse, UpdateAtendimentoResponse } from "../dtos/atendimento.js";

export interface AtendimentoRepository {
    
    create(atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null>;

    list(filters?: ListAtendimentosQuery): Promise<GetAtendimentoResponse[]>;

    find(atendimentoId: string): Promise<GetAtendimentoResponse | null>;

    update(atendimentoId: string, atendimentoData: UpdateAtendimentoInput): Promise<UpdateAtendimentoResponse>;

    delete(atendimentoId: string): Promise<void>;

}
