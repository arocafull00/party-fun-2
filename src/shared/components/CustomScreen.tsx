import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Background from './background';

interface CustomScreenProps {
  children: React.ReactNode;
  styles?: ViewStyle;
}

export const CustomScreen: React.FC<CustomScreenProps> = ({ children, styles }) => {
  return (
    <Background>
      <View style={[defaultStyles.container, styles]}>
        {children}
      </View>
    </Background>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomScreen; 