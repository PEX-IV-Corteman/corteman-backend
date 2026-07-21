import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { ErrorCodes } from "../errors/error-codes.js";
import { isCreateServicoBodyValid, isFilterBodyValid, isUpdateServicoBodyValid, type RequireAtLeastOne } from "../tools/servico-validation.js";
import type { ServicoFilters } from "../interfaces/dtos/servico.js";

type validFilterBody = RequireAtLeastOne<ServicoFilters>;


export class ServicoController {

    constructor(private readonly servicoService: ServicoService) { }

    create: RequestHandler = async (req, res) => {

        const servicoData = req.body;

        if (!isCreateServicoBodyValid(servicoData)) {
            return res.status(400).json({ message: "Os dados do serviço não foram fornecidos ou são inválidos." });
        }

        try {

            const servicoCreated = await this.servicoService.create(servicoData);
            return res.status(201).json({ message: "Novo serviço adicionado.", servicoCreated });

        } catch (e) {

            if (e instanceof AppError) {
                if (e.errorCode = ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }
                return res.status(500).json({ message: e.message });
            }

            return res.status(500).json({
                message: "Erro interno inesperado. Por favor, aguarde alguns intantes e tente novamente."
            });

        }
    }

    get: RequestHandler = async (req, res) => {

        const servicoId = req.params.id as string ?? null;

        try {

            if (!servicoId) {
                const servicos = await this.servicoService.get();
                return res.status(200).json({ servicos });
            }

            const servico = await this.servicoService.get(servicoId);

            if (!servico) {

                return res.status(404).json({
                    message: "Serviço(s) não encontrado(s)."
                });

            }

            return res.status(200).json({ servico });

        } catch (e) {

            if (e instanceof AppError) {
                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: `${e.message} Por favor, tente novamente.` });
                }
            }

            return res.status(500).json({
                message: "Erro ao procurar por servico. Por favor, tente novamente."
            });

        }

    }

    update: RequestHandler = async (req, res) => {

        const servicoId = req.params.id as string;
        const servicoData = req.body;

        if (!isUpdateServicoBodyValid(servicoData)) {

            return res.status(400).json({
                message: "Valores não fornecidos ou inválidos. Ao menos um campo deve ser atualizado."
            });

        }

        try {

            await this.servicoService.update(servicoId, servicoData);
            return res.status(200).json({ message: "Servico atualizado com sucesso." });

        } catch (e) {

            if (e instanceof AppError) {

                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: e.message });
                }

                if (e.errorCode === ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }

                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: e.message });
                }

            }

            return res.status(500).json({ message: "Erro interno. Por favor, tente novamente em alguns instantes." });

        }
    }

    delete: RequestHandler = async (req, res) => {

        const servicoId = String(req.params.id) ?? null;

        try {

            if (!servicoId) {
                return res.status(400).json({
                    message: "Dados insuficientes. Por favor, preencher os campos necessários para identificação do serviço."
                });
            }

            await this.servicoService.delete(servicoId);
            return res.status(204).json();

        } catch (e) {

            if (e instanceof AppError) {

                if (e.errorCode === ErrorCodes.InvalidInputData) {
                    return res.status(400).json({ message: "Dados do serviço incorretos." });
                }

                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: "Serviço não encontrado." });
                }

            }

            return res.status(500).json({
                message: "Erro ao deletear serviço. Por favor, tente novamente."
            });

        }

    }

    filter: RequestHandler = async (req, res) => {
        
        const servicoData = req.body;

        if (!isFilterBodyValid(servicoData)) {
            return res.status(400).json({
                message: "Filtros de pesquisa inválidos ou não fornecidos."
            });
        }

        try {

            const servicos = await this.servicoService.filter(servicoData);
            
            return res.status(200).json({
                servicos
            });

        } catch (e) {
            
            if (e instanceof AppError) {
    
                return res.status(400).json({
                    message: e.message
                });

            }

            return res.status(500).json({
                message: "Erro ao filtrar serviços. Por favor, tente novamente."
            });

        }
    }

}
