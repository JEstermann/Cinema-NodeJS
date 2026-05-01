import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    userId: number;
    role: "CLIENT" | "ADMIN" | "SUPER_ADMIN";
    iat?: number;
    exp?: number;
}

interface CustomRequest extends Request {
    user?: JwtPayload;
}


export const AuthMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send({ error: "Accès refusé. Aucun token fourni." });
    }

    try {
       
        const secret = process.env.JWT_SECRET as string;
        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.user = decoded; 

        next();
    } catch (error) {
        return res.status(403).send({ error: "Token invalide ou expiré." });
    }
};

// Autorise uniquement certains rôles (ex: ADMIN)
export const RoleMiddleware = (roles: string[]) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user || !roles.includes(user.role)) {
            return res.status(403).send({ error: "Accès interdit : privilèges insuffisants." });
        }
        next();
    };
};