import { PartialType } from '@nestjs/mapped-types';
import { CreateVinylRecordDto } from './create-vinyl-record.dto';

export class UpdateVinylRecordDto extends PartialType(CreateVinylRecordDto) {}
