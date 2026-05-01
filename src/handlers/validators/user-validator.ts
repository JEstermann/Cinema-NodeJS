/**
 * @openapi
 * components:
 *   schemas:
 *     AuthRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: "test@cinema.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "monChat123"
 */

import Joi from "joi";
export const AuthValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
}).options({ abortEarly: false });