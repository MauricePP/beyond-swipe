import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../../constants/Colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'none' | 'low' | 'medium' | 'high';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  elevation = 'medium'
}) => {
  return (
    <View style={[styles.card, styles[`${elevation}Elevation`], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.paper,
    borderRadius: 12,
    padding: 16,
  },
  noneElevation: {
    // No shadow
  },
  lowElevation: {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  mediumElevation: {
    boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  highElevation: {
    boxShadow: '0px 4px 5.46px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
});

export default Card;
