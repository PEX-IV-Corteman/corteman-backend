import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import { ErrorCodes } from "../errors/error-codes.js";
import { isFilterQueryValid, isUpdateServicoBodyValid } from "../tools/servico-validation.js";
import type { ServicoFilters } from "../tools/servico-validation.js";
import { formatValidationError } from "../tools/zod-error-formatter.js";
import { DatabaseError } from "../errors/database-error.js";
import { createServicoSchema } from "../schemas/servico-schema.js";
import type { ApiErrorResponse, ApiResponse } from "../interfaces/api-response.js";

export class ServicoController {

    constructor(private readonly servicoService: ServicoService) { }

    create: RequestHandler = async (req, res) => {

        const validation = createServicoSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const servicoCreated = await this.servicoService.create(validation.data);

            const response: ApiResponse<typeof servicoCreated> = {
                success: true,
                message: "Novo serviço adicionado.",
                data: servicoCreated,
                errors: []
            };

            return res.status(201).json(response);

        } catch (e) {

            let status = 500;

            let response: ApiErrorResponse = {
                success: false,
                message: "Erro ao criar serviço.",
                data: null,
                errors: []
            };

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterAlreadyExists) {

                response.message = "Não foi possível adicionar o serviço.";
                response.errors = [{ field: "nome_servico", messages: [e.message] }];
                status = 409;
            }

            console.error(e);

            return res.status(status).json(response);
        }
    }

    list: RequestHandler = async (req, res, next) => {

        if (Object.keys(req.query).length > 0) {
            return this.filter(req, res, next);
        }

        try {

            const servicos = await this.servicoService.list();
            return res.status(200).json({ servicos });

        } catch (e) {

            return res.status(500).json({ message: "Erro ao buscar serviços." });

        }

    }

    find: RequestHandler = async (req, res) => {

        const servicoId = req.params.id as string;

        try {
            
            const servico = await this.servicoService.find(servicoId);

            if (!servico) {
                return res.status(404).json({ message: "Serviço não encontrado." });
            }

            return res.status(200).json(servico);

        } catch (e) {

            return res.status(500).json("Erro ao buscar serviço.");

        }

    }

    update: RequestHandler = async (req, res) => {

        const servicoId = req.params.id as string;
        const servicoData = req.body;

        if (!isUpdateServicoBodyValid(servicoData)) {
            return res.status(400).json({ message: "Valores não fornecidos ou inválidos." });
        }

        try {

            await this.servicoService.update(servicoId, servicoData);
            return res.status(200).json({ message: "Servico atualizado com sucesso." });

        } catch (e) {

            if (e instanceof DatabaseError) {

                if (e.errorCode === ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }

                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: e.message });
                }

            }

            return res.status(500).json({ message: "Erro ao atualizar serviço." });

        }

    }

    delete: RequestHandler = async (req, res) => {

        const servicoId = req.params.id as string;

        try {

            await this.servicoService.delete(servicoId);
            return res.status(204).json();

        } catch (e) {

            if (e instanceof DatabaseError) {

                if (e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                    return res.status(404).json({ message: "Serviço não encontrado." });
                }

            }

            return res.status(500).json({ message: "Erro ao deletar serviço." });

        }

    }

    filter: RequestHandler = async (req, res) => {

        const servicoQuery = req.query;

        if (!isFilterQueryValid(servicoQuery)) {
            return res.status(400).json({ message: "Filtros inválidos ou não fornecidos." });
        }

        const servicoData = {
            ...(servicoQuery.nome_servico && {
                nome_servico: { startsWith: servicoQuery.nome_servico }
            }),
            ...(servicoQuery.valor_max && {
                valor_servico: { max: Number(servicoQuery.valor_max) }
            })
        } as ServicoFilters;

        try {

            const servicos = await this.servicoService.filter(servicoData);
            return res.status(200).json({ servicos });

        } catch (e) {

            return res.status(500).json({ message: "Erro ao filtrar serviços." });

        }

    }

}
