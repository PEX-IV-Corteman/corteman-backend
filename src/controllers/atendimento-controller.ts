import type { RequestHandler } from "express";
import type { AtendimentoService } from "../services/atendimento-service.js";
import { createAtendimentoSchema, listAtendimentosQuerySchema, updateAtendimentoSchema, uuidParamSchema } from "../schemas/atendimento-schema.js";
import { formatValidationError } from "../tools/zod-error-formatter.js";
import type { ApiErrorResponse, ApiResponse } from "../interfaces/api-response.js";
import { DatabaseError } from "../errors/database-error.js";
import { ErrorCodes } from "../errors/error-codes.js";

export class AtentimentoController {

    constructor(private readonly service: AtendimentoService) { };

    create: RequestHandler = async (req, res) => {

        const validation = createAtendimentoSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error))
        }

        try {

            const atendimentoCreated = await this.service.create(validation.data);

            const response: ApiResponse<typeof atendimentoCreated> = {
                success: true,
                message: "Atendimento realizado.",
                data: atendimentoCreated,
                errors: []
            }

            return res.status(201).json(response);

        } catch (e) {

            let status = 500;

            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao adicionar atendimento.",
                data: null,
                errors: []
            }

            if (e instanceof DatabaseError && ErrorCodes.RegisterDoesNotExist) {

                response.message = "Serviço não encontrado.";
                response.errors = [{ field: "servico_id", messages: [e.message] }]
                status = 404;

            } else {
                console.error(e);
            }

            return res.status(status).json(response);

        }

    }

    list: RequestHandler = async (req, res) => {

        const validation = listAtendimentosQuerySchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(422).json(formatValidationError(validation.error));
        }

        try {

            const atendimentos = await this.service.list(validation.data);

            const response: ApiResponse<typeof atendimentos> = {
                success: true,
                message: "Atendimentos listados com sucesso.",
                data: atendimentos,
                errors: [],
            };

            return res.status(200).json(response);

        } catch (e) {

            console.error(e);

            const response: ApiErrorResponse = {
                success: false,
                message: "Não foi possível listar os atendimentos.",
                data: null,
                errors: []
            };

            return res.status(500).json(response);

        }

    }


    update: RequestHandler = async (req, res) => {

        const idValidation = uuidParamSchema.safeParse(req.params);

        if (!idValidation.success) {
            return res.status(422).json(formatValidationError(idValidation.error));
        }

        const dataValidation = updateAtendimentoSchema.safeParse(req.body);

        if (!dataValidation.success) {
            return res.status(422).json(formatValidationError(dataValidation.error));
        }

        try {

            const updatedAtendimento = await this.service.update(idValidation.data.id, dataValidation.data);

            const response: ApiResponse<typeof updatedAtendimento> = {
                success: true,
                message: "Atendimento atualizado com sucesso.",
                data: updatedAtendimento,
                errors: []
            }

            return res.status(200).json(response);

        } catch (e) {

            let status = 500;
            
            const response: ApiErrorResponse = {
                success: false,
                message: "Erro ao atualizar atendimento.",
                data: null,
                errors: []
            }

            if (e instanceof DatabaseError && e.errorCode === ErrorCodes.RegisterDoesNotExist) {
                status = 404;
                response.message = "Não foi possível atualizar o atendimento.";
                response.errors = [ {field: "servico_id", messages: [e.message] }];
            }

            return res.status(status).json(response);

        }
    }


}
