import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/useTheme';
import { AnnonceCard } from '@/components/AnnonceCard';
import { Annonce, loadAnnonces } from '@/data/annonces';
import { loadFavorites, toggleFavorite } from '@/utils/favorites';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteAnnonces, setFavoriteAnnonces] = useState<Annonce[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  // Load favorites and annonces data
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Load favorite IDs
          const favoriteIds = await loadFavorites();
          setFavorites(favoriteIds);

          if (favoriteIds.length > 0) {
            // Load all annonces to filter favorites
            const result = await loadAnnonces(1, 1000); // Load a large batch to ensure we get all favorites
            const annoncesMap = new Map(result.data.map(annonce => [annonce.id, annonce]));

            // Filter annonces that are in favorites
            const favoriteAnnoncesList = favoriteIds
              .map(id => annoncesMap.get(id))
              .filter((annonce): annonce is Annonce => annonce !== undefined);

            setFavoriteAnnonces(favoriteAnnoncesList);
          } else {
            setFavoriteAnnonces([]);
          }
        } catch (error) {
          console.error('Error loading favorite annonces:', error);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }, []),
  );

  const handleToggleFavorite = async (annonceId: string) => {
    const newFavorites = await toggleFavorite(annonceId, favorites);
    setFavorites(newFavorites);

    // Remove the annonce from the list if it was unfavorited
    if (!newFavorites.includes(annonceId)) {
      setFavoriteAnnonces(prev => prev.filter(annonce => annonce.id !== annonceId));
    }
  };

  const handleImageError = (annonceId: string) => {
    console.error(`Failed to load image for annonce ${annonceId}`);
    setImageLoadErrors(prev => ({ ...prev, [annonceId]: true }));
  };

  const renderAnnonce = ({ item }: { item: Annonce }) => (
    <AnnonceCard
      annonce={item}
      isFavorite={true}
      onToggleFavorite={handleToggleFavorite}
      imageLoadError={imageLoadErrors[item.id]}
      onImageError={handleImageError}
      from="favorites"
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading favorites...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {favoriteAnnonces.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No favorite annonces yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteAnnonces}
          renderItem={renderAnnonce}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  listContainer: {
    padding: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
  },
});
