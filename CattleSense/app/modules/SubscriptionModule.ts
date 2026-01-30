import { NativeModules } from 'react-native';

const { SubscriptionModule } = NativeModules;

interface SubscriptionModuleType {
    openSubscriptionScreen: () => void;
}

export default SubscriptionModule as SubscriptionModuleType;
