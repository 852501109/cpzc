<template>
  <div class="header">
    <van-nav-bar
      :title="(route.name as string)"
      :left-arrow="route.name !== 'index'"
      @click-left="router.back()"
    >
      <template #right v-if="userStore.navConfig.right">
        <van-button plain type="primary" size="mini">关于</van-button>
        <van-button plain type="primary" size="mini">订阅</van-button>
      </template>
    </van-nav-bar>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from '@/store';
  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();
</script>

<style lang="less" scoped>
  .header {
    .van-nav-bar {
      // background-color: @green;
    }
  }
</style>
