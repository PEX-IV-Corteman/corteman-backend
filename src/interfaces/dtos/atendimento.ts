import { Decimal } from "@prisma/client/runtime/index-browser";
import type { tipo_pagamento } from "../../../generated/prisma/enums.js";

export interface CreateAtendimentoResponse {
    atendimento_id: string,
    servico_id: string,
    valor_atendimento: Decimal,
    metodo_pagamento: tipo_pagamento,
    realizado_em: Date
}

export interface GetAtendimentoReponse {
    servico_id: string,
    valor_atendimento: Decimal,
    metodo_pagamento: tipo_pagamento,
    realizado_em: Date
}
