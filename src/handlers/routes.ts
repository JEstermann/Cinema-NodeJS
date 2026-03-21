import { Application } from "express";
import { CreateRoom, GetRoom, ListRooms, UpdateRoom, DeleteRoom } from "./room-handler.js";

export const initHandlers = (app: Application) => {
    /**
     * @openapi
     * /rooms:
     *   post:
     *     tags:
     *       - Rooms
     *     summary: Create a new room
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateRoomRequest'
     *     responses:
     *       201:
     *         description: Room created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RoomResponse'
     *       400:
     *         description: Validation error
     *       409:
     *         description: Name already taken
     */
    app.post("/rooms", CreateRoom)

    /**
     * @openapi
     * /rooms:
     *   get:
     *     tags:
     *       - Rooms
     *     summary: List rooms with pagination and filters
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: size
     *         schema:
     *           type: integer
     *       - in: query
     *         name: name
     *         schema:
     *           type: string
     *       - in: query
     *         name: capacityMax
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: List of rooms
     */
    app.get("/rooms", ListRooms)

    /**
     * @openapi
     * /rooms/{id}:
     *   get:
     *     tags:
     *       - Rooms
     *     summary: Get a room by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Room found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/RoomResponse'
     *       404:
     *         description: Room not found
     */
    app.get("/rooms/:id", GetRoom)

    /**
     * @openapi
     * /rooms/{id}:
     *   patch:
     *     tags:
     *       - Rooms
     *     summary: Update a room
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateRoomRequest'
     *     responses:
     *       200:
     *         description: Room updated successfully
     *       404:
     *         description: Room not found
     *       409:
     *         description: Name already taken
     */
    app.patch("/rooms/:id", UpdateRoom)

    /**
     * @openapi
     * /rooms/{id}:
     *   delete:
     *     tags:
     *       - Rooms
     *     summary: Delete a room
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Room deleted successfully
     *       404:
     *         description: Room not found
     */
    app.delete("/rooms/:id", DeleteRoom)
}