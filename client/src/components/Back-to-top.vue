<template>
    <back-to-top text="Back to top" visibleoffset="500">
    <button class="button is-primary btn-to-top"> <i class="fa fa-chevron-up"></i> </button>
</back-to-top>
</template>

<script>
import BackToTop from 'vue-backtotop';
export default {
    components: { BackToTop },
}
</script>

<style scoped>
.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
}
</style>
