import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';

const Main = (props: any): React.FunctionComponentElement<any> => {
  const [loading, setLoading] = useState(true);
  const [cameraPermissionGranted, setCameraPermission] = useState(false);
  const [predictions, setPredictions] = useState(null);

  // next step: connect camera or gallery
  
  const modelRef = useRef();
  const image = useRef();
  const camera = useRef();

  const load = async () => {
    try {
      await tf.ready();
      modelRef.current = await mobilenet.load();
      setLoading(false);
    } catch (e) {
      console.warn('tfjs is not ready!', e);
    }
  }

  const requestCameraPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message: 'App needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setCameraPermission(true);
      } else {
        console.warn('Camera permission denied');
      }
    } catch (e) {
      console.warn('request camera permissions failed', e);
    }
  }

  useEffect(function instantiate () {
    load();
    requestCameraPermissions();
  }, []);
  
  return (
    <View>
      { loading
        ? <ActivityIndicator animating={loading} size="large" />
        : <Text>{'TF and model are Ready!'}</Text>
      }
      { cameraPermissionGranted
        ? <Text>We are ready to use camera</Text>
        : <Text>Needs camera permission</Text>
      }
      <RNCamera
          // ref={ref => {
          //   camera.current = ref;
          // }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
          captureAudio={false}
        />
    </View>
  )
}

export default Main;

const styles = StyleSheet.create({
  main: {
    display: 'flex'
  },
  preview: {

  }
});
