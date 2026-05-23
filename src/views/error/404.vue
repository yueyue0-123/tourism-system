<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Извините, запрашиваемая страница не существует</p>
      <router-link to="/" class="back-home">
        На главную
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.content {
  padding: 20px;
}

h1 {
  font-size: 120px;
  margin: 0;
  color: #1890ff;
}

h2 {
  font-size: 30px;
  margin: 20px 0;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 20px;
}

.back-home {
  display: inline-block;
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background 0.3s;
}

.back-home:hover {
  background: #40a9ff;
}
</style> 