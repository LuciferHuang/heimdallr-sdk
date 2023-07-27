<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
  setup() {
    // 慢API
    // fetch('http://localhost:8001/test')
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:8001/test')
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
    xhr.send();
    setTimeout(() => {
      // 不存在接口
      fetch('http://localhost:8001/error');
    }, 2000);
    return {}
  }
}
</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
