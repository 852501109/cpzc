const appword = 'aKd20dbGdFvmuwrt'; // 固定值

export const getUserInfo = function () {
  lightAppJssdk.user.getUserInfoWithEncryptedParamByAppId({
    appId: '接入方在成功创建应用后自动生成', // 接入方在成功创建应用后自动生成
    success: function (data) {
      if (data == '未登录') onLoginApp();
      else {
        if (typeof data == 'string') data = JSON.parse(data);

        // 对于该方法的返回结果,需要进行两步解密才能得到明文用户信息,
        // 先对返回结果进行sm2解密,需要用到 接入方在创建应用时,选择应用的加密方式为sm2,并成功创建应用后,拿到的应用私钥来进行解密
        const sm2_privateKey =
          '接入方在创建应用时,选择应用的加密方式为sm2,并成功创建应用后,拿到的应用私钥';
        let sm2_encrypt_result = data.data;
        let sm2_decrypt_result = sm2_Decrypt(sm2_encrypt_result, sm2_privateKey);

        if (typeof sm2_decrypt_result == 'string')
          sm2_decrypt_result = JSON.parse(sm2_decrypt_result);

        // 其次,对sm2解密后的结果进行 aes解密
        // aes解密需要用到 appword , 为固定值,使用示例代码中的即可
        let aes_encrypt_result = sm2_decrypt_result.data;
        let aes_decrypt_result = aes_Decrypt(aes_encrypt_result, appword);

        let dom1 = document.getElementById('aesData');
        dom1.value = JSON.stringify(data);
        let dom2 = document.getElementById('desData');
        dom2.value = aes_decrypt_result;
      }
    },
    fail: function (data) { },
  });
};

/**
 * 使用jssdk调用登录页面
 */
function onLoginApp() {
  lightAppJssdk.user.loginapp({
    success: function (data) {
      if (data == '未登录') {
        //取消登录或登录失败，关闭页面
        oncloseWindow();
      } else {
        getUserInfo();
      }
    },
    fail: function (data) {
      //关闭页面
      oncloseWindow();
    },
  });
}

/**
 * 关闭容器
 */
function oncloseWindow() {
  lightAppJssdk.navigation.close({
    success: function (data) { },
    fail: function (data) { },
  });
}

// aes解密
function aes_Decrypt(word, key) {
  var key = CryptoJS.enc.Utf8.parse(key); //转为128bit
  var srcs = CryptoJS.enc.Hex.parse(word); //转为16进制
  var str = CryptoJS.enc.Base64.stringify(srcs); //变为Base64编码的字符串
  var decrypt = CryptoJS.AES.decrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    spadding: CryptoJS.pad.Pkcs7,
  });
  return decrypt.toString(CryptoJS.enc.Utf8);
}

// sm2解密,需要创建加密应用时的私钥
function sm2_Decrypt(word, key) {
  return SM.decrypt(word, key);
}
