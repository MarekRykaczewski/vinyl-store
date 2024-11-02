export class UserProfileDto {
    firstName: string;
    lastName: string;
    birthdate: Date;
    avatar?: string;
    reviews?: any[];
    purchasedVinylRecords?: any[];
}
