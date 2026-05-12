import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

import { borderRadius, colors, spacing, typography } from "../../../theme/theme";
import { TeamMemberRow } from "./team-member-row";

interface FinalTeamCardProps {
  title: string;
  score: number;
  members: string[];
  color: string;
  winnerLabel?: string;
}

export const FinalTeamCard: React.FC<FinalTeamCardProps> = ({
  title,
  score,
  members,
  color,
  winnerLabel,
}) => {
  return (
    <View
      style={[
        styles.card,
        winnerLabel ? styles.cardWithWinner : null,
        {
          borderColor: color + "66",
          backgroundColor: color + "10",
        },
      ]}
    >
      {winnerLabel ? (
        <View style={[styles.winnerBadge, { backgroundColor: color }]}>
          <Text style={styles.winnerBadgeText}>{winnerLabel}</Text>
        </View>
      ) : null}

      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={[styles.score, { color }]}>{score}</Text>
      <Text style={[styles.correctLabel, { color }]}>PALABRAS ACERTADAS</Text>

      <View style={styles.membersSection}>
        <Text style={styles.membersTitle}>Integrantes</Text>
        <View style={styles.membersList}>
          {members.map((member) => (
            <TeamMemberRow key={member} name={member} color={color} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    position: "relative",
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  cardWithWinner: {
    paddingTop: spacing.md + typography.sizes.xs + spacing.xs * 2 + spacing.sm,
  },
  winnerBadge: {
    position: "absolute",
    top: -spacing.md,
    left: -spacing.md,
    zIndex: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  winnerBadgeText: {
    color: colors.background,
    fontSize: typography.sizes.xs,
    fontFamily: typography.families.bodyBold,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.heading,
    textAlign: "center",
  },
  score: {
    fontSize: typography.sizes.display,
    lineHeight: typography.sizes.display + spacing.md,
    fontFamily: typography.families.heading,
    textAlign: "center",
  },
  correctLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.families.bodyBold,
    textAlign: "center",
  },
  membersSection: {
    borderTopWidth: 1,
    borderTopColor: colors.secondary + "55",
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  membersTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.bodyBold,
    color: colors.text,
  },
  membersList: {
    gap: spacing.xs,
  },
});
