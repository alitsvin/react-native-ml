import React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

const Main = (props: any): any => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);
  
  const text = 'Main';

  return (
    <View>
      { loading
        ? <ActivityIndicator animating={loading}/>
        : <Text>{'Main'}</Text>
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
