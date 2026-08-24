import { error } from "node:console";
import * as z from "zod";

const valorRetiradaParamSchema = z.
    number({
        error: (issue) => issue.input === undefined
            ? "O valor da retirada é obrigatório."
            : "O valor da retirada deve ser um número válido."
    })
    .positive()
    .multipleOf(0.01, { error: "O valor da retirada deve ter no máximo duas casas decimais." })
    .max(99_999_999.99, { error: "O valor da retirada deve ser menor ou igual a 99_999_999.99" })


const dataRetiradaParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "A data deve estar no formato 'aaaa-mm-dd'."
});

const destinoRetiradaParamSchema = z.enum(
    ["EMPRESA", "PESSOAL"],
    { error: "O destino da retirada deve ser do tipo 'EMPRESA' ou 'PESSOAL'." }
);

const createRetiradaSchema = z.object({
    valor_retirada: valorRetiradaParamSchema,
    destino_retirada: destinoRetiradaParamSchema,
    justificativa: z.string().max(80).optional()
});

const listRetiradaParamSchema = z.object({
    valor_max: z
        .string({ error: "O valor máximo deve ser especificado no formato 'texto'." })
        .trim()
        .min(1, { error: "O valor máximo deve ser especificado." })
        .transform(Number)
        .pipe(valorRetiradaParamSchema)
        .optional(),

    data_limite: z
        .string({ error: "A data limite deve ser especificada no formato 'texto'." })
        .trim()
        .length(10, { error: "A data limite deve ser um texto no formato 'aaaa-mm-dd'." })
        .pipe(dataRetiradaParamSchema)
        .optional(),

    destino: z
        .string({ error: "O destino deve ser especificado no formato 'texto'." })
        .trim()
        .length(7, { error: "O destino deve ser ter no máximo 7 (sete) caracteres." })
        .pipe(destinoRetiradaParamSchema)
        .optional()
});

export const retiradaIdParamSchema = z.object({
    id: z.uuid({ error: "O id deve ser um UUID válido." })
});

const updateRetiradaSchema = z
    .object({
        valor_retirada: valorRetiradaParamSchema.optional(),
        justificativa: z.string().max(80).optional(),
        realizada_em: z
            .string({ error: "A data deve ser especificada no formato 'texto'." })
            .trim()
            .length(10, { error: "A data limite deve ser especificada no formato 'texto'." })
            .pipe(dataRetiradaParamSchema)
            .optional()
    })
    .refine(
        (retirada) => retirada.valor_retirada !== undefined || retirada.justificativa !== undefined
            || retirada.realizada_em !== undefined,
        { error: "Ao menos um campo deve ser atualizado." }
    );

export type CreateRetiradaInput = z.infer<typeof createRetiradaSchema>;
export type ListRetiradaQueryInput = z.infer<typeof listRetiradaParamSchema>;
export type UpdateRetiradaInput = z.infer<typeof updateRetiradaSchema>;
