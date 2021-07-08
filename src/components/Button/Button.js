import React from 'react';
import { Pressable, ActivityIndicator, Text } from 'react-native';
import styles from './ButtonStyle';

function CustomButton(props) {
  const {
    btnText,
    btnStyles,
    onPress,
    Icon,
    loading,
    disabled
  } = props;

  return (
    <Pressable
      style={[
        styles.button,
        btnStyles,
        styles.withShadow,
        {
          flexDirection: loading ? 'row' : 'row',
          opacity: (loading || disabled) ? 0.7 : 1,
        }
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {Icon ? Icon : null}
      <Text style={styles.text}>{btnText}</Text>
      {loading ? <ActivityIndicator style={styles.loader} size='small' /> : null}
    </Pressable>
  );
}

export default CustomButton;
