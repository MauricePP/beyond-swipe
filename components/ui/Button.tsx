import React, { ReactNode } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  TouchableOpacityProps,
  View,
  ColorValue,
  Pressable
} from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children?: React.ReactNode;
  title?: string;
  onPress?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  leftIcon?: ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  children,
  title,
  onPress,
  variant = 'default',
  style,
  textStyle,
  disabled = false,
  leftIcon,
  size = 'medium',
}: ButtonProps) {
  const content = title ? (
    <Text
      style={[
        styles.text,
        variant === 'default' && styles.defaultText,
        variant === 'outline' && styles.outlineText,
        variant === 'ghost' && styles.ghostText,
        disabled && styles.disabledText,
        textStyle,
      ]}
    >
      {title}
    </Text>
  ) : children;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'default' && styles.default,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        disabled && styles.disabled,
        pressed && styles.pressed,
        size === 'small' && styles.small,
        size === 'large' && styles.large,
        style,
      ]}
    >
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  default: {
    backgroundColor: '#007AFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  defaultText: {
    color: 'white',
  },
  outlineText: {
    color: '#007AFF',
  },
  ghostText: {
    color: '#007AFF',
  },
  disabledText: {
    color: '#999',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  leftIcon: {
    marginRight: 8,
  },
});
