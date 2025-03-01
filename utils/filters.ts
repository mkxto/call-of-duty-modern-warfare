import { Annonce } from '@/data/annonces';

export interface FilterOptions {
    selectedConstructors: string[];
    selectedOS: string[];
    yearRange: {
        start: number;
        end: number;
    };
    priceRange: {
        min: number;
        max: number;
    };
}

export const getUniqueConstructors = (annonces: Annonce[]): string[] => {
    const constructorSet = new Set<string>();
    annonces.forEach(annonce => {
        constructorSet.add(annonce.constructor);
    });
    return Array.from(constructorSet).sort();
};

export const getUniqueOS = (annonces: Annonce[]): string[] => {
    const osSet = new Set<string>();
    annonces.forEach(annonce => {
        osSet.add(annonce.os);
    });
    return Array.from(osSet).sort();
};

export const getYearRange = (annonces: Annonce[]): { min: number; max: number } => {
    const years = annonces.map(annonce => annonce.releaseDate);
    return {
        min: Math.min(...years),
        max: Math.max(...years),
    };
};

export const getPriceRange = (annonces: Annonce[]): { min: number; max: number } => {
    const prices = annonces.map(annonce => annonce.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices),
    };
};

export const filterAnnonces = (
    annonces: Annonce[],
    filters: FilterOptions,
    searchQuery: string = '',
): Annonce[] => {
    return annonces.filter(annonce => {
        // Apply constructor filter
        const constructorMatch =
            filters.selectedConstructors.length === 0 ||
            filters.selectedConstructors.includes(annonce.constructor);

        // Apply OS filter
        const osMatch =
            filters.selectedOS.length === 0 ||
            filters.selectedOS.includes(annonce.os);

        // Apply year filter
        const yearMatch =
            annonce.releaseDate >= filters.yearRange.start &&
            annonce.releaseDate <= filters.yearRange.end;

        // Apply price filter
        const priceMatch =
            annonce.price >= filters.priceRange.min &&
            annonce.price <= filters.priceRange.max;

        // Apply search query
        const searchMatch =
            searchQuery === '' ||
            annonce.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            annonce.constructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            annonce.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
            annonce.saler.toLowerCase().includes(searchQuery.toLowerCase()) ||
            annonce.description.toLowerCase().includes(searchQuery.toLowerCase());

        return constructorMatch && osMatch && yearMatch && priceMatch && searchMatch;
    });
}; 
