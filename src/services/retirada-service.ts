import type { CreateRetiradaResponse, GetRetiradaResponse, UpdateRetiradaResponse } from "../interfaces/dtos/retirada.js";
import type { RetiradaRepository } from "../interfaces/repositories/retirada-repository.js";
import type { CreateRetiradaInput, ListRetiradaQueryInput, UpdateRetiradaInput } from "../schemas/retirada-schema.js";

export class RetiradaService {

    constructor(private readonly repository: RetiradaRepository) {};

    public async create(retiradaData: CreateRetiradaInput): Promise<CreateRetiradaResponse | null> {

        const retirada = await this.repository.create(retiradaData);
        return retirada;

    }

    public async list(retiradaFilters: ListRetiradaQueryInput): Promise<GetRetiradaResponse[]> {

        const retiradas = await this.repository.list(retiradaFilters);
        return retiradas;

    }

    public async find(retiradaId: string): Promise<GetRetiradaResponse | null> {

        const retirada = await this.repository.find(retiradaId);
        return retirada;

    }

    public async update(retiradaId: string, retiradaData: UpdateRetiradaInput): Promise<UpdateRetiradaResponse> {

        const updatedRetirada = await this.repository.update(retiradaId, retiradaData);
        return updatedRetirada;

    }

    public async delete(retiradaId: string): Promise<void> {

        await this.repository.delete(retiradaId);

    }

}
