import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import ImagePicker from 'react-native-image-picker/src';

import * as ImageService from '../services/ImageService';

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
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External storage',
          message: 'App needs access to your gallery',
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

  const takePicture = async function(camera: any) {
    // const options = { quality: 0.5, base64: true };
    // const data = await camera.takePictureAsync(options);
    //  eslint-disable-next-line
    // console.warn(data.uri);
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, async (response) => {
      // console.warn(response);
      // Same code as in above section!
      if (response) {
        const predictions = await ImageService.classifyImage(modelRef.current, response);
      }
    });
  };

  useEffect(function instantiate () {
    load();
    requestCameraPermissions();
  }, []);
  
  return (
    <View style={styles.main}>
      { loading
        ? <ActivityIndicator animating={loading} size="large" />
        : <Text>{'TF and model are Ready!'}</Text>
      }
      { cameraPermissionGranted
        ? <Text>We are ready to use camera</Text>
        : <Text>Needs camera permission</Text>
      }
      {/* <RNCamera
          // ref={ref => {
          //   camera.current = ref;
          // }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
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
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            if (status !== 'READY') return <PendingView />;
            return (
              <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
                  <Text style={{ fontSize: 14 }}>   </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        </RNCamera> */}
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => takePicture(camera)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}>Select image</Text>
          </TouchableOpacity>
        </View>
    </View>
  )
}

// const PendingView = () => (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: 'lightgreen',
//       justifyContent: 'center',
//       alignItems: 'center',
//     }}
//   >
//     <Text>Waiting</Text>
//   </View>
// );

export default Main;

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
