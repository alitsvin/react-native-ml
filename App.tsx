import React from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import Main from './src/screens/Main';

const screenHeight = Dimensions.get('screen').height;

const App = () => {
  return (
    <View style={styles.body}>
      <Main/>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    height: screenHeight,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default App;
