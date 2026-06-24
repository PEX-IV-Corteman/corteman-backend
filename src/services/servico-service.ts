import { prisma } from "../config/db.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoResponse } from "../interfaces/dtos/servico.js";

interface searchObj {
    servico_id?: string,
    nome_servico?: string,

}


export class ServicoService {
    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse | null> {
        try {
            const servico: CreateServicoResponse = await prisma.servicos.create({ data: servicoData });
            return servico;
        } catch (e) {
            throw new Error("Erro ao criar novo servico.");
        }
    }

    public async get(servicoId: string = "", servicoName: string = ""): Promise<GetServicoResponse[] | GetServicoResponse | null> {

        try {

            if (servicoId.length < 1 && servicoName.length < 1) {
                const servicos: GetServicoResponse[] = await prisma.servicos.findMany();
                return servicos;
            }

            const servico: GetServicoResponse | null = await prisma.servicos.findUnique(
                {
                    where: { 
                        servico_id: servicoId,
                        nome_servico: servicoName
                    }
                });
            return servico;
        } catch (e) {
            throw new Error("Erro ao processar pesquisa(s) de servico(s).");
        }
    }

}
