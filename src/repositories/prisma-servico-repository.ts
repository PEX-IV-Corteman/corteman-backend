import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type { CreateServicoInput, CreateServicoResponse } from "../interfaces/dtos/servico.js";
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
                    throw new AppError("Servico já existente.", ErrorCodes.RegisterAlreadyExists);
                }

            }

            throw new AppError("Erro ao criar serviço.", ErrorCodes.UnknownInternalError);

        }

    }

}
