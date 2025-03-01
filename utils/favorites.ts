import AsyncStorage from '@react-native-async-storage/async-storage';
import { Annonce } from '@/data/annonces';

const FAVORITES_KEY = 'annonce_favorites';

export const loadFavorites = async (): Promise<string[]> => {
  try {
    const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

export const toggleFavorite = async (
  annonceId: string,
  currentFavorites: string[],
): Promise<string[]> => {
  try {
    const newFavorites = currentFavorites.includes(annonceId)
      ? currentFavorites.filter(id => id !== annonceId)
      : [...currentFavorites, annonceId];

    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (error) {
    console.error('Error updating favorites:', error);
    return currentFavorites;
  }
};

// Get all favorite annonces
export const getFavoriteAnnonces = async (allAnnonces: Annonce[]): Promise<Annonce[]> => {
  const favoriteIds = await loadFavorites();
  return allAnnonces.filter(annonce => favoriteIds.includes(annonce.id));
};
