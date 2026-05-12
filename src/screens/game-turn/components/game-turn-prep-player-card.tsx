import React, { useMemo } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

import { styles } from "../../game-turn-screen.styles";

type GameTurnPrepPlayerCardProps = {
  name: string;
};

function splitDisplayName(name: string): [string, string] {
  const t = name.trim();
  if (!t) return ["", ""];

  const space = t.indexOf(" ");
  if (space > 0) {
    return [t.slice(0, space), t.slice(space + 1).trim()];
  }

  if (t.length <= 6) {
    return [t, ""];
  }

  const mid = Math.ceil(t.length / 2);
  return [t.slice(0, mid), t.slice(mid)];
}

export function GameTurnPrepPlayerCard({ name }: GameTurnPrepPlayerCardProps) {
  const [lineA, lineB] = useMemo(() => splitDisplayName(name), [name]);

  return (
    <View style={styles.prepPlayerCardOuter}>
      <View style={styles.prepPlayerCard}>
        <Text style={styles.prepPlayerNameLine}>{lineA}</Text>
        {lineB ? (
          <Text
            style={[styles.prepPlayerNameLine, styles.prepPlayerNameLineSecondary]}
          >
            {lineB}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
