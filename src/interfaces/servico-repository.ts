import type { ServicoFilters } from "../tools/servico-validation.js";
import type { CreateServicoResponse, GetServicoResponse, UpdateServicoResponse } from "./dtos/servico.js";
import type { CreateServicoInput, UpdateServicoInput } from "../schemas/servico-schema.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>;

    list(): Promise<GetServicoResponse[]>;

    find(servicoId: string): Promise<GetServicoResponse | null>;

    update(servicoId: string, servicoData: UpdateServicoInput): Promise<UpdateServicoResponse>;

    delete(servicoId: string): Promise<void>;

    filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]>;
    
}
