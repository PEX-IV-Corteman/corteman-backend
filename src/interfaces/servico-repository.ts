import type { CreateServicoInput, CreateServicoResponse } from "./dtos/servico.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>

}
