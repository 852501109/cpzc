import { defineStore } from 'pinia';

export const licenseStore = defineStore('license', {
  // id: 'user', // id必填，且需要唯一。两种写法
  state: () => {
    return {
      status: 1,
      licenseInfo: {
        plateNum: '',
        ownerName: '',
      },
    };
  },
  getters: {},
  actions: {
    updateStatus(status: number) {
      this.status = status;
    },
    changeLicense(license: any) {
      this.licenseInfo = license;
    },
  },
});
