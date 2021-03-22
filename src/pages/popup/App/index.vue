<template>
  <div class="popup-warpper">
    <a-button type="primary" shape="circle" :size="size" @click="inject('cs')">
      CS
    </a-button>
    <a-button type="primary" shape="circle" :size="size" @click="inject('TP')">
      TP
    </a-button>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { sendToBackground } from "./use";
export default defineComponent({
  setup() {
    const inject = name => {
      // 告诉content我要注入app
      sendToBackground(
        {
          command: "injectApp",
          value: name
        },
        res => {
          console.log("执行成功回调", res);
        }
      );
    };
    return {
      size: ref("large"),
      inject
    };
  }
});
</script>
<style lang="less" scoped>
.popup-warpper {
  padding: 20px;
  width: 200px;
  height: 100px;
}
</style>
