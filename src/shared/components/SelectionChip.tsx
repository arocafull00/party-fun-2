import React from 'react';
import { StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { borderRadius, colors, typography } from '../../theme/theme';

interface SelectionChipProps {
  selected: boolean;
  label: string;
  onPress?: () => void;
  icon?: string;
}

export const SelectionChip: React.FC<SelectionChipProps> = ({
  selected,
  label,
  onPress,
  icon,
}) => {
  return (
    <Chip
      icon={icon}
      onPress={onPress}
      style={[styles.chip, selected ? styles.selectedChip : styles.idleChip]}
      textStyle={[styles.label, selected ? styles.selectedLabel : styles.idleLabel]}
      selected={selected}
    >
      {label}
    </Chip>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: borderRadius.full,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  idleChip: {
    backgroundColor: colors.secondary,
  },
  selectedChip: {
    backgroundColor: colors.accent,
  },
  label: {
    fontFamily: typography.families.bodyBold,
    fontSize: typography.sizes.sm,
    fontWeight: '700',
  },
  idleLabel: {
    color: colors.text,
  },
  selectedLabel: {
    color: '#ffffff',
  },
});
