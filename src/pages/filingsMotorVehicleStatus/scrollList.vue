<template>
  <div class="title">
    <div class="list-item">
      <div>车牌号码</div>
      <div>是否已被领取</div>
      <div>发现时间</div>
    </div>
  </div>
  <div class="scroll-content" ref="scrollContent">
    <div v-for="(item, index) in items" :key="index" class="list-item">
      <div>{{ item.plateNum }}</div>
      <div>
        <span :style="{ color: item.collectState === '已领取' ? '#07c160' : '#ff976a' }">{{
          item.collectState
        }}</span>
      </div>
      <div>{{ item.discoveryTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Ref } from 'vue';
  import licenseApi from '@/api/license';
  import { useToast } from '@/hooks';
  const { startLoading, stopLoading, successMsg, failMsg } = useToast();
  interface licenseInterface {
    plateNum: string;
    collectState: string;
    discoveryTime: string;
  }
  const items = ref<licenseInterface[]>([]);
  const interval = ref<NodeJS.Timer | null>(null);
  const scrollContent: Ref<HTMLElement | null> = ref(null);

  onMounted(() => {
    startLoading();
    licenseApi
      .getPlateReturnList()
      .then((res: any) => {
        if (res.success) {
          items.value = res.data;
          stopLoading();
        } else {
          failMsg(res.message);
          stopLoading();
        }
      })
      .catch((err: any) => {
        failMsg(err.message);
        stopLoading();
      });
    interval.value = setInterval(() => {
      const dom = scrollContent.value;
      if (dom === null || dom.scrollTop === null || dom.scrollHeight === null) return;
      const atBottom = dom.scrollTop + dom.clientHeight >= dom.scrollHeight;
      if (!atBottom) dom.scrollTop += 1;
      else dom.scrollTop = 0;
    }, 25);
  });
  onBeforeUnmount(() => {
    if (interval.value) clearInterval(interval.value);
  });
</script>

<style scoped lang="less">
  .flex(@justify) {
    display: flex;
    justify-content: @justify;
    align-items: center;
  }
  .scroll-content {
    height: 55vh; /* 定义容器高度 */
    overflow: hidden; /* 隐藏滚动条 */
    font-size: 14px;
  }

  .list-item {
    height: 50px; /* 定义列表项高度 */
  }

  @keyframes scrollAnimation {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-100%);
    }
  }
  .title {
    width: 100%;
    padding: 0 25px;
    font-size: 14px;
    .list-item {
      height: 50px;
      line-height: 50px;
    }
  }
  .list-item {
    .flex(space-between);
    text-align: center;
    > div:nth-child(1) {
      width: 20%;
    }
    > div:nth-child(2) {
      width: 40%;
    }
    > div:nth-child(3) {
      width: 40%;
    }
  }
</style>
