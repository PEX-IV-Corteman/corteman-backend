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
        .multipleOf(0.01, { error: "O valor do serviço deve ter no máximo duas casas decimais." })
        .max(99_999_999.99, { error: "O valor do serviço deve ser menor ou igual a 99.999.999,99." })
});

type CreateServicoInput = z.infer<typeof createServicoSchema>;

export { createServicoSchema };
export type { CreateServicoInput };
