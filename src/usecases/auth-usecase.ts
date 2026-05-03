import { Repository } from "typeorm";
import { User } from "../database/entities/user.js";
import { Token } from "../database/entities/token.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthUsecase {
    constructor(
        private userRepository: Repository<User>,
        private tokenRepository: Repository<Token>
    ) {}

    async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) throw new Error("Identifiants invalides");

        const isValid = await compare(password, user.password);
        if (!isValid) throw new Error("Identifiants invalides");

        const accessSecret = process.env.JWT_SECRET as string;
        const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

        const accessToken = jwt.sign(
            { userId: user.id, role: user.role }, 
            accessSecret, 
            { expiresIn: '5m' }
        );

        const refreshTokenStr = jwt.sign(
            { userId: user.id }, 
            refreshSecret, 
            { expiresIn: '7d' }
        );

        const tokenEntity = this.tokenRepository.create({ 
            token: refreshTokenStr, 
            user: user 
        });
        await this.tokenRepository.save(tokenEntity);

        return { 
            accessToken, 
            refreshToken: refreshTokenStr,
            user: { 
                id: user.id, 
                email: user.email, 
                role: user.role 
            }
        };
    }

    async logout(refreshToken: string): Promise<void> {
        await this.tokenRepository.delete({ token: refreshToken });
    }

    async refresh(refreshToken: string): Promise<{ accessToken: string }> {
        const tokenRecord = await this.tokenRepository.findOne({ 
            where: { token: refreshToken },
            relations: ["user"] 
        });
        if (!tokenRecord) throw new Error("Refresh token invalide ou session expirée");

        const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
        try {
            jwt.verify(refreshToken, refreshSecret);
        } catch (err) {
            await this.tokenRepository.delete({ token: refreshToken });
            throw new Error("Session expirée");
        }

        const accessSecret = process.env.JWT_SECRET as string;
        const accessToken = jwt.sign(
            { userId: tokenRecord.user.id, role: tokenRecord.user.role }, 
            accessSecret, 
            { expiresIn: '5m' }
        );

        return { accessToken };
    }
}