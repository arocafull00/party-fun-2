import React from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../theme/theme";
import type { RecentGame } from "../../hooks/useStatistics";

import { styles } from "../statistics-screen.styles";
import { StatisticsHistoryGameRow } from "./statistics-history-game-row";

interface StatisticsHistorySectionProps {
  recentGames: RecentGame[];
  formatDate: (dateString: string) => string;
  getWinnerEmoji: (winner: string | null) => string;
  getWinnerText: (winner: string | null) => string;
}

export const StatisticsHistorySection: React.FC<
  StatisticsHistorySectionProps
> = ({
  recentGames,
  formatDate,
  getWinnerEmoji,
  getWinnerText,
}) => {
  return (
    <View>
      <View style={styles.sectionHeadingRow}>
        <View style={styles.sectionIconCircle}>
          <Icon source="history" size={22} color={colors.surface} />
        </View>
        <Text style={styles.sectionHeadingTitle}>Historial de Partidas</Text>
      </View>
      {recentGames.length === 0 ? (
        <View style={styles.emptyHistoryRow}>
          <View style={styles.emptyHistoryGlyph}>
            <Icon source="clipboard-list-outline" size={30} color={colors.primary} />
          </View>
          <View style={styles.emptyHistoryTexts}>
            <Text style={styles.emptyHistoryTitle}>
              No hay partidas registradas
            </Text>
            <Text style={styles.emptyHistorySubtitle}>
              ¡Juega tu primera partida para ver el historial aquí!
            </Text>
          </View>
        </View>
      ) : (
        <>
          {recentGames.map((game, index) => (
            <View key={game.id}>
              {index > 0 ? <View style={styles.historyDivider} /> : null}
              <StatisticsHistoryGameRow
                titleMain={`${getWinnerEmoji(game.equipo_ganador)} ${getWinnerText(game.equipo_ganador)}`}
                dateFormatted={formatDate(game.fecha)}
                scoreSummary={`${game.puntuacion_azul} - ${game.puntuacion_rojo}`}
                deckLabel={`Mazo · ${game.mazo_nombre ?? "Sin mazo"}`}
                cardsSnippet={`${game.cartas_correctas}/${game.total_cartas} cartas`}
                precisionSnippet={`${game.precision}% precisión`}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
};
