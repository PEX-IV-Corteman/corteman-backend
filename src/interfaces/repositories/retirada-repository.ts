import type { CreateRetiradaInput, ListRetiradaQueryInput, UpdateRetiradaInput } from "../../schemas/retirada-schema.js";
import type { CreateRetiradaResponse, GetRetiradaResponse, UpdateRetiradaResponse } from "../dtos/retirada.js";

export interface RetiradaRepository {

    create(retiradaData: CreateRetiradaInput): Promise<CreateRetiradaResponse>;
    
    list(retidaraFilters: ListRetiradaQueryInput): Promise<GetRetiradaResponse[]>;

    find(retiradaId: string): Promise<GetRetiradaResponse | null>;

    update(retiradaId: string, retiradaData: UpdateRetiradaInput): Promise<UpdateRetiradaResponse>;

    delete(retiradaId: string): Promise<void>;

};
