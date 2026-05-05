/**
 * @openapi
 * components:
 *   schemas:
 *     WalletAmountRequest:
 *       type: object
 *       required:
 *         - amount
 *       properties:
 *         amount:
 *           type: number
 *           format: float
 *           example: 25.5
 *     WalletTransactionResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAW]
 *         amount:
 *           type: number
 *         balanceAfter:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 */
export interface WalletAmountRequest {
    amount: number;
}
