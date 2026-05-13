import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../theme/theme";
import type { PlayerWins } from "../../hooks/useStatistics";
import { styles } from "../statistics-screen.styles";

interface StatisticsPlayerWinsSectionProps {
  playerWins: PlayerWins[];
}

export const StatisticsPlayerWinsSection: React.FC<
  StatisticsPlayerWinsSectionProps
> = ({ playerWins }) => {
  return (
    <View>
      <View style={styles.sectionHeadingRow}>
        <View style={styles.sectionIconCircle}>
          <Icon source="trophy-variant-outline" size={22} color={colors.background} />
        </View>
        <Text style={styles.sectionHeadingTitle}>Victorias por Usuario</Text>
      </View>
      {playerWins.length === 0 ? (
        <View style={styles.emptyHistoryRow}>
          <View style={styles.emptyHistoryGlyph}>
            <Icon source="account-outline" size={30} color={colors.primary} />
          </View>
          <View style={styles.emptyHistoryTexts}>
            <Text style={styles.emptyHistoryTitle}>
              No hay victorias registradas
            </Text>
          </View>
        </View>
      ) : (
        <>
          {playerWins.map((entry, index) => (
            <View key={`${entry.nombre}-${index}`}>
              {index > 0 ? <View style={styles.historyDivider} /> : null}
              <View style={styles.historyRowTop}>
                <Text style={styles.historyRowTitle}>{entry.nombre}</Text>
                <Text style={styles.historyRowScores}>{entry.wins}</Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
};
