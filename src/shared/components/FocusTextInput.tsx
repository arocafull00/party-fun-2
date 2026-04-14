import React, { useRef } from 'react';
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { TextInput } from 'react-native-paper';
import { borderRadius, colors } from '../../theme/theme';

type TextInputProps = React.ComponentProps<typeof TextInput>;

interface FocusTextInputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export const FocusTextInput: React.FC<FocusTextInputProps> = ({
  containerStyle,
  onFocus,
  onBlur,
  mode = 'outlined',
  ...props
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
    onBlur?.(event);
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }, containerStyle]}>
      <TextInput
        mode={mode}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={styles.input}
        theme={{
          roundness: borderRadius.md,
          colors: {
            primary: colors.primary,
            background: colors.surfaceContainerLowest,
          },
        }}
        {...props}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  input: {
    backgroundColor: colors.surfaceContainerLowest,
  },
});
