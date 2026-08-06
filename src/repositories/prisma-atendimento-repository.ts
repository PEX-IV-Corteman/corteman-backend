import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { AtendimentoRepository } from "../interfaces/atendimento-repository.js";
import type { CreateAtendimentoResponse, GetAtendimentoReponse } from "../interfaces/dtos/atendimento.js";
import type { CreateAtendimentoInput, ListAtendimentosQuery } from "../schemas/atendimento-schema.js";

export class PrismaAtendimentoRepository implements AtendimentoRepository {

    public async create(atendimentoData: CreateAtendimentoInput): Promise<CreateAtendimentoResponse | null> {

        try {

            const created = await prisma.atendimentos.create({
                data: atendimentoData
            });

            return created;

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

}
