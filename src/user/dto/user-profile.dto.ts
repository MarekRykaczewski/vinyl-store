import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsDateString,
    IsOptional,
    IsArray,
    IsUrl,
    IsInstance,
    ArrayNotEmpty,
} from 'class-validator';
import { Review } from 'src/review/entities/review.entity';

export class UserProfileDto {
  @ApiProperty({
      description: 'The first name of the user',
      example: 'John',
  })
  @IsString() // Ensure it's a string
      firstName: string;

  @ApiProperty({
      description: 'The last name of the user',
      example: 'Doe',
  })
  @IsString() // Ensure it's a string
      lastName: string;

  @ApiProperty({
      description: 'The birthdate of the user',
      example: '1990-01-01',
  })
  @IsDateString() // Ensure it's a valid date string
      birthdate: Date;

  @ApiProperty({
      description: 'URL or path to the user\'s avatar image (optional)',
      example: 'https://example.com/avatar.jpg',
      required: false,
  })
  @IsOptional()
  @IsUrl() // Ensure it's a valid URL
      avatar?: string;

  @ApiProperty({
      description: 'A list of reviews by the user (optional)',
      type: [Review],
      required: false,
  })
  @IsOptional()
  @IsArray() // Ensure it's an array
  @ArrayNotEmpty() // Ensure the array is not empty (optional, if needed)
  @IsInstance(Review, { each: true }) // Ensure each item in the array is an instance of Review
      reviews?: Review[];

  @ApiProperty({
      description: 'A list of vinyl records purchased by the user (optional)',
      type: [Review],
      required: false,
  })
  @IsOptional()
  @IsArray() // Ensure it's an array
  @ArrayNotEmpty() // Ensure the array is not empty (optional, if needed)
  @IsInstance(Review, { each: true }) // Ensure each item in the array is an instance of Review (adjust this if it's not the case)
      purchasedVinylRecords?: Review[];
}
