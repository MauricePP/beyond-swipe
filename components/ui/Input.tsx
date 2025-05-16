import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secure?: boolean;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  containerStyle,
  labelStyle,
  inputStyle,
  leftIcon,
  rightIcon,
  secure = false,
  fullWidth = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!secure);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (rest.onBlur) rest.onBlur(e);
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  const inputContainerStyle = [
    styles.inputContainer,
    isFocused && styles.focusedInput,
    error && styles.errorInput,
    fullWidth && styles.fullWidth,
  ];

  const passwordIcon = secure ? (
    <TouchableOpacity onPress={toggleShowPassword} style={styles.iconContainer}>
      {showPassword ? (
        <EyeOff size={20} color={Colors.text.secondary} />
      ) : (
        <Eye size={20} color={Colors.text.secondary} />
      )}
    </TouchableOpacity>
  ) : null;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      
      <View style={inputContainerStyle}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secure) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={Colors.text.secondary}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secure && !showPassword}
          {...rest}
        />
        
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        {secure && passwordIcon}
      </View>
      
      {(error || helper) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontFamily: Typography.fontFamily.primaryMedium,
    fontSize: Typography.fontSize.small,
    color: Colors.text.primary,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 8,
    backgroundColor: Colors.background.paper,
  },
  fullWidth: {
    width: '100%',
  },
  focusedInput: {
    borderColor: Colors.primary.main,
  },
  errorInput: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.regular,
    color: Colors.text.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIconContainer: {
    paddingLeft: 12,
  },
  rightIconContainer: {
    paddingRight: 12,
  },
  iconContainer: {
    padding: 12,
  },
  helperText: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.small,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  errorText: {
    color: Colors.error,
  },
});

export default Input;
