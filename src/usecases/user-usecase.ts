import { Repository } from "typeorm";
import { User } from "../database/entities/user.js";
import { hash } from "bcrypt";
import { ResourceConflictError } from "./error.js";

export class UserUsecase {
    constructor(private userRepository: Repository<User>) {}

    async signup(data: { email: string; password: string }): Promise<Omit<User, 'password'>> {
        const hashedPassword = await hash(data.password, 10);
        
        const user = this.userRepository.create({
            email: data.email,
            password: hashedPassword
        });

        try {
            const savedUser = await this.userRepository.save(user);
            // On retire le mot de passe avant de renvoyer l'objet pour éviter les fuites
            const { password, ...userWithoutPassword } = savedUser;
            return userWithoutPassword;
        } catch (error: any) {
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                throw new ResourceConflictError("Cet email est déjà utilisé.");
            }
            throw error;
        }
    }
}