import http from '@/utils/http';
export interface plateReturnParams {
  name: string;
  phone: string;
  pickPlace: string;
  returnPlace: string;
  plateNum: string;
  images: string[];
}
export interface registerOwnerParams {
  registerName: string;
  registerPhone: string;
  ownerName: string;
  ownerPhone: string;
  plateNum: string;
  engineNumTail: string;
  relationshipWithOwner: string;
}
export interface registerOwnerParams {
  registerName: string;
  registerPhone: string;
  ownerName: string;
  ownerPhone: string;
  plateNum: string;
  engineNumTail: string;
  relationshipWithOwner: string;
}

export interface registerNotOwnerParams {
  registerName: string;
  registerPhone: string;
  ownerName: string;
  ownerPhone: string;
  plateNum: string;
  engineNumTail: string;
  relationshipWithOwner: string;
  userId: number;
}

export interface getRegisterVehicleParams {
  userId: number;
}

export interface getSmsCodeParams {
  plateNum: string;
}

export interface loseReportParams {
  plateNum: string;
  userId: number;
}
export default {
  async getRelationshipWithOwner() {
    return await http.get('/frame/plate/vehicleRegister/getRelationshipWithOwner.do');
  },
  async getPlateReturnList() {
    return await http.get('/frame/plate/plateReturn/getPlateReturnList');
  },
  async registerOwner(data: registerOwnerParams) {
    return await http.post('/frame/plate/vehicleRegister/registerVehicle', data);
  },
  async plateReturn(data: plateReturnParams) {
    return await http.upload('/frame/plate/plateReturn/plateReturn', data);
  },
  async getSmsCode(params: getSmsCodeParams) {
    return await http.get(`/frame/plate/vehicleRegister/getSmsCode`, params);
  },
  async registerNotOwner(data: registerNotOwnerParams, smsCode: string) {
    return await http.post(
      `/frame/plate/vehicleRegister/registerNotOwner?smsCode=${smsCode}`,
      data
    );
  },
  async getRegisterVehicle(params: getRegisterVehicleParams) {
    return await http.get('/frame/plate/vehicleRegister/getRegisterVehicle', params);
  },
  async loseReport(data: loseReportParams) {
    return await http.post(
      `/frame/plate/plateLose/loseReport?plateNum=${data.plateNum}&userId=${data.userId}`
    );
  },
};
