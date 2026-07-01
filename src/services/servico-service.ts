import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse } from "../interfaces/dtos/servico.js";
import { ErrorCodes } from "../errors/error-codes.js";

type getServicoProps = {
    where: { servico_id: string } |
    { nome_servico: string } | 
    { servico_id: string, nome_servico: string }
}

export class ServicoService {

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse | null> {
        try {
            const servico: CreateServicoResponse = await prisma.servicos.create({ data: servicoData });
            return servico;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code == "P2002") {
                    throw new AppError("Servico já existente.", ErrorCodes.ServicoAlreadyExists);
                }
            }
            console.error(e);
            throw new Error("Erro interno do servidor. Por favor, tente novamente.");
        }
    }

    public async get(servicoId?: string, servicoName?: string): Promise<GetServicoResponse[] | GetServicoResponse | null> {

        let queryArgs: getServicoProps = { 
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
            console.error(e);
            throw new Error("Erro ao processar pesquisa(s) de servico(s).");
        }
    }
}
