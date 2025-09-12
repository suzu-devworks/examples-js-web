/* eslint-disable @typescript-eslint/no-empty-object-type */

interface BatteryManager extends EventTarget {
  readonly charging?: boolean
  readonly chargingTime?: number
  readonly dischargingTime?: number
  readonly level?: number
  onchargingchange?: EventListener
  onchargingtimechange?: EventListener
  ondischargingtimechange?: EventListener
  onlevelchange?: EventListener
}

declare interface Navigator extends NavigatorNetworkInformation {}
declare interface WorkerNavigator extends NavigatorNetworkInformation {}

declare interface NavigatorNetworkInformation {
  readonly getBattery?: () => Promise<BatteryManager>
}
