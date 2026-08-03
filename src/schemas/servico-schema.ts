import * as z from "zod";

const nomeServicoSchema = z
    .string({
        error: (issue) => issue.input === undefined
            ? "O nome do serviço é obrigatório."
            : "O nome do serviço deve ser um texto."
    })
    .trim()
    .min(1, { error: "O nome do serviço é obrigatório." })
    .max(80, { error: "O nome do serviço deve ter no máximo 80 caracteres." });

const valorServicoSchema = z
    .number({
        error: (issue) => issue.input === undefined
            ? "O valor do serviço é obrigatório."
            : "O valor do serviço deve ser um número."
    })
    .positive({ error: "O valor do serviço deve ser maior que zero." })
    .multipleOf(0.01, { error: "O valor do serviço deve ter no máximo duas casas decimais." })
    .max(99_999_999.99, { error: "O valor do serviço deve ser menor ou igual a 99.999.999,99." });

const createServicoSchema = z.object({
    nome_servico: nomeServicoSchema,
    valor_servico: valorServicoSchema
});

const updateServicoSchema = z
    .object({
        nome_servico: nomeServicoSchema.optional(),
        valor_servico: valorServicoSchema.optional()
    })
    .refine(
        (servico) => servico.nome_servico !== undefined || servico.valor_servico !== undefined,
        { error: "Informe ao menos um campo para atualizar." }
    );

const servicoIdParamsSchema = z.object({
    id: z.uuid({ error: "O identificador do serviço deve ser um UUID válido." })
});

type CreateServicoInput = z.infer<typeof createServicoSchema>;
type UpdateServicoInput = z.infer<typeof updateServicoSchema>;

export { createServicoSchema, servicoIdParamsSchema, updateServicoSchema };
export type { CreateServicoInput, UpdateServicoInput };
