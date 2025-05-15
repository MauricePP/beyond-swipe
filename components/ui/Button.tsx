import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  ActivityIndicator,
  TouchableOpacityProps
} from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradient?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  gradient = false,
  ...rest
}) => {
  const buttonStyles: ViewStyle[] = [
    styles.button,
    styles[`${variant}Button`],
    styles[`${size}Button`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabledButton,
    style || {},
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle || {},
  ];

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' ? Colors.primary.main : Colors.text.white} 
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </>
  );

  if (gradient && variant === 'primary') {
    return (
      <TouchableOpacity
        style={[styles.button, styles[`${size}Button`], fullWidth && styles.fullWidth, style]}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...rest}
      >
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[StyleSheet.absoluteFill, { borderRadius: 8 }]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: Colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  textButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: Colors.text.disabled,
    borderColor: Colors.text.disabled,
  },
  text: {
    fontFamily: Typography.fontFamily.primarySemiBold,
    textAlign: 'center',
  },
  primaryText: {
    color: Colors.text.white,
  },
  secondaryText: {
    color: Colors.text.white,
  },
  outlineText: {
    color: Colors.primary.main,
  },
  textText: {
    color: Colors.primary.main,
  },
  smallText: {
    fontSize: Typography.fontSize.small,
  },
  mediumText: {
    fontSize: Typography.fontSize.regular,
  },
  largeText: {
    fontSize: Typography.fontSize.medium,
  },
  disabledText: {
    color: Colors.background.default,
  },
});

export default Button;
