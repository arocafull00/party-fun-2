import React from "react";
import { Pressable, View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../theme/theme";
import { deckListCardStyles as styles } from "./deck-list-card.styles";

export interface DeckListCardProps {
  name: string;
  wordCount: number;
  deckIndex: number;
  onPress: () => void;
  onLongPress: () => void;
}

export const DeckListCard: React.FC<DeckListCardProps> = ({
  name,
  wordCount,
  onPress,
  onLongPress,
}) => {

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.pressable,
        pressed ? styles.pressablePressed : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon source={"cards-outline"} size={22} color="#f5e6d3" />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.deckName} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.metaRow}>
          <Icon
            source="book-open-page-variant-outline"
            size={15}
            color="#4a392d"
          />
          <Text style={styles.metaText}>{wordCount} palabras</Text>
        </View>
      </View>
      <View style={styles.chevronWrap}>
        <Icon source="chevron-right" size={22} color={colors.text} />
      </View>
    </Pressable>
  );
};
