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
    <h1>Comments</h1>
    <template v-if="useUserStore.commentStatus === 'fulfilled'">
      <el-timeline>
        <el-timeline-item
          v-for="comment in useUserStore.getRandomComments(randomNumber)"
          :key="comment.id"
          placement="top"
        >
          <el-card class="comment-card">
            <div style="display: flex; gap: 12px; align-items: flex-start">
              <div style="flex: 1">
                <h3 class="line-clamp" style="margin: 0">{{ comment.email }}</h3>
                <p class="line-clamp" style="margin-top: 4px">{{ comment.body }}</p>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </template>
    <template v-if="useUserStore.commentStatus === 'loading'">
      <el-timeline v-for="index in 5" :key="index">
        <el-timeline-item>
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
        </el-timeline-item>
      </el-timeline>
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

.comment {
  margin-top: 20px;
}

.content {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  box-sizing: content-box;
}

.avatar-skeleton {
  width: 40px;
  height: 40px;
}

@media (max-width: 600px) {
  /* Reduce left space where the dot/line sits */
  .el-timeline-item__wrapper {
    padding-left: 12px !important;
  }

  /* Smaller dot */
  .el-timeline-item__node {
    width: 10px !important;
    height: 10px !important;
  }

  /* Adjust timestamp font */
  .el-timeline-item__timestamp {
    font-size: 12px !important;
  }
}

@media (max-width: 600px) {
  .comment-card {
    flex-direction: column !important;
    align-items: flex-start !important;
  }

  .comment-card .el-avatar {
    margin-bottom: 8px;
  }
}
</style>
