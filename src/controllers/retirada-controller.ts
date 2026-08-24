import type { RequestHandler } from "express";
import type { RetiradaService } from "../services/retirada-service.js";
import { createRetiradaSchema, listRetiradaParamSchema, retiradaIdParamSchema, updateRetiradaSchema } from "../schemas/retirada-schema.js";
import { formatValidationError } from "../tools/zod-error-formatter.js";
import type { ApiErrorResponse, ApiResponse } from "../interfaces/api-response.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";

export class RetiradaController {

    constructor(private readonly service: RetiradaService) { };

    create: RequestHandler = async (req, res) => {

        const validation = createRetiradaSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error))
        }

        try {

            const retiradaCreated = await this.service.create(validation.data);

            const response: ApiResponse<typeof retiradaCreated> = {
                success: true,
                message: "Retirada realizada.",
                data: retiradaCreated,
                errors: []
            };

            return res.status(201).json(response);

        } catch (e) {

            console.error(e);

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao realizar retirada.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);

        }

    }

    list: RequestHandler = async (req, res) => {

        const validation = listRetiradaParamSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const retiradas = await this.service.list(validation.data);

            const response: ApiResponse<typeof retiradas> = {
                success: true,
                message: "Retiradas listadas com sucesso.",
                data: retiradas,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            console.error(e);

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao listar retiradas.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);

        }

    }

    find: RequestHandler = async (req, res) => {

        const validation = retiradaIdParamSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const retirada = await this.service.find(validation.data.id);

            if (!retirada) {

                const response: ApiErrorResponse = {
                    success: false,
                    message: "Registro de retirada não encontrado.",
                    data: null,
                    errors: [{
                        field: "id",
                        messages: ["Nenhum registro de retirada foi encontrado com o identificador informado."]
                    }]
                };

                return res.status(404).json(response);

            }

            const response: ApiResponse<typeof retirada> = {
                success: true,
                message: "Retirada encontrada com sucesso.",
                data: retirada,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao buscar retirada.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);

        }

    }

    update: RequestHandler = async (req, res) => {

        const paramsValidation = retiradaIdParamSchema.safeParse(req.params);

        if (!paramsValidation.success) {
            return res.status(422).json(formatValidationError(paramsValidation.error));
        }

        const bodyValidation = updateRetiradaSchema.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(422).json(formatValidationError(bodyValidation.error));
        }

        try {

            const updatedRetirada = await this.service.update(paramsValidation.data.id, bodyValidation.data);

            const response: ApiResponse<typeof updatedRetirada> = {
                success: true,
                message: "Retirada atualizada com sucesso.",
                data: updatedRetirada,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            let status = 500;

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao atualizar dados de retirada.",
                data: null,
                errors: []
            }

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                status = 404;
                response.message = "Registro de retirada não encontrado.";
                response.errors = [{ field: "id", messages: [e.message] }];
            }

            return res.status(status).json(response);

        }

    }

    delete: RequestHandler = async (req, res) => {

        const validation = retiradaIdParamSchema.safeParse(req.params);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            await this.service.delete(validation.data.id);

            const response: ApiResponse<null> = {
                success: true,
                message: "Registro de retirada deletado com sucesso.",
                data: null,
                errors: []
            };

            return res.status(200).json(response);

        } catch (e) {

            let status = 500;

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao deletar registro de retirada.",
                data: null,
                errors: []
            };

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                status = 404;
                response.message = "O registro de retirada especificado não foi encontrado.";
                response.errors = [{ field: "id", messages: [e.message] }];
            }

            return res.status(status).json(response);

        }

    }

}
