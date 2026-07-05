import { AddressDTO, buildAddressListPage } from 'address_management'
import { AddressParam, RNRouterParam } from '../../model/RNRouterParam'
import { LoadManager } from '../../rn'
import { router } from '@kit.ArkUI'

@Entry
@Component
struct AddressListPage {
  @State needAutoBack: boolean = true;

  aboutToAppear(): void {
    let routerParam: RNRouterParam | undefined = router.getParams() ? router.getParams() as RNRouterParam : undefined;
    if (routerParam?.params) {
      try {
        let param = JSON.parse(routerParam.params) as AddressParam;
        this.needAutoBack = !param.fromProfile;
      } catch (e) {
      }
    }
  }

  private onSelect = (address: AddressDTO) => {
    LoadManager.getRNInstance(AppStorage.get('isMetroAvailable') as boolean)?.emitDeviceEvent('onAddressSelect', {
      address: JSON.stringify(address),
    });
    this.needAutoBack && this.getUIContext().getRouter().back();
  }

  build() {
    Column() {
      buildAddressListPage(this.onSelect)
    }.backgroundColor($r('app.color.bg_color'))
    .padding({ top: AppStorage.get<number>('topRectHeight'), bottom: AppStorage.get<number>('bottomRectHeight') })
  }
}