import type { CreateServicoResponse, GetServicoResponse, UpdateServicoResponse } from "../dtos/servico.js";
import type { CreateServicoInput, ListServicosQueryInput, UpdateServicoInput } from "../../schemas/servico-schema.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>;

    list(filters?: ListServicosQueryInput): Promise<GetServicoResponse[]>;

    find(servicoId: string): Promise<GetServicoResponse | null>;

    update(servicoId: string, servicoData: UpdateServicoInput): Promise<UpdateServicoResponse>;

    delete(servicoId: string): Promise<void>;

}
