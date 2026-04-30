import { Repository } from "typeorm";
import { Movie } from "../database/entities/movie.js";
import { ResourceConflictError } from "./error.js";

export class MovieUsecase {
    constructor(private movieRepository: Repository<Movie>) {}

    // 1. Créer un film
    async createMovie(data: { title: string; description?: string; durationInMinutes: number }): Promise<Movie> {
        try {
            const movie = this.movieRepository.create(data);
            return await this.movieRepository.save(movie);
        } catch (error: any) {
            // Si le titre du film existe déjà dans la base (Code d'erreur MySQL)
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                throw new ResourceConflictError("Un film avec ce titre existe déjà.");
            }
            throw error;
        }
    }

    // 2. Lister les films (avec pagination et recherche par titre)
    async listMovies(page: number = 1, size: number = 10, title?: string) {
        const query = this.movieRepository.createQueryBuilder("movie");
        
        if (title) {
            // Le LIKE permet de chercher un titre même s'il est incomplet
            query.andWhere("movie.title LIKE :title", { title: `%${title}%` });
        }
        
        query.skip((page - 1) * size);
        query.take(size);
        
        const [movies, totalCount] = await query.getManyAndCount();
        
        return {
            data: movies,
            page,
            pageSize: size,
            totalCount,
            totalPages: Math.ceil(totalCount / size)
        };
    }

    // 3. Récupérer un seul film par son ID
    async getMovie(id: number): Promise<Movie | null> {
        return await this.movieRepository.findOneBy({ id });
    }

    // 4. Mettre à jour un film
    async updateMovie(id: number, data: Partial<Movie>): Promise<Movie | null> {
        const movie = await this.getMovie(id);
        if (!movie) return null;
        
        Object.assign(movie, data);
        
        try {
            return await this.movieRepository.save(movie);
        } catch (error: any) {
            if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
                throw new ResourceConflictError("Un film avec ce titre existe déjà.");
            }
            throw error;
        }
    }

    // 5. DELETE
    async deleteMovie(id: number): Promise<void> {
        const movie = await this.getMovie(id);
        if (!movie) return;
        
        await this.movieRepository.delete(id);
    }
}