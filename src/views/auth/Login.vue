<template>
  <Auth 
    :formData="activeTab === 'account' ? loginForm : emailLoginForm" 
    :rules="activeTab === 'account' ? accountRules : emailRules" 
    :loading="loading"
    submitText="Войти"
    @submit="handleSubmit"
    ref="authFormRef"
  >
    <template #form-items>
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="По логину и паролю" name="account">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username"
              :prefix-icon="User"
              placeholder="Введите имя пользователя">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码">
            </el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="По email" name="email">
          <el-form-item prop="email">
            <el-input 
              v-model="emailLoginForm.email"
              :prefix-icon="Message"
              placeholder="Введите email">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="emailLoginForm.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码">
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </template>

    <template #auth-links>
      <router-link to="/register">Зарегистрироваться</router-link>
    </template>
  </Auth>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Auth from './Auth.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authFormRef = ref(null)
const loading = ref(false)
const activeTab = ref('account')

const loginForm = reactive({
  username: '',
  password: ''
})

const emailLoginForm = reactive({
  email: '',
  password: ''
})

const validateEmail = (rule, value, callback) => {
  if (!value) {
    callback(new Error('Email не может быть пустым'))
    return
  }
  
  const emailRegex = /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if (!emailRegex.test(value)) {
    callback(new Error('Неверный формат email'))
  } else {
    callback()
  }
}

const accountRules = {
  username: [
    { required: true, message: 'Введите имя пользователя', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const emailRules = {
  email: [
    { required: true, message: 'Введите email', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const handleTabClick = () => {
  // 切换标签时重置表单
  if (authFormRef.value && authFormRef.value.formRef) {
    authFormRef.value.formRef.resetFields()
  }
  
  if (activeTab.value === 'account') {
    // 重置账号密码登录表单
    Object.assign(loginForm, {
      username: '',
      password: ''
    })
  } else if (activeTab.value === 'email') {
    // 重置邮箱登录表单
    Object.assign(emailLoginForm, {
      email: '',
      password: ''
    })
  }
}

const handleSubmit = () => {
  if (!authFormRef.value || !authFormRef.value.formRef) {
    ElMessage.error('Ошибка ссылки на форму')
    return
  }

  const formRef = authFormRef.value.formRef
  
  formRef.validate(async (valid) => {
    if (!valid) return
    
    loading.value = true
    try {
      if (activeTab.value === 'account') {
        // Вход по логину и паролю
        await request.post("/user/login", loginForm, {
          successMsg: "Вход выполнен успешно",
          showDefaultMsg: true,
          onSuccess: handleLoginSuccess
        })
      } else if (activeTab.value === 'email') {
        // 邮箱登录
        await request.post("/user/login/email", emailLoginForm, {
          successMsg: "Вход выполнен успешно",
          showDefaultMsg: true,
          onSuccess: handleLoginSuccess
        })
      }
    } catch (error) {
      console.error('Ошибка входа:', error)
    } finally {
      loading.value = false
    }
  })
}

const handleLoginSuccess = async (data) => {
  userStore.setUserInfo(data)
  
  // 根据返回的角色决定跳转路径
  if (data.roleCode !== 'USER') {
    // 管理员登录，跳转到后台
    await router.isReady()
    router.push(route.query.redirect || '/back/dashboard')
  } else {
    // 普通用户登录，跳转到前台
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  }
}
</script>

<style lang="scss" scoped>
</style> 