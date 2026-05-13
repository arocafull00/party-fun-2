import React, { useState } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Text, Icon } from "react-native-paper";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useStatistics } from "../hooks/useStatistics";
import { colors, spacing } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { styles } from "./statistics-screen.styles";
import { StatisticsTeamWinsSection } from "./statistics/statistics-team-wins-section";
import { StatisticsPlayerWinsSection } from "./statistics/statistics-player-wins-section";
import { DotsBackground } from "../shared/components/DotsBackground";

const StatisticsScreen: React.FC = () => {
  const { stats: statistics, playerWins, loading, refetch } = useStatistics();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const calculateWinPercentages = () => {
    const total = statistics.gamesWonByBlue + statistics.gamesWonByRed;
    if (total === 0) {
      return { blue: 0, red: 0 };
    }
    return {
      blue: Math.round((statistics.gamesWonByBlue / total) * 100),
      red: Math.round((statistics.gamesWonByRed / total) * 100),
    };
  };

  const winPercentages = calculateWinPercentages();

  const statsHeader = (
    <AppHeader
      left={
        <AppHeaderIconButton icon="chevron-left" onPress={() => router.push("/")} />
      }
      right={<AppHeaderIconButton icon="bell-outline" />}
    />
  );

  if (loading) {
    return (
      <CustomScreen contentStyle={styles.screenContent} header={statsHeader}>
        <View
          style={[
            styles.root,
            { paddingTop: spacing.sm },
          ]}
        >
          <View style={styles.loadingBlock}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingLabel}>Cargando estadísticas...</Text>
          </View>
        </View>
      </CustomScreen>
    );
  }

  const bottomPadding =
    spacing.xxxl + spacing.xxl + insets.bottom;

  return (
    <CustomScreen contentStyle={styles.screenContent} header={statsHeader}>
      <DotsBackground />
      <View style={[styles.root, { paddingTop: spacing.sm }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <StatisticsTeamWinsSection
            statistics={statistics}
            winPercentages={winPercentages}
          />
          <View style={styles.sectionDivider} />
          <StatisticsPlayerWinsSection playerWins={playerWins} />
        </ScrollView>
      </View>
    </CustomScreen>
  );
};

const BottomNavigationStickyOffset = spacing.md;

const EstimatedFloatingNavBand =
  spacing.sm + spacing.xxxl + spacing.md + spacing.md;

const clearAboveFloatingNav =
  BottomNavigationStickyOffset + EstimatedFloatingNavBand;

const firstPlayReserve = spacing.xxl + spacing.lg;

export default StatisticsScreen;
