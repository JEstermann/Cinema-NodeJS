/**
 * @openapi
 * components:
 *   schemas:
 *     BuySimpleTicketRequest:
 *       type: object
 *       required:
 *         - screeningId
 *       properties:
 *         screeningId:
 *           type: integer
 *           example: 1
 *     UseTicketRequest:
 *       type: object
 *       required:
 *         - ticketId
 *         - screeningId
 *       properties:
 *         ticketId:
 *           type: integer
 *         screeningId:
 *           type: integer
 */
export interface BuySimpleTicketRequest {
    screeningId: number;
}

export interface UseTicketRequest {
    ticketId: number;
    screeningId: number;
}
