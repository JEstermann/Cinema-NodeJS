/**
 * @openapi
 * components:
 *   schemas:
 *     AuthCredentialsRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *           minLength: 8
 *     RefreshTokenBody:
 *       type: object
 *       required:
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *     AuthLoginResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *         refreshToken:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             email:
 *               type: string
 *             role:
 *               type: string
 *     RefreshAccessResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *     AuthMessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */
export {};
