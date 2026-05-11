import React from "react";

import { useDecks } from "../hooks/useDecks";
import { CustomScreen } from "../shared/components/CustomScreen";
import { HomeEmptyState } from "./home/components/HomeEmptyState";
import { HomeLoadingState } from "./home/components/HomeLoadingState";
import { HomeMainContent } from "./home/components/HomeMainContent";
import { styles } from "./home/home-screen.styles";

export const HomeScreen: React.FC = () => {
  const { decks, loading } = useDecks();

  if (loading) {
    return (
      <CustomScreen
        contentStyle={styles.screenContent}
        hideBackground
      >
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
        <HomeEmptyState/>
      </CustomScreen>
    );
  }

  return (
    <CustomScreen
      contentStyle={styles.screenContent}
      hideBackground
    >
      <HomeMainContent/>
    </CustomScreen>
  );
};
