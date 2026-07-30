import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import type {
    CreateServicoInput,
    CreateServicoResponse,
    GetServicoResponse,
    ServicoFilters,
    UpdateServicoRequest
} from "../interfaces/dtos/servico.js";
import type { RequireAtLeastOne } from "../tools/servico-validation.js";
import type { ServicoRepository } from "../interfaces/servico-repository.js";

type validFilters = RequireAtLeastOne<ServicoFilters>;

export class ServicoService {

    constructor(private repository: ServicoRepository) {};

    public async create(servicoData: CreateServicoInput): Promise<CreateServicoResponse> {

        try {

            return await this.repository.create(servicoData);

        } catch (e) {

            if(e instanceof AppError) {

                if (e.errorCode === ErrorCodes.RegisterAlreadyExists) {
                    throw new AppError(e.message, e.errorCode);
                }
                
            }

            throw new AppError("Erro ao criar servico. Por favor, tente novamente.", ErrorCodes.UnknownInternalError);

        }

    }

    public async get(): Promise<GetServicoResponse[]> {

        try {

            const servicos = await this.repository.get();
            return servicos;

        } catch (e) {

            if (e instanceof AppError) {
                
            }

            throw new AppError("Erro ao processar pesquisa(s) de servico(s).", ErrorCodes.UnknownInternalError);
        }
    }

    public async update(servicoId: string, servicoData: UpdateServicoRequest): Promise<void> {

        try {

            await this.repository.update(servicoId, servicoData);

        } catch (e) {

            throw new AppError(
                "Erro ao atualizar servico. Por favor, tente novamente.",
                ErrorCodes.UnknownInternalError
            );

        }
    }

    public async delete(servicoId: string): Promise<void> {

        const servico_id = servicoId ?? null;

        if (!servico_id) {
            throw new AppError(
                "Id não especificado. Por favor, preencha o campo de identificação do serviço corretamente.",
                ErrorCodes.InvalidInputData
            );
        }

        try {

            await prisma.servicos.delete({
                where: { servico_id: servico_id }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError(
                        "Serviço não encontrado.",
                        ErrorCodes.RegisterDoesNotExist
                    );

                }

                if (e.code === "P2007") {
                    throw new AppError("ID inválido. Por favor, tente novamente.",
                        ErrorCodes.InvalidInputData
                    );
                }

            }

            if (e instanceof AppError) {
                throw new AppError(e.message, e.errorCode);
            }

            throw new AppError(
                "Erro inesperado. Por favor, tente novamente.",
                ErrorCodes.UnknownInternalError
            );

        }
    }


    public async filter(servicoData: validFilters): Promise<GetServicoResponse[] | null> {

        const nomeServico = servicoData.nome_servico;
        const valorServico = servicoData.valor_servico;

        try {

            if (nomeServico && valorServico) {
                const servicos = await prisma.servicos.findMany({
                    where: {
                        nome_servico: { startsWith: nomeServico.startsWith },
                        valor_servico: { lte: valorServico.max }
                    }
                });

                return servicos;
            }

            const orConditions = [];

            if (nomeServico?.startsWith) {
                
                orConditions.push({
                    nome_servico: { startsWith: nomeServico.startsWith },
                });

            }

            if (valorServico?.max) {
                
                orConditions.push({
                    valor_servico: { lte: valorServico.max },
                });
            }

            const servicos = await prisma.servicos.findMany({
                where: {
                    OR: orConditions
                }
            });
            
            return servicos;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCodes.UnknownInternalError);
            }
            
            throw new AppError(
                "Erro ao procurar serviços. Por favor, tente novamente.",
                ErrorCodes.UnknownInternalError
            );

        }
    }
}
