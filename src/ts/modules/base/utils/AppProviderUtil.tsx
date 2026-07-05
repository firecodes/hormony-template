import {AppRegistry, Platform, Text, View} from 'react-native';
import {GlobalToast} from './ToastManager';
import {ToastProvider} from './ToastContext';
import React from 'react';

export function registerProvider() {
  AppRegistry.setWrapperComponentProvider(appParams => {
    return function ({children, ...otherProps}) {
      const WrappedContent = () => {
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

      return (
        <ToastProvider>
          <WrappedContent />
        </ToastProvider>
      );
    };
  });
}
