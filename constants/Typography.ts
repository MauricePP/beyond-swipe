import { Platform } from 'react-native';

export const Typography = {
  fontFamily: {
    primary: Platform.OS === 'ios' ? 'Inter' : 'Inter_400Regular',
    primaryMedium: Platform.OS === 'ios' ? 'Inter-Medium' : 'Inter_500Medium',
    primarySemiBold: Platform.OS === 'ios' ? 'Inter-SemiBold' : 'Inter_600SemiBold',
    primaryBold: Platform.OS === 'ios' ? 'Inter-Bold' : 'Inter_700Bold',
  },
  fontSize: {
    xs: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    xs: 14,
    small: 18,
    regular: 22,
    medium: 24,
    large: 28,
    xl: 30,
    xxl: 36,
    xxxl: 42,
  }
};

export default Typography;
