<template>
  <el-card style="margin-top: 20px" v-if="userDetails?.id && !isFormVisible">
    <router-link to="/">&leftarrow; Go Back</router-link>
    <h1>Personal Information</h1>

    <div class="form-control">
      <h3>Fullname:</h3>
      <p>{{ userDetails.name }}</p>
    </div>

    <div class="form-control">
      <h3>Username</h3>
      <p>{{ userDetails.username }}</p>
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

  <section class="comment">
    <h1 class="flex-text">
      <el-icon><ChatLineSquare /></el-icon>
      <span>Comments ({{ randomNumber }})</span>
    </h1>
    <!-- card -->
    <template v-if="useUserStore.commentStatus === 'fulfilled'">
      <el-card
        class="comment-card"
        v-for="comment in useUserStore.getRandomComments(randomNumber)"
        :key="comment.id"
        style="margin-bottom: 20px"
      >
        <div class="flex-text">
          <el-avatar :size="40" shape="circle" fit="cover" :src="`https://i.pravatar.cc/150?u=${comment.email}`">
            {{ comment.email.charAt(0) }}
          </el-avatar>
          <h3 class="line-clamp">{{ comment.email }}</h3>
        </div>
        <div class="comment" style="">
          <p style="margin-top: 4px">{{ comment.body }}</p>
        </div>
        <el-tooltip content="Not Available" placement="top" effect="dark">
          <div class="flex-text cursor" style="margin-top: 20px; width: 75px">
            <el-icon size="20"><ChatLineSquare /></el-icon>
            <small>Reply</small>
          </div>
        </el-tooltip>
      </el-card>
    </template>
    <!-- skeleton -->
    <template v-if="useUserStore.commentStatus === 'loading'">
      <el-card shadow="never" style="margin-bottom: 16px">
        <div class="content">
          <el-skeleton-item class="avatar-skeleton" variant="circle" />
          <div style="flex: 1">
            <el-skeleton-item variant="text" style="width: 30%; margin-bottom: 8px" />
            <el-skeleton-item variant="text" style="width: 90%; margin-bottom: 4px" />
            <el-skeleton-item variant="text" style="width: 80%" />
          </div>
        </div>
      </el-card>
    </template>
  </section>
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
const randomNumber = Math.floor(Math.random() * 15) + 1

async function loadUserDetails(id: string) {
  const user = await useUserStore.fetchUserById(Number(id))
  userDetails.value = user

  if (!user) {
    router.push('/')
  }
}

onMounted(async () => {
  await loadUserDetails(route.params.id as string)
  await useUserStore.getComments()

  if (useUserStore.getUserStatus === 'rejected') {
    router.push('/not-found')
  }
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

.content {
  display: flex;
  gap: 12px;
}

.comment {
  flex: 1;
  margin-top: 20px;
}

.flex-text {
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 12px;
}

.avatar-skeleton {
  width: 40px;
  height: 40px;
}

.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.comment-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.flex-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 600px) {
  .comment-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .flex-text {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  .comment-card h3 {
    font-size: 14px;
    word-break: break-word;
  }

  .comment-card p {
    font-size: 13px;
  }
}
</style>
