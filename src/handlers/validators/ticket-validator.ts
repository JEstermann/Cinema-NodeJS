import Joi from "joi";
import { BuySimpleTicketRequest, UseTicketRequest } from "../requests/ticket-request.js";

export const BuySimpleTicketValidator = Joi.object<BuySimpleTicketRequest>({
    screeningId: Joi.number().integer().min(1).required()
}).options({ abortEarly: false });

export const UseTicketValidator = Joi.object<UseTicketRequest>({
    ticketId: Joi.number().integer().min(1).required(),
    screeningId: Joi.number().integer().min(1).required()
}).options({ abortEarly: false });

export const TicketIdParamValidator = Joi.object({
    id: Joi.number().integer().min(1).required()
}).options({ abortEarly: false });
