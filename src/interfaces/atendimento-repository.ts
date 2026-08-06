import type { CreateAtendimentoInput, ListAtendimentosQuery } from "../schemas/atendimento-schema.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse } from "./dtos/atendimento.js";

export interface AtendimentoRepository {
    
    create(atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null>;

    list(filters?: ListAtendimentosQuery): Promise<GetAtendimentoReponse[]>;

}
