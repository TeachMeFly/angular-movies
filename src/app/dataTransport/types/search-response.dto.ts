import { MovieItemDto } from './movie-item.dto';

export interface SearchResponseDto {
    Response: string;
    Search: MovieItemDto[];
    TotalResults: string;
}