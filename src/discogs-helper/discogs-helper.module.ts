import { Module } from '@nestjs/common';
import { DiscogsService } from './discogs-helper.service';

@Module({
    providers: [DiscogsService]
})
export class DiscogsHelperModule {}
