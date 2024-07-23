<template>
  <div class="lostLicense_plate_return">
    <van-notice-bar
      wrapable
      :scrollable="false"
      text="感谢您使用车牌归还业务应用!请您提供您的姓联系电话和归还地址，方便车主尽快与您取得联系，同时妥善保管遗失车牌，避免引起不必要的纠纷。您的善举和配合让我们对您深感敬佩，您的归还行为将为他人提供便利和安全。我们会妥善保护您的个人信息安全与隐私，再次衷心感谢您为社会做出的贡!"
    />
    <!-- <van-button @click="fillData" round block type="primary">一键填写</van-button> -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.name"
        name="归还人姓名"
        placeholder="请输入您的姓名"
        :rules="[{ required: true, message: '请填写您的姓名' }]"
      >
        <template #label> <span style="color: red">*&nbsp;</span>归还人姓名</template>
      </van-field>
      <van-field
        v-model="form.phone"
        name="pattern"
        placeholder="请输入联系电话"
        :rules="[{ validator: validatorTel, message: '请输入正确的电话号码' }]"
      >
        <template #label> <span style="color: red">*&nbsp;</span>联系电话</template>
      </van-field>
      <van-field
        v-model="form.pickPlace"
        name="捡到地址"
        placeholder="请输入捡到地址"
        :rules="[{ required: true, message: '请输入捡到地址' }]"
      >
        <template #label> <span style="color: red">*&nbsp;</span>捡到地址</template>
      </van-field>
      <van-field
        v-model="form.returnPlace"
        name="归还地址"
        placeholder="请输入归还地址"
        :rules="[{ required: true, message: '请输入归还地址' }]"
      >
        <template #label><span style="color: red">*&nbsp;</span>归还地址</template>
      </van-field>
      <van-field
        v-model="sufixType"
        name="号牌种类"
        placeholder="请选择号牌种类"
        :rules="[{ required: true, message: '请选择号牌种类' }]"
        @click="showType = true"
      >
        <template #label>
          <div><span style="color: red">*&nbsp;</span><span>号牌种类</span></div>
        </template>
      </van-field>
      <van-field
        v-model="form.plateNum"
        name="号牌号码"
        placeholder="请输入号牌号码"
        class="select_and_input"
        :rules="[{ validator, message: '请输入正确的号牌号码', trigger: 'onBlur' }]"
      >
        <template #label>
          <div class="customlable">
            <div><span style="color: red">*&nbsp;</span><span>号牌号码</span></div>
            <div class="sufix" @click="show = true">{{ sufix }}<van-icon name="arrow-down" /></div>
          </div>
        </template>
      </van-field>
      <van-field
        name="uploader"
        :rules="[{ validator: validatorPhoto, message: '请上传号牌照片', trigger: 'onBlur' }]"
      >
        <template #label> <span style="color: red">*&nbsp;</span>号牌照片</template>
        <template #input>
          <van-uploader multiple :max-count="9" :after-read="handleFile" v-model="fileList" />
        </template>
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 确认 </van-button>
      </div>
    </van-form>
    <van-action-sheet
      description="从以下来源中选择"
      v-model:show="show"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      close-on-click-action
    />
    <van-action-sheet
      description="从以下来源中选择"
      v-model:show="showType"
      :actions="actionTypes"
      @select="onSelectTypes"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>

<script setup lang="ts">
  import api from '@/api/license';
  import { useRouter } from 'vue-router';
  // import { licenseStore } from '@/store';
  import { useToast } from '@/hooks';
  // import Compressor from 'compressorjs';
  const { startLoading, stopLoading, successMsg, failMsg } = useToast();
  const router = useRouter();
  const fileList = ref([]);

  const form = ref({
    name: '',
    phone: '',
    pickPlace: '',
    returnPlace: '',
    plateNum: '',
  });
  const fillData = () => {
    form.value.name = '张三';
    form.value.phone = '13267891234';
    form.value.pickPlace = '崂山街道';
    form.value.returnPlace = '李沧公园';
    form.value.plateNum = '3967X';
  };
  const show = ref(false);
  const sufix = ref('鲁B');
  const actions = ref([{ name: '鲁B' }, { name: '鲁U' }]);
  const showType = ref(false);
  const sufixType = ref('小型汽车');
  const actionTypes = ref([{ name: '小型汽车' }, { name: '电动汽车' }]);
  const handleFile = () => {
    if (fileList.value.length > 1) return;
  };
  const reWriteFile = (file: any) => {
    let binary = atob(file.content.split(',')[1]);
    let array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: 'image/png' });
    return blob;
  };
  const pattern = /^[A-Z0-9]{5}$/;
  const validator = (val: string) => pattern.test(val);
  const chinaPhoneNumberRegex =
    /^((0\d{2,3}\s?-?\s?\d{7,8})|(1[34578]\d{9})|(400\d{7})|(800\d{7}))$/;

  const validatorTel = (val: string) => chinaPhoneNumberRegex.test(val);
  const validatorPhoto = () => {
    return fileList.value.length > 0;
  };
  const onSubmit = () => {
    const formData: any = new FormData();
    formData.append('name', form.value.name);
    formData.append('phone', form.value.phone);
    formData.append('pickPlace', form.value.pickPlace);
    formData.append('returnPlace', form.value.returnPlace);
    formData.append('plateNum', sufix.value + form.value.plateNum);
    for (let i = 0; i < fileList.value.length; i++) {
      const file: any = fileList.value[i];
      formData.append('images', reWriteFile(file), file.file?.name);
    }
    startLoading();
    api
      .plateReturn(formData)
      .then((res: any) => {
        if (res.success) {
          setTimeout(() => {
            stopLoading();
            successMsg(res.message);
            router.push('/license');
          }, 1000);
        } else {
          failMsg(res.message);
          stopLoading();
        }
      })
      .catch((err: any) => {
        failMsg(err.message);
        stopLoading();
      });
  };

  const onSelect = (item: any) => {
    show.value = false;
    sufix.value = item.name;
  };
  const onSelectTypes = (item: any) => {
    showType.value = false;
    sufixType.value = item.name;
  };
</script>
<style lang="less" scoped>
  .btn {
    margin-top: 25px;
  }
  .text-underline {
    border-bottom: 2px solid #457cc9;
  }
  .tip {
    margin: 25px 0;
    padding-left: 15px;
    width: 100%;
    text-align: left;
    font-size: 15px;
  }
  .flex-container() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .sufix {
    position: relative;
    z-index: 1;
    width: 55px;
    height: 30px;
    line-height: 30px;
    border-radius: 5px;
    background: #457cc9;
    color: #fff;
    text-align: center;
    margin-top: -3.5px;
  }

  .lostLicense_plate_return {
    :deep(.customlabel) {
      position: relative;
      width: 110px;
    }

    :deep(.customlable) {
      position: relative;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 155px !important;
    }
    :deep(.select_and_input) {
      & .van-field__body {
        position: relative !important;
        left: 70px !important;
        width: 150px !important;
      }
      & .van-field__error-message {
        padding-left: 75px !important;
      }
    }
  }
</style>
