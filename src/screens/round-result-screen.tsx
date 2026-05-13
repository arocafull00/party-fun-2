import React from "react";
import { View, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGameStore } from "../store/game-store";
import { colors, spacing } from "../theme/theme";
import { CustomScreen } from "../shared/components/CustomScreen";
import { RoundScoreCard } from "./round-result/components/round-score-card";
import { NextRoundPreviewCard } from "./round-result/components/next-round-preview-card";
import { styles } from "./round-result-screen.styles";

const PHASE_CONFIG: Record<
  number,
  {
    name: string;
    icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  }
> = {
  1: { name: "Pista Libre", icon: "microphone" },
  2: { name: "Una Palabra", icon: "format-quote-close" },
  3: { name: "Mímica", icon: "drama-masks" },
};

const RoundResultScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { currentPhase, teams } = useGameStore();

  const nextPhase = PHASE_CONFIG[currentPhase];
  const isLastRound = nextPhase === undefined;

  const handleNext = () => {
    if (isLastRound) {
      router.push("/game-end");
      return;
    }

    router.push("/game-turn");
  };

  return (
    <CustomScreen contentStyle={styles.container} header={null}>
      <View
        style={[
          styles.content,
          {
            paddingTop: spacing.xl + insets.top,
            paddingBottom: spacing.lg + insets.bottom,
            paddingLeft: spacing.lg + insets.left,
            paddingRight: spacing.lg + insets.right,
          },
        ]}
      >
        <Image
          source={require("../../assets/completed-round-title.png")}
          style={styles.titleImage}
          resizeMode="contain"
        />

        <View style={styles.scoresSection}>
          <View style={styles.scoreCardsRow}>
            <RoundScoreCard
              teamName="EQUIPO AZUL"
              score={teams.azul.score}
              color={colors.primary}
              side="left"
            />
            <RoundScoreCard
              teamName="EQUIPO ROJO"
              score={teams.rojo.score}
              color={colors.redTeam}
              side="right"
            />
          </View>
        </View>

        {!isLastRound && (
          <NextRoundPreviewCard
            phaseName={nextPhase.name}
            phaseIcon={nextPhase.icon}
          />
        )}

        {isLastRound && (
          <View style={styles.finalMessageContainer}>
            <Text style={styles.finalMessage}>¡JUEGO TERMINADO!</Text>
            <Text style={styles.finalSubmessage}>
              Veamos los resultados finales
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.continueButton}
            contentStyle={styles.continueButtonContent}
            labelStyle={styles.continueButtonLabel}
            buttonColor={colors.primary}
          >
            {isLastRound ? "Ver Resultados Finales" : "Continuar"}
          </Button>
        </View>
      </View>
    </CustomScreen>
  );
};

export default RoundResultScreen;
