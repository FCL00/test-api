<template>
  <el-card style="margin-top: 20px" v-if="userDetails?.id && !isFormVisible">
    <router-link to="/">&leftarrow; Go Back</router-link>
    <h1>Personal Information</h1>

    <div class="form-control">
      <h3>Fullname:</h3>
      <p>{{ userDetails.name }}</p>
    </div>

    <div class="form-control">
      <h3>Email:</h3>
      <p>{{ userDetails.email }}</p>
    </div>
    <div class="form-control">
      <h3>Address:</h3>
      <p>{{ userDetails.address?.street }}, {{ userDetails.address?.city }},</p>
    </div>
    <div class="form-control">
      <h3>Created At:</h3>
      <p>{{ dayjs().format('dddd, MMMM D, YYYY') }}</p>
    </div>
  </el-card>
  <el-card shadow="never" v-if="!userDetails && !isFormVisible">
    <el-skeleton :animated="true" :rows="9" />
  </el-card>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { userStore } from '@/stores/user'
import type { User } from '@/types'
import dayjs from 'dayjs'

const isFormVisible = ref(false)
const route = useRoute()
const useUserStore = userStore()
const userDetails = ref<Partial<User>>()
const router = useRouter()

async function loadUserDetails(id: string) {
  const user = await useUserStore.fetchUserById(Number(id))
  userDetails.value = user

  if (!user) {
    router.push('/')
  }
}

onMounted(async () => {
  await loadUserDetails(route.params.id as string)
})

onBeforeMount(() => {
  console.log('on before mount')
})

onBeforeUnmount(() => {
  console.log('on before Unmount')
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadUserDetails(newId as string)
    }
  },
)
</script>

<style scoped>
a {
  text-decoration: none;
  color: var(--brand-neutral-black);
}

h3,
p {
  margin: 0;
  padding: 0;
}

.form-control {
  margin-bottom: 20px;
}

.flex {
  display: flex;
  gap: 4px;
}
</style>
