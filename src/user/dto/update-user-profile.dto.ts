import { ApiProperty } from '@nestjs/swagger';
import {
    IsString,
    IsOptional,
    IsDateString,
    IsUrl,
    MaxLength,
} from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
      description: 'The updated first name of the user (optional)',
      example: 'Jane',
      required: false,
  })
  @IsOptional() // Make it optional
  @IsString() // Ensure it's a string
  @MaxLength(50) // Optionally limit the length
      firstName?: string;

  @ApiProperty({
      description: 'The updated last name of the user (optional)',
      example: 'Doe',
      required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
      lastName?: string;

  @ApiProperty({
      description: 'The updated birthdate of the user (optional)',
      example: '1991-05-15',
      required: false,
  })
  @IsOptional()
  @IsDateString() // Ensure the format is a valid date string
      birthdate?: Date;

  @ApiProperty({
      description:
      'The updated URL or path to the user\'s avatar image (optional)',
      example: 'https://example.com/avatar2.jpg',
      required: false,
  })
  @IsOptional()
  @IsUrl() // Ensure it's a valid URL
      avatar?: string;
}
