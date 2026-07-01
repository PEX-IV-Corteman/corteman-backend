import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoProps, GetServicoResponse } from "../interfaces/dtos/servico.js";
import { ErrorCodes } from "../errors/error-codes.js";

export class ServicoService {

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse | null> {
        try {
            const servico: CreateServicoResponse = await prisma.servicos.create({ data: servicoData });
            return servico;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new AppError("Servico já existente.", ErrorCodes.RegisterAlreadyExists);
                }
            }
            throw new Error("Erro ao criar servico. Por favor, tente novamente.");
        }
    }

    public async get(servicoId?: string, servicoName?: string): Promise<GetServicoResponse[] | GetServicoResponse | null> {

        let queryArgs: GetServicoProps = { 
            where: { servico_id: servicoId as string, nome_servico: servicoName as string}
        }

        if (servicoId) {
            queryArgs = {
                ...queryArgs,
                where: {
                    ...queryArgs.where,
                    servico_id: servicoId
                }
            }
        }

        if (servicoName) {
            queryArgs = {
                ...queryArgs, 
                where: {
                    ...queryArgs.where,
                    nome_servico: servicoName
                }
            }
        }

        try {

            if (!servicoId && !servicoName) {
                const servicos: GetServicoResponse[] = await prisma.servicos.findMany();
                return servicos;
            }

            const servico: GetServicoResponse | null = await prisma.servicos.findUnique({ where: queryArgs.where } );            
            return servico;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Formato de ID inválido.", ErrorCodes.InvalidInputData);
                }
            }
            throw new Error("Erro ao processar pesquisa(s) de servico(s).");
        }
    }
}
