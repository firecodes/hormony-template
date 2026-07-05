import { RNPackageContext, RNPackage } from '@rnoh/react-native-openharmony';
import { GeneratedPackage } from '../TurboModule/GeneratedPackage';
import { RNCWebViewPackage } from '@react-native-oh-tpl/react-native-webview/ts';
import { RNCCheckBoxPackage } from '@react-native-ohos/checkbox/ts';
import { ViewShotPackage } from '@react-native-oh-tpl/react-native-view-shot/ts';

export function createRNPackages(ctx: RNPackageContext): RNPackage[] {
  return [
    new GeneratedPackage(ctx),
    new RNCWebViewPackage(ctx),
    new ViewShotPackage(ctx),
    new RNCCheckBoxPackage(ctx),
  ];
}