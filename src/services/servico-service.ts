import { prisma } from "../config/db.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse } from "../interfaces/dtos/servico.js";


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

        let queryArgs = {
            servico_id: "" as never, 
            nome_servico: "" as never,
            where: { servico_id: "", nome_servico: "" }

        }

        if (servicoId) {
            queryArgs = {
                ...queryArgs,
                servico_id: servicoId as never,
                where: {
                    ...queryArgs.where,
                    servico_id: servicoId
                }
            }
        }

        if (servicoName) {
            queryArgs = {
                ...queryArgs, 
                nome_servico: servicoName as never,
                where: {
                    ...queryArgs.where,
                    nome_servico: servicoName as never
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
