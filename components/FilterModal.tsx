import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Annonce } from '@/data/annonces';
import {
  FilterOptions,
  getUniqueConstructors,
  getUniqueOS,
  getYearRange,
  getPriceRange
} from '@/utils/filters';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/constants/useTheme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  annonces: Annonce[];
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

const FilterModal = ({
  visible,
  onClose,
  annonces,
  currentFilters,
  onApplyFilters,
}: FilterModalProps) => {
  const { colors } = useTheme();

  const [selectedConstructors, setSelectedConstructors] = useState<string[]>(
    currentFilters.selectedConstructors
  );
  const [selectedOS, setSelectedOS] = useState<string[]>(
    currentFilters.selectedOS
  );
  const [yearRange, setYearRange] = useState(currentFilters.yearRange);
  const [priceRange, setPriceRange] = useState(currentFilters.priceRange);

  const constructors = getUniqueConstructors(annonces);
  const operatingSystems = getUniqueOS(annonces);
  const { min: minYear, max: maxYear } = getYearRange(annonces);
  const { min: minPrice, max: maxPrice } = getPriceRange(annonces);

  useEffect(() => {
    setSelectedConstructors(currentFilters.selectedConstructors);
    setSelectedOS(currentFilters.selectedOS);
    setYearRange(currentFilters.yearRange);
    setPriceRange(currentFilters.priceRange);
  }, [currentFilters]);

  const handleToggleConstructor = (constructor: string) => {
    setSelectedConstructors(prev =>
      prev.includes(constructor)
        ? prev.filter(c => c !== constructor)
        : [...prev, constructor]
    );
  };

  const handleToggleOS = (os: string) => {
    setSelectedOS(prev =>
      prev.includes(os) ? prev.filter(o => o !== os) : [...prev, os]
    );
  };

  const handleReset = () => {
    setSelectedConstructors([]);
    setSelectedOS([]);
    setYearRange({ start: minYear, end: maxYear });
    setPriceRange({ min: minPrice, max: maxPrice });
  };

  const handleApply = () => {
    onApplyFilters({
      selectedConstructors,
      selectedOS,
      yearRange,
      priceRange,
    });
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filter Annonces</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Constructor Filter */}
            <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Constructor</Text>
              <View style={styles.optionsContainer}>
                {constructors.map(constructor => (
                  <TouchableOpacity
                    key={constructor}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: selectedConstructors.includes(constructor)
                          ? colors.tint
                          : colors.backgroundSecondary,
                      },
                    ]}
                    onPress={() => handleToggleConstructor(constructor)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selectedConstructors.includes(constructor)
                            ? colors.background
                            : colors.text,
                        },
                      ]}
                    >
                      {constructor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* OS Filter */}
            <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Operating System</Text>
              <View style={styles.optionsContainer}>
                {operatingSystems.map(os => (
                  <TouchableOpacity
                    key={os}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: selectedOS.includes(os)
                          ? colors.tint
                          : colors.backgroundSecondary,
                      },
                    ]}
                    onPress={() => handleToggleOS(os)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: selectedOS.includes(os) ? colors.background : colors.text,
                        },
                      ]}
                    >
                      {os}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Year Range Filter */}
            <View style={[styles.filterSection, { borderBottomColor: colors.border }]}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Year Range</Text>
              <View style={styles.rangeContainer}>
                <Text style={[styles.rangeValue, { color: colors.text }]}>
                  {yearRange.start} - {yearRange.end}
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={minYear}
                  maximumValue={maxYear}
                  step={1}
                  value={yearRange.start}
                  onValueChange={value => setYearRange(prev => ({ ...prev, start: value }))}
                  minimumTrackTintColor={colors.tint}
                  maximumTrackTintColor={colors.backgroundSecondary}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={minYear}
                  maximumValue={maxYear}
                  step={1}
                  value={yearRange.end}
                  onValueChange={value => setYearRange(prev => ({ ...prev, end: value }))}
                  minimumTrackTintColor={colors.tint}
                  maximumTrackTintColor={colors.backgroundSecondary}
                />
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterTitle, { color: colors.text }]}>Price Range</Text>
              <View style={styles.rangeContainer}>
                <Text style={[styles.rangeValue, { color: colors.text }]}>
                  {priceRange.min.toFixed(2)} € - {priceRange.max.toFixed(2)} €
                </Text>
                <Slider
                  style={styles.slider}
                  minimumValue={minPrice}
                  maximumValue={maxPrice}
                  step={10}
                  value={priceRange.min}
                  onValueChange={value => setPriceRange(prev => ({ ...prev, min: value }))}
                  minimumTrackTintColor={colors.tint}
                  maximumTrackTintColor={colors.backgroundSecondary}
                />
                <Slider
                  style={styles.slider}
                  minimumValue={minPrice}
                  maximumValue={maxPrice}
                  step={10}
                  value={priceRange.max}
                  onValueChange={value => setPriceRange(prev => ({ ...prev, max: value }))}
                  minimumTrackTintColor={colors.tint}
                  maximumTrackTintColor={colors.backgroundSecondary}
                />
              </View>
            </View>
          </ScrollView>

          <View style={[styles.buttonContainer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[styles.button, styles.resetButton, { backgroundColor: colors.textTertiary }]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.applyButton, { backgroundColor: colors.tint }]}
              onPress={handleApply}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  applyButton: {
    // Background color set dynamically
  },
  button: {
    alignItems: 'center',
    borderRadius: 5,
    minWidth: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonContainer: {
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterSection: {
    borderBottomWidth: 1,
    padding: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    borderRadius: 10,
    maxHeight: '80%',
    overflow: 'hidden',
    width: '90%',
  },
  modalHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionButton: {
    borderRadius: 20,
    margin: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionText: {
    fontSize: 14,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rangeContainer: {
    marginTop: 10,
  },
  rangeValue: {
    marginVertical: 5,
    textAlign: 'center',
  },
  resetButton: {
    // Background color set dynamically
  },
  scrollView: {
    maxHeight: '70%',
  },
  slider: {
    height: 40,
    width: '100%',
  },
});

export default FilterModal; 
