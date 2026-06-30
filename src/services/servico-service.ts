import { prisma } from "../config/db.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse } from "../interfaces/dtos/servico.js";

type getServicoProps = {
    servico_id?: string,
    nome_servico?: string,
    where: 
        { servico_id: string } | { nome_servico: string } | { servico_id: string, nome_servico: string }
}

export class ServicoService {

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse | null> {
        try {
            const servico: CreateServicoResponse = await prisma.servicos.create({ data: servicoData });
            return servico;
        } catch (e) {
            console.error(e);
            throw new Error("Erro ao criar novo servico.");
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
