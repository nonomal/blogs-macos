<template>
  <div class="search" @click="startGlobalSearch">
    <i class="iconfont macos-sousuo"></i>
  </div>
</template>
<script setup>
import { getCurrentInstance, onUnmounted } from "vue";
import { useSystemStore } from "@/store/index";
import { SET_START_GLOBAL_SEARCH } from "@/config/store.config";

const { proxy } = getCurrentInstance();
const systemStore = useSystemStore();
function startGlobalSearch() {
  const status = systemStore.STARTGLOBALSEARCH;
  systemStore[SET_START_GLOBAL_SEARCH](!status);
}
function globalKeyup(e) {
  const { code } = e;
  if (code === "Shift") {
    proxy.$continuousEvent.checkDouble(code, startGlobalSearch, 500);
  }
  if (code === "Escape") {
    const status = systemStore.STARTGLOBALSEARCH;
    status && systemStore[SET_START_GLOBAL_SEARCH](!status);
  }
}
proxy.$eventBus.$on("globalKeyup", globalKeyup);
onUnmounted(() => {
  proxy.$eventBus.$off("globalKeyup", globalKeyup);
});
</script>

<style lang="less">
.search {
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  border-radius: 3px;
  height: 100%;
  margin: 0 5px;
  .macos-sousuo {
    font-size: 16px;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
</style>
