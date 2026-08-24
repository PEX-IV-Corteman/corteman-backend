import { Prisma } from "../../generated/prisma/client.js";
import { Decimal } from "@prisma/client/runtime/index-browser";
import { prisma } from "../config/db.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { AtendimentoRepository } from "../interfaces/repositories/atendimento-repository.js";
import type { CreateAtendimentoResponse, GetAtendimentoResponse, UpdateAtendimentoResponse } from "../interfaces/dtos/atendimento.js";
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
                    throw new DatabaseError("Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist);
                }

                throw new DatabaseError(e.message, ErrorCodes.UnexpectedDatabaseError);

            }

            throw e;

        }

    }

    public async list(atendimentoFilters: ListAtendimentosQuery = {}): Promise<GetAtendimentoResponse[]> {

        const atendimentoData = {
            ...(atendimentoFilters.servico_id && {
                servico_id: atendimentoFilters.servico_id
            }),
            ...(atendimentoFilters.data_limite && {
                realizado_em: { lte: new Date(atendimentoFilters.data_limite) }
            }),
            ...(atendimentoFilters.metodo_pagamento && {
                metodo_pagamento: atendimentoFilters.metodo_pagamento
            })
        }

        const atendimentos = await prisma.atendimentos.findMany({
            where: atendimentoData
        });
        return atendimentos;

    }

    public async find(atendimentoId: string): Promise<GetAtendimentoResponse | null> {

        const atendimento = await prisma.atendimentos.findUnique({
            where: { atendimento_id: atendimentoId }
        });

        return atendimento;

    }

    public async update(atendimentoId: string, atendimentoData: UpdateAtendimentoInput): Promise<UpdateAtendimentoResponse> {

        const atendimentoUdpateData = {
            ...(atendimentoData.servico_id && {
                servico_id: atendimentoData.servico_id
            }),
            ...(atendimentoData.valor_atendimento && {
                valor_atendimento: atendimentoData.valor_atendimento
            }),
            ...(atendimentoData.metodo_pagamento && {
                metodo_pagamento: atendimentoData.metodo_pagamento
            }),
            ...(atendimentoData.realizado_em && {
                realizado_em: atendimentoData.realizado_em
            })
        };

        try {

            const updatedAtendimento = await prisma.atendimentos.update({
                where: { atendimento_id: atendimentoId },
                data: atendimentoUdpateData
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
