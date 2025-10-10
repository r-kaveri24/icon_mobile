import React from 'react';
import {
  Text as RNText,
  TextStyle,
  StyleSheet,
} from 'react-native';

type TextVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body' 
  | 'caption' 
  | 'button';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  onPress?: () => void;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color = '#000000',
  style,
  numberOfLines,
  onPress,
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    { color },
    style,
  ];

  return (
    <RNText
      style={textStyle}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    marginBottom: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    marginBottom: 12,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
    opacity: 0.7,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
});