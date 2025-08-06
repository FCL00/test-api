<template>
  <el-card style="margin-top: 20px" v-if="userDetails?.id">
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
      <h3>Phone:</h3>
      <p>{{ userDetails.phone }}</p>
    </div>

    <div class="form-control">
      <h3>Website:</h3>
      <p>{{ userDetails.website }}</p>
    </div>

    <div class="form-control">
      <h3>Address:</h3>
      <p>
        {{ userDetails.address?.street }}, {{ userDetails.address?.suite }},
        {{ userDetails.address?.city }},
        {{ userDetails.address?.zipcode }}
      </p>
    </div>

    <div class="form-control">
      <h3>Company:</h3>
      <p>{{ userDetails.company?.name }}</p>
    </div>

    <template #footer>
      <div class="flex">
        <el-button color="#303030" size="large" @click="onEdit">Edit</el-button>
        <el-button color="#303030" size="large" @click="onDelete">Delete</el-button>
      </div>
    </template>
  </el-card>
  <p v-else>Loading user data...</p>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userStore } from '@/stores/user'
import type { User } from '@/types'

const route = useRoute()
const store = userStore()
const userDetails = ref<Partial<User>>()
const emit = defineEmits(['on-edit', 'on-delete'])

async function loadUserDetails(id: string) {
  userDetails.value = store.getUserById(id)
}

onMounted(() => {
  loadUserDetails(route.params.id as string)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadUserDetails(newId as string)
    }
  },
)

function onEdit() {
  emit('on-edit', userDetails.value?.id)
}

function onDelete() {
  emit('on-delete', userDetails.value?.id)
}
</script>

<style scoped>
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
