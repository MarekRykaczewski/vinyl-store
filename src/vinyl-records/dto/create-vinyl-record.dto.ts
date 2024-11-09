import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsUrl,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class CreateVinylRecordDto {
  @ApiProperty({
      description: 'The name of the artist or author of the vinyl record',
      example: 'The Beatles',
  })
  @IsString() // Ensure authorName is a string
  @IsNotEmpty() // Ensure authorName is not empty
      authorName: string;

  @ApiProperty({
      description: 'The name or title of the vinyl record',
      example: 'Abbey Road',
  })
  @IsString() // Ensure name is a string
  @IsNotEmpty() // Ensure name is not empty
      name: string;

  @ApiProperty({
      description: 'A detailed description of the vinyl record',
      example: 'A classic album by The Beatles, released in 1969.',
  })
  @IsString() // Ensure description is a string
  @IsNotEmpty() // Ensure description is not empty
      description: string;

  @ApiProperty({
      description: 'The URL to the image or cover art of the vinyl record',
      example: 'https://example.com/abbey-road.jpg',
  })
  @IsUrl() // Ensure imageUrl is a valid URL
      imageUrl: string;

  @ApiProperty({
      description: 'The price of the vinyl record in USD',
      example: 19.99,
  })
  @IsNumber() // Ensure price is a number
  @IsPositive() // Ensure price is a positive number
      price: number;
}
