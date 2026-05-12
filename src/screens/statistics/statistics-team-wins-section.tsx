import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../theme/theme";
import type { GameStatistics } from "../../hooks/useStatistics";

import { styles } from "../statistics-screen.styles";

interface WinPercentages {
  blue: number;
  red: number;
}

interface StatisticsTeamWinsSectionProps {
  statistics: GameStatistics;
  winPercentages: WinPercentages;
}

export const StatisticsTeamWinsSection: React.FC<
  StatisticsTeamWinsSectionProps
> = ({ statistics, winPercentages }) => {
  return (
    <View>
      <View style={styles.sectionHeadingRow}>
        <View style={styles.sectionIconCircle}>
          <Icon source="account-group" size={22} color={colors.background} />
        </View>
        <Text style={styles.sectionHeadingTitle}>Victorias por Equipo</Text>
      </View>
      <View style={styles.teamsRow}>
        <View style={[styles.teamPanel, styles.teamPanelBlue]}>
          <Text style={styles.teamCountBlue}>{statistics.gamesWonByBlue}</Text>
          <Text style={styles.teamName}>Equipo Azul</Text>
          <View style={styles.teamPillBlue}>
            <Text style={styles.teamPillTextBlue}>{winPercentages.blue}%</Text>
          </View>
        </View>
        <View style={[styles.teamPanel, styles.teamPanelRed]}>
          <Text style={styles.teamCountRed}>{statistics.gamesWonByRed}</Text>
          <Text style={styles.teamNameRed}>Equipo Rojo</Text>
          <View style={styles.teamPillRed}>
            <Text style={styles.teamPillTextRed}>{winPercentages.red}%</Text>
          </View>
        </View>
      </View>
      {statistics.ties > 0 ? (
        <View style={styles.tiesBanner}>
          <Text style={styles.tiesText}>
            {statistics.ties} empate{statistics.ties === 1 ? "" : "s"}
          </Text>
        </View>
      ) : null}
    </View>
  );
};
