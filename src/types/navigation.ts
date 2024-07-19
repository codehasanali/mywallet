import { NavigationProp, ParamListBase, RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
export const useAppNavigation: () => NavigationProp<ParamListBase> = useNavigation;