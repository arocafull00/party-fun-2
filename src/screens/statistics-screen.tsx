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
import { BottomNavigation } from "../shared/components/BottomNavigation";
import { AppHeader } from "../shared/components/app-header";
import { AppHeaderIconButton } from "../shared/components/app-header-icon-button";
import { styles } from "./statistics-screen.styles";
import { StatisticsGeneralSection } from "./statistics/statistics-general-section";
import { StatisticsTeamWinsSection } from "./statistics/statistics-team-wins-section";
import { StatisticsHistorySection } from "./statistics/statistics-history-section";

const StatisticsScreen: React.FC = () => {
  const { stats: statistics, recentGames, loading, refetch } = useStatistics();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getWinnerEmoji = (winner: string | null): string => {
    if (winner === "azul") {
      return "🔵";
    }
    if (winner === "rojo") {
      return "🔴";
    }
    return "🤝";
  };

  const getWinnerText = (winner: string | null): string => {
    if (winner === "azul") {
      return "Azul";
    }
    if (winner === "rojo") {
      return "Rojo";
    }
    return "Empate";
  };

  const calculateWinPercentages = () => {
    const total = statistics.totalGames;
    if (total === 0) {
      return { blue: 0, red: 0, tie: 0 };
    }
    return {
      blue: Math.round((statistics.gamesWonByBlue / total) * 100),
      red: Math.round((statistics.gamesWonByRed / total) * 100),
      tie: Math.round((statistics.ties / total) * 100),
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
  const showFirstGameDock = recentGames.length === 0;

  return (
    <CustomScreen contentStyle={styles.screenContent} header={statsHeader}>
      <View style={[styles.root, { paddingTop: spacing.sm }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollInner,
            { paddingBottom: showFirstGameDock ? bottomPadding + firstPlayReserve : bottomPadding },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <StatisticsGeneralSection statistics={statistics} />
          <View style={styles.sectionDivider} />
          <StatisticsTeamWinsSection
            statistics={statistics}
            winPercentages={winPercentages}
          />
          <View style={styles.sectionDivider} />
          <StatisticsHistorySection
            recentGames={recentGames}
            formatDate={formatDate}
            getWinnerEmoji={getWinnerEmoji}
            getWinnerText={getWinnerText}
          />
        </ScrollView>
        {showFirstGameDock ? (
          <View
            style={[
              styles.footerDock,
              {
                position: "absolute",
                bottom: clearAboveFloatingNav + spacing.sm + insets.bottom,
                left: 0,
                right: 0,
              },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/new-game")}
              style={({ pressed }) => [
                styles.footerCta,
                pressed && { opacity: 0.92 },
              ]}
            >
              <Icon source="play" size={22} color={colors.surface} />
              <Text style={styles.footerCtaLabel}>JUGAR PRIMERA PARTIDA</Text>
            </Pressable>
          </View>
        ) : null}
        <BottomNavigation activeTab="stats" />
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
