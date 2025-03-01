import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/constants/useTheme';
import FilterModal from '@/components/FilterModal';
import { AnnonceCard } from '@/components/AnnonceCard';
import { Annonce, loadAnnonces } from '@/data/annonces';
import { loadFavorites, toggleFavorite } from '@/utils/favorites';
import {
  FilterOptions,
  filterAnnonces,
  getPriceRange,
  getYearRange
} from '@/utils/filters';

export default function AnnoncesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [filteredAnnonces, setFilteredAnnonces] = useState<Annonce[]>([]);
  const [totalAnnonces, setTotalAnnonces] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>(() => {
    // We'll initialize with empty values and update once data is loaded
    return {
      selectedConstructors: [],
      selectedOS: [],
      yearRange: {
        start: 2000,
        end: 2023,
      },
      priceRange: {
        min: 0,
        max: 2000,
      },
    };
  });

  const { colors } = useTheme();

  // Initial data load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const result = await loadAnnonces(1, 20);
      setAnnonces(result.data);
      setFilteredAnnonces(result.data);
      setTotalAnnonces(result.total);

      // Initialize filters with actual data ranges
      if (result.data.length > 0) {
        const { min: minYear, max: maxYear } = getYearRange(result.data);
        const { min: minPrice, max: maxPrice } = getPriceRange(result.data);

        setFilters({
          selectedConstructors: [],
          selectedOS: [],
          yearRange: {
            start: minYear,
            end: maxYear,
          },
          priceRange: {
            min: minPrice,
            max: maxPrice,
          },
        });
      }

      setHasMoreData(result.data.length < result.total);
    } catch (error) {
      console.error('Error loading annonces:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load more data when scrolling
  const loadMoreData = async () => {
    if (!hasMoreData || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await loadAnnonces(nextPage, 20);

      if (result.data.length > 0) {
        setAnnonces(prev => [...prev, ...result.data]);
        setPage(nextPage);
        setHasMoreData(annonces.length + result.data.length < result.total);

        // Apply current filters to the new data
        applyFilters();
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('Error loading more annonces:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Apply filters to the data
  const applyFilters = useCallback(() => {
    const filtered = filterAnnonces(annonces, filters, searchQuery);
    setFilteredAnnonces(filtered);
  }, [annonces, filters, searchQuery]);

  // Update filtered annonces when filters or search query changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites().then(setFavorites);
    }, []),
  );

  const handleToggleFavorite = async (annonceId: string) => {
    const newFavorites = await toggleFavorite(annonceId, favorites);
    setFavorites(newFavorites);
  };

  const handleImageError = (annonceId: string) => {
    console.error(`Failed to load image for annonce ${annonceId}`);
    setImageLoadErrors(prev => ({ ...prev, [annonceId]: true }));
  };

  const renderAnnonce = ({ item }: { item: Annonce }) => (
    <AnnonceCard
      annonce={item}
      isFavorite={favorites.includes(item.id)}
      onToggleFavorite={handleToggleFavorite}
      imageLoadError={imageLoadErrors[item.id]}
      onImageError={handleImageError}
      from="annonces"
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={colors.tint} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading more annonces...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.backgroundSecondary }]}>
          <FontAwesome
            name="search"
            size={20}
            color={colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search annonces..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <FontAwesome name="times-circle" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: colors.backgroundSecondary }]}
          onPress={() => setIsFilterModalVisible(true)}
        >
          <FontAwesome name="sliders" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.resultsInfo, { borderBottomColor: colors.border }]}>
        <Text style={[styles.resultsText, { color: colors.text }]}>
          {filteredAnnonces.length} annonces found {searchQuery ? `for "${searchQuery}"` : ''}
          {filteredAnnonces.length !== totalAnnonces ? ` (${totalAnnonces} total)` : ''}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading annonces...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAnnonces}
          renderItem={renderAnnonce}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No annonces found. Try adjusting your filters.
              </Text>
            </View>
          }
        />
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        annonces={annonces}
        currentFilters={filters}
        onApplyFilters={setFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    padding: 5,
  },
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  filterButton: {
    alignItems: 'center',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    marginLeft: 10,
    width: 40,
  },
  listContainer: {
    padding: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    fontSize: 16,
    marginLeft: 10,
  },
  resultsInfo: {
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  resultsText: {
    fontSize: 14,
  },
  searchContainer: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
  searchInputContainer: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
