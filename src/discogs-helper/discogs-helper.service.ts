import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DiscogsService {
    private readonly DISCOGS_API_URL = 'https://api.discogs.com/database/search';
    private readonly DISCOGS_API_TOKEN = process.env.DISCOGS_API_TOKEN;

    async fetchRandomRecords(limit: number) {
        const params = {
            token: this.DISCOGS_API_TOKEN,
            type: 'release',
            per_page: 50,
            page: 1,
        };

        try {
            const response = await axios.get(this.DISCOGS_API_URL, { params });
            const records = response.data.results;

            // Shuffle and select random records
            const selectedRecords = this.shuffle(records).slice(0, limit);
            return selectedRecords;
        } catch (error) {
            console.error('Error fetching records:', error);
            return [];
        }
    }

    private shuffle(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
