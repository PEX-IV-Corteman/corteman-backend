import { prisma } from "../config/db.js";
import { Prisma, type servicos } from "../../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import type { CreateServicoInput, CreateServicoResponse, DeleteServicoProps, GetServicoProps, GetServicoResponse, UpdateServicoRequest } from "../interfaces/dtos/servico.js";
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
            where: { servico_id: servicoId as string, nome_servico: servicoName as string }
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

            const servico: GetServicoResponse | null = await prisma.servicos.findUnique({ where: queryArgs.where });
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

    public async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {
        try {

            let nome_servico = servicoData.nome_servico ? servicoData.nome_servico : null;
            let valor_servico = servicoData.valor_servico ? servicoData.valor_servico : null;

            if (!nome_servico || !valor_servico) throw new AppError("Inputs inválidos. Os campos 'nome' e 'valor' precisam ser preenchidos corretamente!", ErrorCodes.InvalidInputData);

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

    public async delete(servicoId?: string, nomeServico?: string): Promise<void> {
        const servico_id = servicoId ? servicoId : null;
        const nome_servico = nomeServico ? nomeServico : null;

        try {
            if (!servico_id && !nome_servico) {
                throw new AppError("Atributo único não especificado. Por favor, preencha o campo de identificação do serviço corretamente.", ErrorCodes.InvalidInputData);
            }

            const queryArgs: DeleteServicoProps = {
                where: { servico_id: "" }
            }

            if (servico_id) {
                queryArgs.where = { servico_id: servico_id }

                if (nome_servico) {
                    queryArgs.where = { servico_id: servico_id, nome_servico: nome_servico }
                }
            }

            const servicoToDelete = await this.get(servicoId ?? nomeServico);

            if (!servicoToDelete) {
                throw new AppError("Serviço não encontrado.", ErrorCodes.RegisterDoesNotExist);
            }

            await prisma.servicos.delete({
                where: queryArgs.where
            });

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Formato de ID inválido. Por favor, tente novamente.", ErrorCodes.InvalidInputData);
                }
            }
            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.UnknownInternalError) {
                    throw new AppError(e.message, e.errorCode);
                }
            }
            throw new AppError("Erro inesperado. Por favor, tente novamente.", ErrorCodes.UnknownInternalError);
        }
    }
}
