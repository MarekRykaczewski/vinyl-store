import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsString,
    Min,
    Max,
    IsNotEmpty,
    IsPositive,
} from 'class-validator';

export class CreateReviewDto {
  @ApiHideProperty()
  @IsInt() // Ensure vinylRecordId is an integer
  @IsPositive() // Ensure the vinylRecordId is positive
      vinylRecordId: number;

  @ApiProperty({
      description: 'The content of the review written by the user',
      example:
      'This vinyl record is fantastic! Great sound quality and packaging.',
  })
  @IsString() // Ensure content is a string
  @IsNotEmpty() // Ensure content is not empty
      content: string;

  @ApiProperty({
      description: 'The score or rating given to the vinyl record (1 to 5)',
      example: 5,
      minimum: 1,
      maximum: 5,
  })
  @IsInt() // Ensure score is an integer
  @Min(1) // Minimum score is 1
  @Max(5) // Maximum score is 5
      score: number;
}
