import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse, UpdateServicoRequest } from "./dtos/servico.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>
    get(): Promise<GetServicoResponse[]>
    update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void>
    delete(servicoId: string): Promise<void>
    
}
