import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { CreateServicoResponse, GetServicoResponse, UpdateServicoResponse } from "../interfaces/dtos/servico.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";
import type { CreateServicoInput, ListServicosQuery, UpdateServicoInput } from "../schemas/servico-schema.js";

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

    public async list(filters: ListServicosQuery = {}): Promise<GetServicoResponse[]> {

        const where = {
            ...(filters.nome_servico !== undefined && {
                nome_servico: {
                    contains: filters.nome_servico,
                    mode: "insensitive" as const
                }
            }),
            ...(filters.valor_max !== undefined && {
                valor_servico: { lte: filters.valor_max }
            })
        };

        return await prisma.servicos.findMany({ where });
    }

    public async find(servicoId: string): Promise<GetServicoResponse | null> {

        return await prisma.servicos.findUnique({
            where: { servico_id: servicoId }
        });

    }

    public async update(servicoId: string, servicoData: UpdateServicoInput): Promise<UpdateServicoResponse> {

        try {

            const data = {
                ...(servicoData.nome_servico !== undefined && { nome_servico: servicoData.nome_servico }),
                ...(servicoData.valor_servico !== undefined && { valor_servico: servicoData.valor_servico })
            };

            return await prisma.servicos.update({
                where: { servico_id: servicoId },
                data
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
                        "O nome do serviço já está em uso.", ErrorCodes.RegisterAlreadyExists
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

}
