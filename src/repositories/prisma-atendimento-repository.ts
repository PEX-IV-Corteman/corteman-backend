import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { AtendimentoRepository } from "../interfaces/atendimento-repository.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse, UpdateAtendimentoResponse } from "../interfaces/dtos/atendimento.js";
import type { CreateAtendimentoInput, ListAtendimentosQuery, UpdateAtendimentoInput } from "../schemas/atendimento-schema.js";

export class PrismaAtendimentoRepository implements AtendimentoRepository {

    public async create(atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null> {

        try {

            const createdAtendimento = await prisma.atendimentos.create({
                data: atendimentoData
            });

            return createdAtendimento;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError(e.message, ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }

    }

    public async list(filters?: ListAtendimentosQuery): Promise<GetAtendimentoReponse[]> {

        let atendimentoData = {};

        if (filters) {

            for (let filter in filters) {

                atendimentoData = {
                    ...atendimentoData,
                    filter: filters[filter as keyof ListAtendimentosQuery]
                }

            }

        }

        const atendimentos = await prisma.atendimentos.findMany({
            where: atendimentoData
        });

        return atendimentos;

    }

    public async find(atendimentoId: string): Promise<GetAtendimentoReponse | null> {

        const atendimento = await prisma.atendimentos.findUnique({
            where: { atendimento_id: atendimentoId }
        });

        return atendimento;

    }

    public async update(atendimentoId: string, atendimentoData: UpdateAtendimentoInput): Promise<UpdateAtendimentoResponse> {

        const filteredData = Object.fromEntries(
            Object.entries(atendimentoData)
                .filter(([key, value]) => {
                    value !== undefined ? [key, value] : []
                })
        );

        try {

            const updatedAtendimento = await prisma.atendimentos.update({
                where: { atendimento_id: atendimentoId },
                data: filteredData
            });

            return updatedAtendimento;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError("Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }

    }

    public async delete(atendimentoId: string): Promise<void> {

        try {

            await prisma.atendimentos.delete({
                where: { atendimento_id: atendimentoId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {
                    throw new DatabaseError("Atendimento não registrado.", ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }
    }

}
