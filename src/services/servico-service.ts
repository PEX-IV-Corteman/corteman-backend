import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import type { CreateServicoInput, CreateServicoResponse, GetServicoProps, GetServicoResponse, UpdateServicoRequest } from "../interfaces/dtos/servico.js";
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

    public async get(servicoId?: string | null): Promise<GetServicoResponse[] | GetServicoResponse | null> {

        try {

            if (!servicoId) {
                const servicos: GetServicoResponse[] = await prisma.servicos.findMany();
                return servicos;
            }



            const servico: GetServicoResponse | null = await prisma.servicos.findUnique({ where: { servico_id: servicoId }});
            return servico;

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Formato de ID inválido.", ErrorCodes.InvalidInputData);
                }
            }
            throw new AppError("Erro ao processar pesquisa(s) de servico(s).", ErrorCodes.UnknownInternalError);
        }
    }

    public async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {

        try {

            let nome_servico = servicoData.nome_servico ? servicoData.nome_servico : null;
            let valor_servico = servicoData.valor_servico ? servicoData.valor_servico : null;

            if (!nome_servico && !valor_servico) throw new AppError("O nome e/ou valor do serviço não foram fornecidos.", ErrorCodes.InvalidInputData);

            const servico = await prisma.servicos.findUnique({ where: { servico_id: servicoId } });
            if (!servico) throw new AppError("Servico não encontrado.", ErrorCodes.RegisterDoesNotExist);

            await prisma.servicos.update({
                where: { servico_id: servicoId },
                data: {
                    nome_servico: servicoData.nome_servico as string,
                    valor_servico: servicoData.valor_servico as Prisma.Decimal,
                },
            });

        } catch (e) {
            if (e instanceof AppError) {
                throw new AppError(e.message, e.errorCode);
            }
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new AppError("Não foi possível realizar alteracão, pois já existe um servico com mesmo nome registrado.", ErrorCodes.RegisterAlreadyExists);
                }
                if (e.code === "P2007") {
                    throw new AppError("Formato de ID inválido. Por favor, verifique as informacões inseridas.", ErrorCodes.InvalidInputData);
                }
            }
            throw new AppError("Erro ao atualizar servico. Por favor, tente novamente.", ErrorCodes.UnknownInternalError);
        }
    }

    public async delete(servicoId: string): Promise<void> {
        const servico_id = servicoId ?? null;

        try {
            if (!servico_id) {
                throw new AppError("Id não especificado. Por favor, preencha o campo de identificação do serviço corretamente.", ErrorCodes.InvalidInputData);
            }

            const servicoToDelete = await this.get(servicoId);
            
            if (!servicoToDelete) {
                throw new AppError("Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist);
            }

            await prisma.servicos.delete({
                where: { servico_id: servico_id }
            });

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("ID inválido. Por favor, tente novamente.", ErrorCodes.InvalidInputData);
                }
            }
            if (e instanceof AppError) {
                throw new AppError(e.message, e.errorCode);
            }
            throw new AppError("Erro inesperado. Por favor, tente novamente.", ErrorCodes.UnknownInternalError);
        }
    }
}
