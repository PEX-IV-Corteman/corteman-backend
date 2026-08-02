import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { CreateServicoResponse, GetServicoResponse, UpdateServicoRequest } from "../interfaces/dtos/servico.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";
import type { CreateServicoInput } from "../schemas/servico-schema.js";
import type { ServicoFilters } from "../tools/servico-validation.js";

export class PrismaServicoRepository implements ServicoRepository {

    public async create(servico: CreateServicoInput): Promise<CreateServicoResponse> {

        try {

            return await prisma.servicos.create({ data: servico });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new DatabaseError("O nome do serviço já está em uso.", ErrorCodes.RegisterAlreadyExists);
            }

            throw e;
        }
    }

    public async list(): Promise<GetServicoResponse[]> {

        const servicos = await prisma.servicos.findMany();
        return servicos;
    }

    public async find(servicoId: string): Promise<GetServicoResponse | null> {

        const servico = await prisma.servicos.findUnique({
            where: { servico_id: servicoId }
        });
        
        return servico;

    }

    public async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {

        try {

            await prisma.servicos.update({
                where: { servico_id: servicoId },
                data: {
                    nome_servico: servicoData.nome_servico as string,
                    valor_servico: servicoData.valor_servico as Prisma.Decimal
                }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError(
                        "Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist
                    );
                }

                if (e.code === "P2002") {

                    throw new DatabaseError(
                        "Serviço deve ser único.", ErrorCodes.RegisterAlreadyExists
                    );

                }

            }

            throw e;

        }

    }

    public async delete(servicoId: string): Promise<void> {

        try {

            await prisma.servicos.delete({
                where: { servico_id: servicoId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new DatabaseError(
                        "Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist
                    );

                }

            }

            throw e;

        }

    }

    public async filter(servicoData: ServicoFilters): Promise<GetServicoResponse[]> {

        const filterConditions = [];

        if (servicoData.nome_servico?.startsWith) {

            filterConditions.push({
                nome_servico: { startsWith: servicoData.nome_servico.startsWith }
            });

        }

        if (servicoData.valor_servico?.max) {

            filterConditions.push({
                valor_servico: { lte: servicoData.valor_servico.max }
            });
        }

        const servicos = await prisma.servicos.findMany({
            where: {
                OR: filterConditions
            }
        });

        return servicos;
        
    }

}
