import * as z from "zod";
import { tipo_pagamento } from "../../generated/prisma/enums.js";


export const atendimentoIdParamSchema = z.object({
    id: z.uuid({ error: "O identificador do atendimento deve ser um UUID válido." })
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
    realizado_em: z.date(),
    valor_atendimento: valorAtendimentoParamSchema.optional(),
    metodo_pagamento: metodoPagamentoParamSchema.optional()
});

export const updateAtendimentoSchema = z.object({
    servico_id: z.uuid({error: "O identificador do serviço deve ser um UUID válido."}),
    valor_atendimento: valorAtendimentoParamSchema.optional(),
    metodo_pagamento: metodoPagamentoParamSchema.optional(),
    realizado_em: z.date().optional()
});


export type CreateAtendimentoInput = z.infer<typeof createAtendimentoSchema>;
export type ListAtendimentosQuery = z.infer<typeof listAtendimentosQuerySchema>;
export type UpdateAtendimentoInput = z.infer<typeof updateAtendimentoSchema>;
