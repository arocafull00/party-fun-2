import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import { router } from 'expo-router';
import { borderRadius, colors, spacing, typography } from '../../theme/theme';

type TabKey = 'play' | 'stats' | 'decks';

interface BottomNavigationProps {
  activeTab: TabKey;
}

const tabs: { key: TabKey; label: string; icon: string; route: string }[] = [
  { key: 'play', label: 'JUGAR', icon: 'play', route: '/new-game' },
  { key: 'stats', label: 'ESTADÍSTICAS', icon: 'chart-bar', route: '/statistics' },
  { key: 'decks', label: 'BARAJAS', icon: 'cards', route: '/deck-management' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={isActive ? styles.tabItemActive : styles.tabItem}
            onPress={() => {
              if (!isActive) router.push(tab.route);
            }}
          >
            {isActive ? (
              <View style={styles.activeIconCircle}>
                <Icon source={tab.icon} size={16} color={'#ffffff'} />
              </View>
            ) : (
              <Icon source={tab.icon} size={20} color={colors.text} />
            )}
            <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    right: 16,
    borderRadius: borderRadius.xl,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.secondary,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
  },
  tabLabel: {
    color: colors.text,
    fontFamily: typography.families.bodyBold,
    fontSize: 12,
  },
  tabItemActive: {
    flex: 1,
    borderRadius: borderRadius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
  },
  tabLabelActive: {
    color: colors.primary,
    fontFamily: typography.families.bodyBold,
    fontSize: 12,
  },
  activeIconCircle: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
