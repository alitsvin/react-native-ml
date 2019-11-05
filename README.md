# react-native-ml

got started from https://facebook.github.io/react-native/docs/getting-started
Installed WAtchman from here: https://facebook.github.io/watchman/docs/install.html#buildinstall

inited an app via `react-native init`

# how to run

1. run `yarn start`
2. run `yarn android`

# Troubleshooting

1. Unable to resolve module `./App` from file
  S: `react-native start --reset-cache`

2. Blank screen
  S: Try to reverse the order of starting yarn scripts

3. Keystore file not found for signing config 'debug'
  S: Download from `https://raw.githubusercontent.com/facebook/react-native/master/template/android/app/debug.keystore`