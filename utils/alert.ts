import { coco_Alert } from 'coco-alert/react';

export const showAlert = {
  success: (message: string) => coco_Alert.success(message),
  error: (message: string) => coco_Alert.error(message),
  warning: (message: string) => coco_Alert.warning(message),
  info: (message: string) => coco_Alert.info(message),
};

export default showAlert;