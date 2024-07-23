<template>
  <div class="filings_motor_vehicle_not_self">
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.plateNum"
        name="号牌号码"
        placeholder="请输入号牌号码"
        class="select_and_input"
        :rules="[
          { validator: validatorLicense, message: '请输入正确的号牌号码', trigger: 'onBlur' },
        ]"
      >
        <template #label>
          <div class="customlabel_license">
            <div><span style="color: red">*&nbsp;</span><span>号牌号码</span></div>
            <div class="sufix" @click="showLicense = true"
              >{{ sufixLicense }}<van-icon name="arrow-down"
            /></div>
          </div>
        </template>
      </van-field>
      <van-field
        v-model="form.engineNumTail"
        label-class="customlabel"
        placeholder="请输入发动机号后六位"
        :rules="[
          { validator: validatorEngine, message: '请输入正确发动机后6位', trigger: 'onBlur' },
        ]"
      >
        <template #label>
          <div class="customlabel_license">
            <div><span style="color: red">*&nbsp;</span><span>发动机号后六位</span></div>
          </div>
        </template>
      </van-field>
      <van-field
        v-model="form.relationshipWithOwner"
        readonly
        label-class="customlabel"
        placeholder="请选择与车主关系"
        @click="showAlax = true"
        :rules="[{ required: true, message: '请选择与车主关系' }]"
        is-link
      >
        <template #label
          ><div class="customlabel_license">
            <div><span style="color: red">*&nbsp;</span><span>与车主关系</span></div>
          </div></template
        >
      </van-field>
      <div class="tip"
        ><van-icon color="#fac60b" name="info-o" />&nbsp;请输入待备案机动车车主收到短信验证码</div
      >
      <van-field v-model="sms" center clearable label="验证码" placeholder="请输入短信验证码">
        <template #button>
          <div v-if="countDown > 0">{{ countDown }}s</div>
          <van-button v-else size="small" type="primary" @click="getCode">获取验证码</van-button>
        </template>
      </van-field>
      <van-button type="primary" size="large" class="btn" native-type="submit">提交</van-button>
    </van-form>
    <van-action-sheet
      description="从以下来源中选择"
      v-model:show="showLicense"
      :actions="actionsLicense"
      @select="onSelectLicense"
      cancel-text="取消"
      close-on-click-action
    />
    <van-action-sheet
      v-model:show="showAlax"
      :actions="actionsAlax"
      @select="onSelectAlax"
      cancel-text="取消"
      close-on-click-action
    />
  </div>
</template>

<script setup lang="ts">
  import api from '@/api/license';
  import { useToast } from '@/hooks';
  import { useRouter } from 'vue-router';
  const { startLoading, stopLoading, successMsg, failMsg, showToastCustomIcon } = useToast();

  const router = useRouter();
  onMounted(() => {
    api.getRelationshipWithOwner().then((res: any) => {
      actionsAlax.value = res.data;
      console.log('res.data', res.data);
      // 在代码中使用类型断言
      console.log((window as any).urldomaincreatesign);
    });
  });
  const showLicense = ref(false);
  const sufixLicense = ref('鲁B');
  const actionsLicense = ref([{ name: '鲁B' }, { name: '鲁U' }]);
  const actionsAlax = ref([]);
  const showAlax = ref(false);

  interface interActionsAlax {
    name: string;
    code?: number;
  }

  interface interParams {
    registerName: string;
    registerPhone: string;
    ownerName: string;
    ownerPhone: string;
    plateNum: string;
    engineNumTail: string;
    relationshipWithOwner: any;
    userId: number;
  }

  // let actionsAlax: interActionsAlax[] = [];

  const pattern = /^[A-Z0-9]{5}$/;
  const validatorLicense = (val: string) => pattern.test(val);
  const enginePattern = /^[A-Z0-9]{6}$/;
  const validatorEngine = (val: string) => enginePattern.test(val);
  const onSubmit = () => {
    startLoading();
    const params: interParams = {
      registerName: '李少',
      registerPhone: '18732101307',
      ownerName: '',
      ownerPhone: '',
      plateNum: sufixLicense.value + form.value.plateNum,
      engineNumTail: form.value.engineNumTail,
      relationshipWithOwner: actionsAlax.value.find(
        (item: any) => item.name === form.value?.relationshipWithOwner
      )?.code,
      userId: 0,
    };
    console.log('开始发请求', params);
    api
      .registerNotOwner(params, sms.value)
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

  const sms = ref('');
  const form = ref({
    plateNum: '',
    engineNumTail: '',
    relationshipWithOwner: '',
  });
  const countDown = ref(0);
  const startCountDown = () => {
    if (countDown.value === 0) {
      countDown.value = 30; // 设置倒计时秒数为30秒

      const countDownInterval = setInterval(() => {
        countDown.value--;
        if (countDown.value === 0) {
          clearInterval(countDownInterval);
        }
      }, 1000);
    }
  };
  const onSelectAlax = (item: any) => {
    showAlax.value = false;
    form.value.relationshipWithOwner = item.name;
  };
  const onSelectLicense = (item: any) => {
    showLicense.value = false;
    sufixLicense.value = item.name;
  };

  const getCode = () => {
    if (!form.value.plateNum || !pattern.test(form.value.plateNum)) {
      showToastCustomIcon('请先填写号牌号码', 'fail');
      return;
    }
    startCountDown();
    api.getSmsCode({ plateNum: sufixLicense.value + form.value.plateNum });
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
  .filings_motor_vehicle_not_self {
    :deep(.customlabel) {
      width: 110px !important;
    }
    :deep(.customlabel_license) {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      width: 140px !important;
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
