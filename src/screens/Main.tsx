import React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

const Main = (props: any): React.JSXElement => {
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      await tf.ready();
      setTimeout(() => setLoading(false), 3000);
    } catch (e) {
      console.warn('tfjs is not ready!', e);
    }
  }

  useEffect(() => {
    load();
  }, []);
  
  const text = 'Ready!';

  return (
    <View>
      { loading
        ? <ActivityIndicator animating={loading} size="large" />
        : <Text>{text}</Text>
      }
    </View>
  )
}

export default Main;

const styles = StyleSheet.create({
  main: {
    display: 'flex'
  }
});
