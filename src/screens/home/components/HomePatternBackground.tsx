import React from "react";
import { View } from "react-native";

import { styles } from "../home-screen.styles";

const patternRows = [4, 14, 24, 34, 44, 54, 64, 74, 84, 94];
const patternColumns = [2, 14, 26, 38, 50, 62, 74, 86, 98];

interface HomePatternBackgroundProps {
  keyPrefix: string;
}

export const HomePatternBackground: React.FC<HomePatternBackgroundProps> = ({ keyPrefix }) => {
  return (
    <>
      <View style={styles.blueBackground} />
      {patternRows.map((top) =>
        patternColumns.map((left) => (
          <View
            key={`${keyPrefix}-dot-${top}-${left}`}
            style={[styles.patternDot, { top: `${top}%`, left: `${left}%` }]}
          />
        ))
      )}
    </>
  );
};
