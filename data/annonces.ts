export interface Annonce {
    id: string;
    model: string;
    constructor: string;
    os: string;
    releaseDate: number;
    salerAvatar: string;
    saler: string;
    description: string;
    salerGender: string;
    salerCity: string;
    salerCountry: string;
    phone: string;
    price: number;
}

// Import the phone data directly
import phoneData from './phone.json';

// We'll load the data from phone.json dynamically
// This is just a placeholder for the type
export const annonces: Annonce[] = [];

// Function to load annonces with pagination
export const loadAnnonces = async (
    page: number = 1,
    limit: number = 20
): Promise<{ data: Annonce[], total: number }> => {
    try {
        // In a real app, this would be an API call with pagination
        // For this example, we'll use the imported data and paginate in memory
        const allAnnonces: Annonce[] = phoneData;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedAnnonces = allAnnonces.slice(startIndex, endIndex);

        return {
            data: paginatedAnnonces,
            total: allAnnonces.length
        };
    } catch (error) {
        console.error('Error loading annonces:', error);
        return { data: [], total: 0 };
    }
}; 
