import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
export const Background = () => {
  return (
    <ImageBackground
      source={require('../../../assets/background.jpg')}
      style={StyleSheet.absoluteFillObject}
      resizeMode="cover"
    >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({});

export default Background;
