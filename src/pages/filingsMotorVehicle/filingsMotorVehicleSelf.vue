<template>
  <div class="filings_motor_vehicle_self">
    <van-form @submit="onSubmit">
      <van-field
        v-model="params.ownerName"
        name="车主姓名"
        placeholder="请输入车主姓名"
        class="select_and_input"
        :rules="[{ required: true, message: '请输入车主姓名', trigger: 'onBlur' }]"
      >
        <template #label>
          <div class="customlable">
            <div><span style="color: red">*&nbsp;</span><span>车主姓名</span></div>
          </div>
        </template>
      </van-field>
      <van-field
        v-model="params.idCard"
        name="身份证号"
        placeholder="请输入身份证号"
        class="select_and_input"
        :rules="[{ validator: validIdCard, message: '请输入正确的身份证号', trigger: 'onBlur' }]"
      >
        <template #label>
          <div class="customlable">
            <div><span style="color: red">*&nbsp;</span><span>身份证号</span></div>
          </div>
        </template>
      </van-field>
      <van-field
        v-model="licenseNumber"
        name="号牌号码"
        placeholder="请输入号牌号码"
        class="select_and_input"
        :rules="[{ validator, message: '请输入正确的号牌号码', trigger: 'onBlur' }]"
      >
        <template #label>
          <div class="customlable">
            <div><span style="color: red">*&nbsp;</span><span>号牌号码</span></div>
            <div @click="show = true" class="sufix">{{ sufix }}<van-icon name="arrow-down" /></div>
          </div>
        </template>
      </van-field>
      <van-button type="primary" size="large" native-type="submit" class="btn">备案</van-button>
    </van-form>
    <div class="tip"
      >若需要备案非本人机动车，<span
        class="text-underline"
        @click="$router.push('/filingsMotorVehicleNotSelf')"
        >请点击此处</span
      ></div
    >
    <van-action-sheet
      description="从以下来源中选择"
      v-model:show="show"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>

<script setup lang="ts">
  import api from '@/api/license';
  import { useRouter } from 'vue-router';
  import { useToast } from '@/hooks';
  import { licenseStore } from '@/store';
  import { IdentityCodeValid } from '@/utils';
  const lStore = licenseStore();
  const { startLoading, stopLoading, successMsg, failMsg } = useToast();
  const router = useRouter();
  const show = ref(false);
  const sufix = ref('鲁B');
  const actions = ref([{ name: '鲁B' }, { name: '鲁U' }]);
  const params = ref({
    registerName: '',
    registerPhone: '',
    idCard: '',
    ownerName: '',
    ownerPhone: '',
    plateNum: '',
    engineNumTail: '',
    relationshipWithOwner: '',
    userId: 0,
  });
  const onSelect = (item: any) => {
    show.value = false;
    sufix.value = item.name;
  };
  const pattern = /^[A-Z0-9]{5}$/;
  const validator = (val: string) => pattern.test(val);
  const validIdCard = (val: string) => IdentityCodeValid(val);
  const licenseNumber = ref('');
  const onSubmit = () => {
    startLoading();
    const sendParams = {
      registerName: '陈少',
      registerPhone: '15210622405',
      ownerName: params.value.ownerName,
      idCard: params.value.idCard,
      ownerPhone: '15210622405',
      plateNum: sufix.value + licenseNumber.value,
      engineNumTail: '',
      relationshipWithOwner: '',
      userId: 0,
    };
    api
      .registerOwner(sendParams)
      .then((res: any) => {
        if (res.success) {
          setTimeout(() => {
            stopLoading();
            router.push('/filingsMotorVehicleStatus');
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
</script>
<style lang="less" scoped>
  .btn {
    margin-top: 25px;
  }
  .text-underline {
    border-bottom: 2px solid #457cc9;
  }
  .tip {
    margin-top: 30px;
    width: 100%;
    text-align: center;
    font-size: 15px;
    color: #457cc9;
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
  .filings_motor_vehicle_self {
    :deep(.customlable) {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 155px !important;
    }
    :deep(.select_and_input) {
      & .van-field__body {
        position: relative !important;
        left: 70px !important;
        width: 111px !important;
      }
      & .van-field__error-message {
        padding-left: 75px !important;
      }
    }
  }
</style>
