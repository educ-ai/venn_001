import { Alert } from 'react-native';
import i18n from 'localization/i18n';

const t = (key: string) => i18n.t(key);

export const showSuccessAlert = (onSuccess: () => void) => {
  Alert.alert(
    t('onboarding.alert.successTitle'),
    t('onboarding.alert.successMessage'),
    [
      {
        text: t('onboarding.alert.ok'),
        onPress: onSuccess,
      },
    ],
  );
};

export const showFailureAlert = (errorMessage?: string) => {
  Alert.alert(
    t('onboarding.alert.failureTitle'),
    errorMessage ?? t('onboarding.alert.unknownError'),
    [
      {
        text: t('onboarding.alert.ok'),
      },
    ],
  );
};
