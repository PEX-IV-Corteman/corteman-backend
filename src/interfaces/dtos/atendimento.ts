import { Decimal } from "@prisma/client/runtime/index-browser";
import type { tipo_pagamento } from "../../../generated/prisma/enums.js";

export interface CreateAtendimentoResponse {
    atendimento_id: string,
    servico_id: string,
    valor_atendimento: number,
    metodo_pagamento: tipo_pagamento,
    realizado_em: string
}

export interface GetAtendimentoResponse {
    atendimento_id: string,
    servico_id: string,
    valor_atendimento: number,
    metodo_pagamento: tipo_pagamento,
    realizado_em: string
}

export interface UpdateAtendimentoResponse {
    atendimento_id: string,
    servico_id: string,
    valor_atendimento: number,
    metodo_pagamento: tipo_pagamento
    realizado_em: string
}
