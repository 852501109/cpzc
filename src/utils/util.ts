export const toPhoneCall = (mobile: number | string) => {
  const url = `tel:${mobile}`;
  window.location.href = url;
};

/**
 * 动态设置css全局变量实现旋转
 * transform: rotate(var(--image-rotate))
 * @param deg 旋转角度
 * @param prop css变量, 默认'--image-rotate'
 */
export const setRotate = (deg: string, prop = '--image-rotate') => {
  let rotate = document.documentElement.style.getPropertyValue(prop) || '0deg';
  if (typeof deg === 'string') {
    rotate = deg;
  } else {
    rotate = parseInt(rotate) + 90 + 'deg';
  }
  document.documentElement.style.setProperty(prop, rotate);
};
export const IdentityCodeValid = (code: any) => {
  let iSum = 0;
  let result = true;
  interface CityMap {
    [key: number]: string;
  }
  const aCity: CityMap = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '內蒙古',
    21: '遼寧',
    22: '吉林',
    23: '黑龍江',
    31: '上海',
    32: '江蘇',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山東',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '廣東',
    45: '廣西',
    46: '海南',
    50: '重慶',
    51: '四川',
    52: '貴州',
    53: '雲南',
    54: '西藏',
    61: '陝西',
    62: '甘肅',
    63: '青海',
    64: '寧夏',
    65: '新疆',
    71: '臺灣',
    81: '香港',
    82: '澳門',
    91: '國外',
  };
  if (code.length !== 15 && code.length !== 18) {
    result = false;
    return result;
  }
  if (code.length === 15) {
    // 15位身份證驗證
    if (isNaN(code)) {
      result = false;
      return result;
    }
    if (aCity[parseInt(code?.substr(0, 2))] === null) {
      result = false;
      return result;
    }
    var sBirthday =
      '19' + code.substr(6, 2) + '-' + Number(code.substr(8, 2)) + '-' + Number(code.substr(10, 2));
    var d = new Date(sBirthday.replace(/-/g, '/'));
    if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()) {
      result = false;

      return result;
    }
  } else {
    // 18位身份證驗證
    if (!/^\d{17}(\d|x)$/i.test(code)) {
      result = false;
      return result;
    }
    code = code.replace(/x$/i, 'a');
    if (aCity[parseInt(code.substr(0, 2))] === null) {
      result = false;
      return result;
    }
    sBirthday =
      code.substr(6, 4) + '-' + Number(code.substr(10, 2)) + '-' + Number(code.substr(12, 2));
    d = new Date(sBirthday.replace(/-/g, '/'));
    if (sBirthday !== d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()) {
      result = false;

      return result;
    }
    for (let i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(code.charAt(17 - i), 11);
    if (iSum % 11 !== 1) {
      result = false;
      return result;
    }
  }
  return result;
};
