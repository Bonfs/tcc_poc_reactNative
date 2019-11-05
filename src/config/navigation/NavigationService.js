/**
 * @flow
 */
import { NavigationActions, StackActions } from "react-navigation";

class NavigationService {
  static container: any;

  static onRef = (container: any) => {
    NavigationService.container = container;
  };

  static reset = (route: string = "Home", params: any = {}) => {
    NavigationService.container.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: route, params: params })
        ]
      })
    );
  };

  static navigate = (screen: string, params: any = {}) => {
    NavigationService.container.dispatch(
      NavigationActions.navigate({
        routeName: screen,
        params: params
      })
    );
  };
}

export default NavigationService;