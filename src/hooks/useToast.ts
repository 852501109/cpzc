/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toast } from 'vant';

export function useToast() {
  let toast: any = null;

  const startLoading = () => {
    toast = Toast.loading({
      duration: 0,
      forbidClick: true,
      message: '加载中',
      loadingType: 'spinner',
    });
  };
  const successMsg = (msg: string) => {
    toast = Toast.success(msg);
  };
  const failMsg = (msg: string) => {
    toast = Toast.fail(msg);
  };
  const stopLoading = () => {
    toast && toast.clear();
  };
  const showToastCustomIcon = (msg: string, icon: string) => {
    toast = Toast({
      forbidClick: true,
      message: msg,
      icon: icon,
    });
  };
  onBeforeUnmount(stopLoading);

  return { startLoading, stopLoading, successMsg, failMsg, showToastCustomIcon };
}
