import type { CreateAtendimentoInput, ListAtendimentosQuery, UpdateAtendimentoInput } from "../schemas/atendimento-schema.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse, UpdateAtendimentoResponse } from "./dtos/atendimento.js";

export interface AtendimentoRepository {
    
    create(atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null>;

    list(filters?: ListAtendimentosQuery): Promise<GetAtendimentoReponse[]>;

    update(atendimentoId: string, atendimentoData: UpdateAtendimentoInput): Promise<UpdateAtendimentoResponse>;

}
