import {AppRegistry, Text, View} from 'react-native';

import React from 'react';
import {GlobalToast} from './src/ts/modules/base/utils/ToastManager';

AppRegistry.setWrapperComponentProvider(appParams => {
  return function ({children, ...otherProps}) {
    if (
      Object.keys(otherProps.initialProps).includes('styles') &&
      Object.keys(otherProps.initialProps).includes('stringParam')
    ) {
      return (
        <View style={otherProps.initialProps.styles.container}>
          <View
            style={{
              borderRadius: 10,
              backgroundColor: '#FAE6B1',
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={otherProps.initialProps.styles.apiFontSize}>
              {otherProps.initialProps.stringParam}
            </Text>
          </View>
          <View>{children}</View>
          <GlobalToast />
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, width: '100%', height: '100%'}}>
          {children}
          <GlobalToast />
        </View>
      );
    }
  };
});

require('./src/ts/modules/base/');
