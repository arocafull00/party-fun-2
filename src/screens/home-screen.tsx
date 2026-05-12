import React from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDecks } from "../hooks/useDecks";
import { CustomScreen } from "../shared/components/CustomScreen";
import { useGlobalMusic } from "../shared/context/global-music-context";
import { HomeEmptyState } from "./home/components/HomeEmptyState";
import { HomeLoadingState } from "./home/components/HomeLoadingState";
import { HomeMainContent } from "./home/components/HomeMainContent";
import { styles } from "./home/home-screen.styles";

export const HomeScreen: React.FC = () => {
  const { decks, loading } = useDecks();
  const insets = useSafeAreaInsets();
  const { isMuted, toggleMuted } = useGlobalMusic();

  const topOffset = insets.top + 4;

  const muteButton = (
    <View style={[styles.musicToggleWrapper, { top: topOffset }]}>
      <IconButton
        accessibilityLabel={isMuted ? "Activar música" : "Silenciar música"}
        icon={isMuted ? "volume-off" : "volume-high"}
        iconColor="#FFFFFF"
        onPress={toggleMuted}
        size={24}
        style={styles.musicToggleButton}
      />
    </View>
  );

  if (loading) {
    return (
      <CustomScreen
        contentStyle={styles.screenContent}
        hideBackground
      >
        {muteButton}
        <HomeLoadingState />
      </CustomScreen>
    );
  }

  if (decks.length === 0) {
    return (
      <CustomScreen
        contentStyle={styles.screenContent}
        hideBackground
      >
        {muteButton}
        <HomeEmptyState/>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen
      contentStyle={styles.screenContent}
      hideBackground
    >
      {muteButton}
      <HomeMainContent/>
    </CustomScreen>
  );
};
