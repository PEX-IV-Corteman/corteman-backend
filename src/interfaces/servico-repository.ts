import type { ServicoFilters } from "../tools/servico-validation.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse, UpdateServicoRequest } from "./dtos/servico.js";

export interface ServicoRepository {
    
    create(servico: CreateServicoInput): Promise<CreateServicoResponse>;

    get(): Promise<GetServicoResponse[]>;

    find(servicoId: string): Promise<GetServicoResponse | null>;

    update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void>;

    delete(servicoId: string): Promise<void>;

    filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]>;
    
}
