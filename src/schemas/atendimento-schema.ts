import * as z from "zod";

export const atendimentoIdParamSchema = z.object({
    id: z.uuid({ error: "O identificador do atendimento deve ser um UUID válido." })
});

export const atendimentoDateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    error: "A data deve estar no formato 'aaaa-mm-dd'."
});

const metodoPagamentoParamSchema = z.enum(
    ["PIX", "CARTAO", "DINHEIRO"],
    { error: "O método de pagamento deve ser do tipo 'PIX', 'CARTÃO' ou 'DINHEIRO'." }
);

const valorAtendimentoParamSchema = z.
    number({
        error: (issue) => issue.input === undefined
            ? "O valor do atendimento é obrigatório."
            : "O valor do atendimento deve ser um número."
    })
    .positive()
    .multipleOf(0.01, { error: "O valor do atentimento deve ter no máximo duas casas decimais." })
    .max(99_999_999.99, { error: "O valor do atendimento deve ser menor ou igual a 99.999.999,99" })


export const createAtendimentoSchema = z.object({
    servico_id: z.uuid({ error: "O identificador do serviço deve ser um UUID válido." }),
    valor_atendimento: valorAtendimentoParamSchema,
    metodo_pagamento: metodoPagamentoParamSchema,
});

export const listAtendimentosQuerySchema = z.object({
    data_limite: z
        .string({error: "A data limite deve ser especificada no formato 'texto'."})
        .trim()
        .min(10, {error: "A data limite deve ser um texto no formato 'aaaa-mm-dd'."})
        .pipe(atendimentoDateParamSchema)
        .optional(),
    valor_max: z
        .string({error: "O valor máximo deve ser especificado no formato 'texto'."})
        .trim()
        .min(1, {error: "O valor máximo não pode estar vazido."})
        .transform(Number)
        .pipe(valorAtendimentoParamSchema)
        .optional(),
    metodo_pagamento: z
        .string({error: "O método de pagamento deve ser especificado no formato 'texto'."})
        .trim()
        .min(3, {error: "O método de pagamento deve conter no mínimo 3 letras."})
        .toUpperCase()
        .pipe(metodoPagamentoParamSchema)
        .optional()
});

export const updateAtendimentoSchema = z.object({
    servico_id: z.uuid({error: "O identificador do serviço deve ser um UUID válido."}),
    valor_atendimento: valorAtendimentoParamSchema.optional(),
    metodo_pagamento: metodoPagamentoParamSchema.optional(),
    realizado_em: z.string().optional()
});


export type CreateAtendimentoInput = z.infer<typeof createAtendimentoSchema>;
export type ListAtendimentosQuery = z.infer<typeof listAtendimentosQuerySchema>;
export type UpdateAtendimentoInput = z.infer<typeof updateAtendimentoSchema>;
