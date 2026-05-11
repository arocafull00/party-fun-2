import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../theme/theme";
import type { GameStatistics } from "../../hooks/useStatistics";

import { styles } from "../statistics-screen.styles";

interface StatisticsGeneralSectionProps {
  statistics: GameStatistics;
}

export const StatisticsGeneralSection: React.FC<
  StatisticsGeneralSectionProps
> = ({ statistics }) => {
  return (
    <View>
      <View style={styles.sectionHeadingRow}>
        <View style={styles.sectionIconCircle}>
          <Icon source="poll" size={22} color={colors.surface} />
        </View>
        <Text style={styles.sectionHeadingTitle}>Estadísticas Generales</Text>
      </View>
      <View style={styles.generalGrid}>
        <View style={styles.generalCell}>
          <View style={[styles.generalGlyphCircle, styles.generalGlyphTintBlue]}>
            <Icon source="trophy" size={28} color={colors.primary} />
          </View>
          <Text style={styles.generalStatValueGames}>{statistics.totalGames}</Text>
          <Text style={styles.generalStatLabel}>Partidas</Text>
        </View>
        <View style={styles.generalCell}>
          <View style={[styles.generalGlyphCircle, styles.generalGlyphTintRed]}>
            <Icon source="alphabet-a-box" size={28} color={colors.accent} />
          </View>
          <Text style={styles.generalStatValueWords}>{statistics.totalCards}</Text>
          <Text style={styles.generalStatLabel}>Palabras</Text>
        </View>
        <View style={styles.generalCell}>
          <View style={[styles.generalGlyphCircle, styles.generalGlyphTintPurple]}>
            <Icon source="target" size={28} color={colors.accuracyAccent} />
          </View>
          <Text style={styles.generalStatValueAccuracy}>
            {statistics.averageAccuracy}%
          </Text>
          <Text style={styles.generalStatLabel}>Precisión</Text>
        </View>
      </View>
    </View>
  );
};
