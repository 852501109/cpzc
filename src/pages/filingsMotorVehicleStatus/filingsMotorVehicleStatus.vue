<template>
  <div class="head">
    <div>
      <div class="img"><img src="@/assets/img/dkw.png" /></div>
      <div>
        <div
          >{{ lStore.licenseInfo.plateNum }} &nbsp;&nbsp;<span
            class="already_vehicle"
            v-if="lStore.status !== 1"
            >已报备</span
          ></div
        >
        <div>{{ lStore.licenseInfo.ownerName }}</div>
      </div>
    </div>
    <van-button type="danger" size="small" @click="sure" v-if="lStore.status === 1"
      >&nbsp;&nbsp;&nbsp;报备&nbsp;&nbsp;&nbsp;&nbsp;</van-button
    >
    <van-button type="primary" size="small" @click="cancel" v-if="lStore.status !== 1"
      >&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;</van-button
    >
  </div>
  <van-notice-bar
    color="#1677ff"
    background="#ecf9ff"
    :speed="50"
    left-icon="volume-o"
    v-if="lStore.status === 1"
  >
    本应用已经成功帮助12,013万位车主找回了他们心爱的车牌。
  </van-notice-bar>
  <img class="wxts" src="@/assets/img/wxts.png" v-if="lStore.status === 2" />
  <van-notice-bar wrapable :scrollable="false" v-if="lStore.status === 2">
    <div style="font-weight: bold">您可以补办丢失车牌:</div>

    <div>方法一：</div>
    <div style="padding-left: 10px">
      <div>个人车辆携带身份证，到交警大队车管所办理即可。</div>
      <div>企业车辆需要携带以下证件:</div>
      <div style="padding-left: 10px">
        <div>1、社会统一信用代码证原件; </div>
        <div>2、企业公章 </div>
        <div>3、经办人身份证</div>
        <div>4、加盖公章的委托车，到交警大队车辆管理所办理即可。</div>
      </div>
      <div>地址：胶州市香港东路99号交警大队车管所。</div>
      <div>咨询电话：58785171。</div>
    </div>

    <div>方法二：</div>
    <div style="padding-left: 10px">通过手机APP“交管12123”进行办理。</div>
  </van-notice-bar>
  <list v-if="lStore.status === 1"></list>
  <alreadyBack v-if="lStore.status === 3" :currentMsg="currentMsg"></alreadyBack>
</template>

<script setup lang="ts">
  import api from '@/api/license';
  import list from './scrollList.vue';
  import alreadyBack from './alreadyBack.vue';
  import { useToast } from '@/hooks';
  import { licenseStore } from '@/store';
  import { useRouter } from 'vue-router';
  const { startLoading, stopLoading, failMsg } = useToast();
  const lStore = licenseStore();
  const currentMsg = ref({});
  const router = useRouter();
  const name = ref('*李明');
  const sure = () => {
    startLoading();
    api
      .loseReport({
        plateNum: lStore.licenseInfo.plateNum,
        userId: 0,
      })
      .then((res: any) => {
        if (res.success) {
          // 返回success true 成功代表已经报备过
          if (res.data === null) {
            lStore.updateStatus(2);
          } else {
            lStore.updateStatus(3);
            currentMsg.value = res.data;
          }
          console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', lStore.status);
          stopLoading();
        } else {
          // 30001 代表没有报备过，让他线下自己报备
          if (res.code === 30001) {
            failMsg(res.message);
          } else {
            failMsg(res.message);
          }
          stopLoading();
        }
      })
      .catch((err: any) => {
        failMsg(err.message);
        stopLoading();
      });
  };
  onMounted(() => {
    initLicenseInfo();
  });
  const initLicenseInfo = () => {
    startLoading();
    api
      .getRegisterVehicle({ userId: 0 })
      .then((res) => {
        if (res.success) {
          stopLoading();
          lStore.changeLicense(res.data[0]);
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
  const cancel = () => {
    lStore.updateStatus(1);
  };
</script>
<style lang="less" scoped>
  .flex(@justify) {
    display: flex;
    justify-content: @justify;
    align-items: center;
  }
  .wxts {
    width: 100%;
  }
  .head {
    width: 97%;
    margin: 0 auto;
    font-size: 14px;
    .flex(space-between);
    > div {
      .flex(flex-start);
    }
    .img {
      .flex(center);
      width: 50px;
      height: 50px;
      border-radius: 50px;
      background: rgba(112, 112, 112, 0.1);
      margin-right: 15px;
    }
    img {
      width: 35px;
    }
  }
  .already_vehicle {
    color: #fff;
    background: #2bc561;
    border-radius: 2.5px;
    padding: 2.5px;
  }
</style>
