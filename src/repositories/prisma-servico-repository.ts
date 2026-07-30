
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../errors/app-error.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse, UpdateServicoRequest } from "../interfaces/dtos/servico.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";

export class PrismaServicoRepository implements ServicoRepository {

    async create(servico: CreateServicoInput): Promise<CreateServicoResponse> {

        try {

            const created = await prisma.servicos.create({
                data: servico
            });

            return created;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code == "P2002") {
                    throw new DatabaseError("O nome do Serviço deve ser único.",
                        ErrorCodes.RegisterAlreadyExists);
                }

            }

            throw new DatabaseError("Erro ao criar serviço.", ErrorCodes.UnknownInternalError);

        }

    }

    async get(): Promise<GetServicoResponse[]> {

        try {

            const servicos = await prisma.servicos.findMany();
            return servicos;

        } catch (e) {

            throw new DatabaseError("Erro ao acessar serviços.", ErrorCodes.UnknownInternalError);

        }
    }

    async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {

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
                        "O Nome do serviço deve ser único.", ErrorCodes.RegisterAlreadyExists
                    );

                }

            }

        }
    }

    async delete(servicoId: string): Promise<void> {

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

        }
    }

}
