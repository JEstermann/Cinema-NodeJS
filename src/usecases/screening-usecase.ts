import { Repository } from "typeorm";
import { Screening } from "../database/entities/screening.js";
import { Room } from "../database/entities/room.js";
import { Movie } from "../database/entities/movie.js";
import { ResourceConflictError } from "./error.js";

export interface ListScreeningFilter {
    page: number;
    size: number;
    roomId?: number;
    movieId?: number;
}

export interface ListScreeningResponse {
    data: Screening[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export class ScreeningUsecase {
    constructor(
        private screeningRepository: Repository<Screening>,
        private roomRepository: Repository<Room>,
        private movieRepository: Repository<Movie>
    ) {}

    private computeEndAt(startAt: Date, durationInMinutes: number): Date {
        return new Date(startAt.getTime() + (durationInMinutes + 30) * 60 * 1000);
    }

    private async ensureNoOverlap(roomId: number, startAt: Date, endAt: Date, excludeId?: number): Promise<void> {
        const query = this.screeningRepository
            .createQueryBuilder("screening")
            .leftJoin("screening.room", "room")
            .where("room.id = :roomId", { roomId })
            .andWhere("screening.startAt < :endAt", { endAt })
            .andWhere("screening.endAt > :startAt", { startAt });

        if (excludeId !== undefined) {
            query.andWhere("screening.id != :excludeId", { excludeId });
        }

        const overlapping = await query.getOne();
        if (overlapping) {
            throw new ResourceConflictError("Chevauchement détecté pour cette salle");
        }
    }

    async createScreening(data: { roomId: number; movieId: number; startAt: string }): Promise<Screening> {
        const room = await this.roomRepository.findOneBy({ id: data.roomId });
        if (!room) {
            throw new Error("Salle introuvable");
        }

        const movie = await this.movieRepository.findOneBy({ id: data.movieId });
        if (!movie) {
            throw new Error("Film introuvable");
        }

        const startAt = new Date(data.startAt);
        const endAt = this.computeEndAt(startAt, movie.durationInMinutes);

        await this.ensureNoOverlap(room.id, startAt, endAt);

        const screening = this.screeningRepository.create({
            room,
            movie,
            startAt,
            endAt
        });

        return await this.screeningRepository.save(screening);
    }

    async listScreenings({ page, size, roomId, movieId }: ListScreeningFilter): Promise<ListScreeningResponse> {
        const query = this.screeningRepository
            .createQueryBuilder("screening")
            .leftJoinAndSelect("screening.room", "room")
            .leftJoinAndSelect("screening.movie", "movie")
            .orderBy("screening.startAt", "ASC");

        if (roomId !== undefined) {
            query.andWhere("room.id = :roomId", { roomId });
        }

        if (movieId !== undefined) {
            query.andWhere("movie.id = :movieId", { movieId });
        }

        query.skip((page - 1) * size);
        query.take(size);

        const [data, totalCount] = await query.getManyAndCount();
        return {
            data,
            page,
            pageSize: size,
            totalCount,
            totalPages: Math.ceil(totalCount / size)
        };
    }

    async getScreening(id: number): Promise<Screening | null> {
        return await this.screeningRepository.findOne({
            where: { id },
            relations: ["room", "movie"]
        });
    }

    async updateScreening(id: number, data: { roomId?: number; movieId?: number; startAt?: string }): Promise<Screening | null> {
        const screening = await this.getScreening(id);
        if (!screening) {
            return null;
        }

        const nextRoom = data.roomId
            ? await this.roomRepository.findOneBy({ id: data.roomId })
            : screening.room;
        if (!nextRoom) {
            throw new Error("Salle introuvable");
        }

        const nextMovie = data.movieId
            ? await this.movieRepository.findOneBy({ id: data.movieId })
            : screening.movie;
        if (!nextMovie) {
            throw new Error("Film introuvable");
        }

        const nextStartAt = data.startAt ? new Date(data.startAt) : screening.startAt;
        const nextEndAt = this.computeEndAt(nextStartAt, nextMovie.durationInMinutes);

        await this.ensureNoOverlap(nextRoom.id, nextStartAt, nextEndAt, screening.id);

        screening.room = nextRoom;
        screening.movie = nextMovie;
        screening.startAt = nextStartAt;
        screening.endAt = nextEndAt;

        return await this.screeningRepository.save(screening);
    }

    async deleteScreening(id: number): Promise<boolean> {
        const screening = await this.getScreening(id);
        if (!screening) {
            return false;
        }

        await this.screeningRepository.delete(id);
        return true;
    }
}
