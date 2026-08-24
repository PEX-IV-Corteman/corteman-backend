import type { CreateRetiradaResponse, GetRetiradaResponse, UpdateRetiradaResponse } from "../interfaces/dtos/retirada.js";
import type { RetiradaRepository } from "../interfaces/repositories/retirada-repository.js";
import type { CreateRetiradaInput, ListRetiradaQueryInput, UpdateRetiradaInput } from "../schemas/retirada-schema.js";
import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";

export class PrismaRetiradaRepository implements RetiradaRepository {

    async create(retiradaData: CreateRetiradaInput): Promise<CreateRetiradaResponse> {

        const retirada = await prisma.retiradas.create({
            data: {
                ...retiradaData,
                justificativa: retiradaData.justificativa !== undefined
                    ? retiradaData.justificativa
                    : null
            }
        });

        return retirada;

    }

    async list(retidaraFilters: ListRetiradaQueryInput = {}): Promise<GetRetiradaResponse[]> {

        const retiradaData = {
            ...(retidaraFilters.data_limite && {
                realizada_em: { lte: new Date(retidaraFilters.data_limite) }
            }),
            ...(retidaraFilters.valor_max && {
                valor_retirada: { lte: retidaraFilters.valor_max }
            }),
            ...(retidaraFilters.destino && {
                destino: retidaraFilters.destino
            })
        };

        const retiradas = await prisma.retiradas.findMany({ where: retiradaData });
        return retiradas;

    }

    async find(retiradaId: string): Promise<GetRetiradaResponse | null> {

        const retirada = await prisma.retiradas.findUnique({
            where: { retirada_id: retiradaId }
        });

        return retirada;

    }

    async update(retiradaId: string, retiradaData: UpdateRetiradaInput): Promise<UpdateRetiradaResponse> {

        const retiradaUpdateData = {
            ...(retiradaData.valor_retirada && {
                valor_retirada: retiradaData.valor_retirada
            }),
            ...(retiradaData.realizada_em && {
                realizada_em: retiradaData.realizada_em
            }),
            ...(retiradaData.justificativa && {
                justificativa: retiradaData.justificativa
            })
        };

        try {

            const updatedRetirada = await prisma.retiradas.update({
                where: { retirada_id: retiradaId },
                data: retiradaUpdateData
            });

            return updatedRetirada;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError
                        ("Registro de retirada não encontrado.", ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }

    }

    async delete(retiradaId: string): Promise<void> {

        try {

            await prisma.retiradas.delete({
                where: { retirada_id: retiradaId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError
                        ("Registro de retirada não encontrado.", ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }

    }

};
