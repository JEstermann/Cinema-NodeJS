import Joi from "joi";
import { WalletAmountRequest } from "../requests/wallet-request.js";

export const WalletAmountValidator = Joi.object<WalletAmountRequest>({
    amount: Joi.number().positive().precision(2).required()
}).options({ abortEarly: false });
