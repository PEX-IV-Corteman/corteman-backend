import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import { ErrorCodes } from "../errors/error-codes.js";
import { formatValidationError } from "../tools/zod-error-formatter.js";
import { DatabaseError } from "../errors/database-error.js";
import {
    createServicoSchema,
    listServicosQuerySchema,
    servicoIdParamsSchema,
    updateServicoSchema
} from "../schemas/servico-schema.js";
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

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao criar serviço.",
                data: null,
                errors: []
            };

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterAlreadyExists) {

                response.message = "Não foi possível adicionar o serviço.";
                response.errors = [{ field: "nome_servico", messages: [e.message] }];
                status = 409;

            } else {
                console.error(e);
            }

            return res.status(status).json(response);
        }
    }

    list: RequestHandler = async (req, res) => {

        const validation = listServicosQuerySchema.safeParse(req.query);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const servicos = await this.servicoService.list(validation.data);

            const response: ApiResponse<typeof servicos> = {
                success: true,
                message: "Serviços listados com sucesso.",
                data: servicos,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            console.error(e);

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao listar serviços.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);
        }
    }

    find: RequestHandler = async (req, res) => {

        const validation = servicoIdParamsSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const servico = await this.servicoService.find(validation.data.id);

            if (!servico) {

                const response: ApiErrorResponse = {
                    success: false,
                    message: "Serviço não encontrado.",
                    data: null,
                    errors: [{
                        field: "id",
                        messages: ["Não foi encontrado um serviço com o identificador informado."]
                    }]
                };

                return res.status(404).json(response);
            }

            const response: ApiResponse<typeof servico> = {
                success: true,
                message: "Serviço encontrado com sucesso.",
                data: servico,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            console.error(e);

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao buscar serviço.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);
        }
    }

    update: RequestHandler = async (req, res) => {

        const paramsValidation = servicoIdParamsSchema.safeParse(req.params);

        if (!paramsValidation.success) {
            return res.status(422).json(formatValidationError(paramsValidation.error));
        }

        const bodyValidation = updateServicoSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(422).json(formatValidationError(bodyValidation.error));
        }

        try {

            const servicoUpdated = await this.servicoService.update(
                paramsValidation.data.id,
                bodyValidation.data
            );

            const response: ApiResponse<typeof servicoUpdated> = {
                success: true,
                message: "Serviço atualizado com sucesso.",
                data: servicoUpdated,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            let status = 500;

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao atualizar serviço.",
                data: null,
                errors: []
            };

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterAlreadyExists) {
                response.message = "Não foi possível atualizar o serviço.";
                response.errors = [{ field: "nome_servico", messages: [e.message] }];
                status = 409;
            } else if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                response.message = "Serviço não encontrado.";
                response.errors = [{ field: "id", messages: [e.message] }];
                status = 404;
            } else {
                console.error(e);
            }

            return res.status(status).json(response);
        }
    }

    delete: RequestHandler = async (req, res) => {

        const validation = servicoIdParamsSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            await this.servicoService.delete(validation.data.id);

            const response: ApiResponse<null> = {
                success: true,
                message: "Serviço excluído com sucesso.",
                data: null,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            let status = 500;

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao excluir serviço.",
                data: null,
                errors: []
            };

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                response.message = "Serviço não encontrado.";
                response.errors = [{ field: "id", messages: [e.message] }];
                status = 404;
            } else {
                console.error(e);
            }

            return res.status(status).json(response);
        }
    }
    
}
