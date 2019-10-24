import * as jpeg from 'jpeg-js';
import * as tf from '@tensorflow/tfjs';
import { Image } from 'react-native';

export function imageToTensor (rawImageData: any): any {
  const TO_UINT8ARRAY = true;
  // decode image
  const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
  // Drop the alpha channel info for mobilenet
  // The TO_UINT8ARRAY array represents an array of 8-bit unsigned integers
  const buffer = new Uint8Array(width * height * 3);
  let offset = 0; // offset into original data
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];

    offset += 4;
  }

  return tf.tensor3d(buffer, [height, width, 3]);
}

export async function classifyImage (model: any, image: any, cb: Function) {
  try {
    const imageAssetPath = Image.resolveAssetSource(image)
    const response = await tf.fetch(imageAssetPath.uri, {}, { isBinary: true })
    const rawImageData = await response.arrayBuffer()
    const imageTensor = imageToTensor(rawImageData)
    const predictions = await model.classify(imageTensor)
    cb(predictions);
    console.warn(predictions)
  } catch (error) {
    console.warn(error)
  }
}

export default {
  imageToTensor,
  classifyImage
}
