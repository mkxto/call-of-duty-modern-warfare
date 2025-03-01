import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Bot } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/constants/useTheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={styles.icon} {...props} />;
}

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              LebonCon
            </Text>
            <Bot size={24} color={colors.tint} />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Annonces',
          tabBarIcon: ({ color }) => <TabBarIcon name="list" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  icon: {
    marginBottom: -3,
  },
});
