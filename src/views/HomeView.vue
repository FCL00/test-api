<template>
  <div class="flex-justify-end">
    <search-bar />
    <el-button color="#303030" size="large" @click="isModalOpen = true">Add New User</el-button>
  </div>
  <div v-if="useUserStore.fetchStatus !== 'pending'" class="grid container">
    <user-card
      v-for="user in useUserStore.users"
      :key="user.id"
      :id="user.id"
      :name="user.name"
      :email="user.email"
      :address="user.address"
      @on-view="handleView"
    />
  </div>
  <div class="grid container" v-else>
    <el-card shadow="never" v-for="index in 10" :key="index">
      <el-skeleton :rows="5" animated />
    </el-card>
  </div>

  <el-dialog
    ref="userFormRef"
    v-model="isModalOpen"
    width="500"
    align-center
    @closed="handleDialogClosed"
  >
    <template #header>
      <p>Add New User</p>
    </template>
    <user-form ref="resetRef" @on-submit="handleSubmit" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { userStore } from '@/stores/user'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UserCard from '@/components/UserCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserForm from '@/components/UserForm.vue'
import type { User } from '@/types'
import { useTemplateRef } from 'vue'

const isModalOpen = ref(false)
const router = useRouter()
const useUserStore = userStore()
const formResetRef = useTemplateRef('resetRef')

// trigger the form reset when the dialog is closed
const handleDialogClosed = () => {
  formResetRef.value?.resetForm()
}

function handleView(id: number) {
  router.push(`/users/${id}`)
}

function handleSubmit(formData: Partial<User>) {
  useUserStore.addUser(formData)
}

onMounted(() => {
  useUserStore.getAllUsers()
})
</script>

<style></style>
