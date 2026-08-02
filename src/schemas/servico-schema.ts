import * as z from "zod";

const createServicoSchema = z.object({
    nome_servico: z
        .string({
            error: (issue) => issue.input === undefined
                ? "O nome do serviço é obrigatório."
                : "O nome do serviço deve ser um texto."
        })
        .trim()
        .min(1, { error: "O nome do serviço é obrigatório." })
        .max(80, { error: "O nome do serviço deve ter no máximo 80 caracteres." }),
    valor_servico: z
        .number({
            error: (issue) => issue.input === undefined
                ? "O valor do serviço é obrigatório."
                : "O valor do serviço deve ser um número."
        })
        .positive({ error: "O valor do serviço deve ser maior que zero." })
});

type CreateServicoInput = z.infer<typeof createServicoSchema>;

export { createServicoSchema };
export type { CreateServicoInput };
