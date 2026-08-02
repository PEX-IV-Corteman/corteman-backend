import type { ServicoFilters } from "../tools/servico-validation.js";
import type { CreateServicoResponse, GetServicoResponse, UpdateServicoRequest } from "./dtos/servico.js";
import type { CreateServicoInput } from "../schemas/servico-schema.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>;

    list(): Promise<GetServicoResponse[]>;

    find(servicoId: string): Promise<GetServicoResponse | null>;

    update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void>;

    delete(servicoId: string): Promise<void>;

    filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]>;
    
}
