import React from "react";
import { View } from "react-native";
import { Text, Chip } from "react-native-paper";

import { styles } from "../statistics-screen.styles";

interface StatisticsHistoryGameRowProps {
  titleMain: string;
  dateFormatted: string;
  scoreSummary: string;
  deckLabel: string;
  cardsSnippet: string;
  precisionSnippet: string;
}

export const StatisticsHistoryGameRow: React.FC<
  StatisticsHistoryGameRowProps
> = ({
  titleMain,
  dateFormatted,
  scoreSummary,
  deckLabel,
  cardsSnippet,
  precisionSnippet,
}) => {
  return (
    <View style={styles.historyRowOuter}>
      <View style={styles.historyRowTop}>
        <Text style={styles.historyRowTitle}>{titleMain}</Text>
        <Text style={styles.historyRowMeta}>{dateFormatted}</Text>
      </View>
      <Text style={styles.historyRowScores}>{scoreSummary}</Text>
      <Text style={styles.historyRowDeck}>{deckLabel}</Text>
      <View style={styles.chipsRow}>
        <Chip
          compact
          style={styles.historyChipGames}
          textStyle={styles.historyChipGamesText}
        >
          {cardsSnippet}
        </Chip>
        <Chip
          compact
          style={styles.historyChipPrecision}
          textStyle={styles.historyChipPrecisionText}
        >
          {precisionSnippet}
        </Chip>
      </View>
    </View>
  );
};
