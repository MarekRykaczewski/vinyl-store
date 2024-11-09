import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsUrl,
    IsDateString,
} from 'class-validator';

export class VinylRecordDto {
  @ApiProperty({
      description: 'The unique identifier of the vinyl record',
      example: 1,
  })
  @IsInt() // Ensure id is an integer
      id: number;

  @ApiProperty({
      description: 'The title or name of the vinyl record',
      example: 'Abbey Road',
  })
  @IsString() // Ensure name is a string
  @IsNotEmpty() // Ensure name is not empty
      name: string;

  @ApiProperty({
      description: 'The name of the artist or author of the vinyl record',
      example: 'The Beatles',
  })
  @IsString() // Ensure authorName is a string
  @IsNotEmpty() // Ensure authorName is not empty
      authorName: string;

  @ApiProperty({
      description: 'A detailed description of the vinyl record',
      example: 'A classic album by The Beatles, released in 1969.',
  })
  @IsString() // Ensure description is a string
  @IsNotEmpty() // Ensure description is not empty
      description: string;

  @ApiProperty({
      description: 'The price of the vinyl record in USD',
      example: 19.99,
  })
  @IsNumber() // Ensure price is a number
  @IsPositive() // Ensure price is a positive number
      price: number;

  @ApiProperty({
      description: 'The URL to the image or cover art of the vinyl record',
      example: 'https://example.com/abbey-road.jpg',
  })
  @IsUrl() // Ensure imageUrl is a valid URL
      imageUrl: string;

  @ApiProperty({
      description:
      'The date and time when the vinyl record was created or added to the system',
      example: '2024-11-09T12:34:56.789Z',
  })
  @IsDateString() // Ensure createdAt is a valid ISO date string
      createdAt: Date;
}
