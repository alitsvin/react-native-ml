import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  const modelRef = useRef();

  const load = async () => {
    try {
      await tf.ready();
      modelRef.current = await mobilenet.load();
    } catch (e) {
      console.warn('tfjs is not ready!', e);
    }
  }

  useEffect(() => {
    load();
  }, []);
  
  const text = 'TF and model are Ready!';

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
