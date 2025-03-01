import { FontAwesome } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/constants/useTheme';
import { Annonce } from '@/data/annonces';
import phoneData from '@/data/phone.json';
import { loadFavorites, toggleFavorite } from '@/utils/favorites';

export default function AnnonceDetailScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();
  const { colors } = useTheme();

  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    // This effect is used to update the header back button text
    // The actual implementation is in _layout.tsx
  }, [from]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load favorites
        const favoriteIds = await loadFavorites();
        setFavorites(favoriteIds);

        // Find the annonce directly from the imported data
        const foundAnnonce = phoneData.find((a: Annonce) => a.id === id);

        if (foundAnnonce) {
          setAnnonce(foundAnnonce);
        } else {
          Alert.alert('Error', 'Annonce not found');
        }
      } catch (error) {
        console.error('Error loading annonce:', error);
        Alert.alert('Error', 'Failed to load annonce details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!annonce) return;

    const newFavorites = await toggleFavorite(annonce.id, favorites);
    setFavorites(newFavorites);
  };

  const handleCallSeller = () => {
    if (annonce?.phone) {
      Linking.openURL(`tel:${annonce.phone}`);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  if (loading || !annonce) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Loading...',
            headerBackTitle: from === 'favorites' ? 'Favorites' : 'Annonces'
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading annonce details...
          </Text>
        </View>
      </View>
    );
  }

  const isFavorite = favorites.includes(annonce.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: annonce.model,
          headerBackTitle: from === 'favorites' ? 'Favorites' : 'Annonces',
          headerRight: () => (
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.favoriteButton}>
              <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={24}
                color={isFavorite ? colors.heartActive : colors.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.infoContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.modelName, { color: colors.text }]}>
              {annonce.model}
            </Text>
            <Text style={[styles.releaseYear, { color: colors.textSecondary }]}>
              ({annonce.releaseDate})
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.tint }]}>
              {annonce.price.toFixed(2)} €
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text style={[styles.specLabel, { color: colors.textSecondary }]}>
              Constructor:
            </Text>
            <Text style={[styles.specValue, { color: colors.text }]}>
              {annonce.constructor}
            </Text>
          </View>

          <View style={styles.specRow}>
            <Text style={[styles.specLabel, { color: colors.textSecondary }]}>
              Operating System:
            </Text>
            <Text style={[styles.specValue, { color: colors.text }]}>
              {annonce.os}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {annonce.description}
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Seller Information
          </Text>

          <View style={styles.sellerContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: annonce.salerAvatar }}
                style={styles.sellerAvatar}
                onError={handleImageError}
              />
              {imageLoadError && (
                <View style={[styles.fallbackAvatar, { backgroundColor: colors.backgroundSecondary }]}>
                  <FontAwesome name="user" size={20} color={colors.textSecondary} />
                </View>
              )}
            </View>
            <View style={styles.sellerInfo}>
              <Text style={[styles.sellerName, { color: colors.text }]}>
                {annonce.saler}
              </Text>
              <Text style={[styles.sellerLocation, { color: colors.textSecondary }]}>
                {annonce.salerCity}, {annonce.salerCountry}
              </Text>
              <Text style={[styles.sellerGender, { color: colors.textSecondary }]}>
                {annonce.salerGender}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.tint }]}
            onPress={handleCallSeller}
          >
            <FontAwesome name="phone" size={18} color={colors.background} style={styles.contactIcon} />
            <Text style={[styles.contactButtonText, { color: colors.background }]}>
              Contact Seller: {annonce.phone}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    height: 60,
    position: 'relative',
    width: 60,
  },
  contactButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    padding: 15,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactIcon: {
    marginRight: 10,
  },
  container: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  fallbackAvatar: {
    alignItems: 'center',
    borderRadius: 30,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  favoriteButton: {
    padding: 10,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoContainer: {
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
  modelName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  releaseYear: {
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sellerAvatar: {
    borderRadius: 30,
    height: 60,
    width: 60,
  },
  sellerContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  sellerGender: {
    fontSize: 14,
  },
  sellerInfo: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 15,
  },
  sellerLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specLabel: {
    fontSize: 16,
    width: 120,
  },
  specRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  specValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
}); 
