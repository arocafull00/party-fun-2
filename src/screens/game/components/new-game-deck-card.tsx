import React from "react";
import { Pressable, View } from "react-native";
import { Text, Icon } from "react-native-paper";

import { colors } from "../../../theme/theme";
import { newGameDeckCardStyles as styles } from "./new-game-deck-card.styles";

interface NewGameDeckCardProps {
  deckName: string | null;
  onPress: () => void;
}

const NewGameDeckCard: React.FC<NewGameDeckCardProps> = ({ deckName, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed ? { opacity: 0.92 } : null]}
    >
      <View style={styles.iconCircle}>
        <Icon source="cards-outline" size={26} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{deckName ?? "Seleccionar mazo"}</Text>
        <Text style={styles.subtitle}>
          Elige el mazo de cartas que quieres usar.
        </Text>
      </View>
      <View style={styles.chevronWrap}>
        <Icon source="chevron-right" size={26} color={colors.primary} />
      </View>
    </Pressable>
  );
};

export default NewGameDeckCard;
