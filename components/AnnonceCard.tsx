import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Annonce } from '@/data/annonces';
import { useTheme } from '@/constants/useTheme';
import { Image } from 'react-native';

interface AnnonceCardProps {
  annonce: Annonce;
  isFavorite: boolean;
  onToggleFavorite: (annonceId: string) => void;
  imageLoadError: boolean;
  onImageError: (annonceId: string) => void;
  from?: 'annonces' | 'favorites';
}

export function AnnonceCard({
  annonce,
  isFavorite,
  onToggleFavorite,
  imageLoadError,
  onImageError,
  from = 'annonces',
}: AnnonceCardProps) {
  const router = useRouter();
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.annonceCard,
        {
          borderColor: colors.cardBorder,
          backgroundColor: colors.cardBackground
        }
      ]}
      onPress={() => {
        router.push({
          pathname: '/annonce/[id]',
          params: { id: annonce.id, from },
        });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.annonceInfo}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {annonce.model} ({annonce.releaseDate})
          </Text>
          <Text style={[styles.constructor, { color: colors.textSecondary }]}>
            {annonce.constructor} - {annonce.os}
          </Text>
        </View>

        <Text style={[styles.price, { color: colors.tint }]}>
          {annonce.price.toFixed(2)} €
        </Text>

        <View style={styles.salerContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: annonce.salerAvatar }}
              style={styles.avatar}
              onError={() => onImageError(annonce.id)}
            />
            {imageLoadError && (
              <View style={[styles.fallbackAvatar, { backgroundColor: isDark ? colors.borderSecondary : colors.backgroundSecondary }]}>
                <FontAwesome name="user" size={12} color={isDark ? colors.textTertiary : colors.textSecondary} />
              </View>
            )}
          </View>
          <Text style={[styles.saler, { color: colors.textSecondary }]}>
            {annonce.saler} - {annonce.salerCity}, {annonce.salerCountry}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(annonce.id)}
          >
            <FontAwesome
              name={isFavorite ? 'heart' : 'heart-o'}
              size={20}
              color={isFavorite ? colors.heartActive : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.phoneButton,
              {
                backgroundColor: colors.tint,
                borderColor: colors.tint
              }
            ]}
            onPress={() => {
              // In a real app, this would open the phone dialer
              alert(`Call ${annonce.phone}`);
            }}
          >
            <FontAwesome name="phone" size={18} color={colors.background} />
            <Text style={[styles.phoneText, { color: colors.background }]}>
              Contact
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  annonceCard: {
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 15,
    overflow: 'hidden',
    padding: 12,
  },
  annonceInfo: {
    flex: 1,
  },
  avatar: {
    borderRadius: 12,
    height: 24,
    width: 24,
  },
  avatarContainer: {
    height: 24,
    marginRight: 8,
    position: 'relative',
    width: 24,
  },
  constructor: {
    fontSize: 14,
    marginBottom: 4,
  },
  fallbackAvatar: {
    alignItems: 'center',
    borderRadius: 12,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  favoriteButton: {
    padding: 5,
  },
  phoneButton: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  saler: {
    flex: 1,
    fontSize: 12,
  },
  salerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  titleContainer: {
    marginBottom: 8,
  },
}); 
