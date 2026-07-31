import { ServicoService } from "../services/servico-service.js";
import type { RequestHandler } from "express";
import { ErrorCodes } from "../errors/error-codes.js";
import { isCreateServicoBodyValid, isFilterBodyValid, isUpdateServicoBodyValid } from "../tools/servico-validation.js";
import { DatabaseError } from "../errors/database-error.js";

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

            if (e instanceof DatabaseError) {

                if (e.errorCode = ErrorCodes.RegisterAlreadyExists) {
                    return res.status(409).json({ message: e.message });
                }

                return res.status(500).json({ message: e.message });

            }

            return res.status(500).json({ message: "Erro ao criar serviço." });

        }
        
    }

    get: RequestHandler = async (req, res) => {

        try {

            const servicos = await this.servicoService.get();
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

        const servicoData = req.body;

        if (!isFilterBodyValid(servicoData)) {
            return res.status(400).json({ message: "Filtros inválidos ou não fornecidos." });
        }

        try {

            const servicos = await this.servicoService.filter(servicoData);
            return res.status(200).json({ servicos });

        } catch (e) {

            return res.status(500).json({ message: "Erro ao filtrar serviços." });

        }

    }

}
