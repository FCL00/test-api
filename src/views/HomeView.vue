<template>
  <div class="flex-justify-end box-content">
    <search-bar :users="useUserStore.users" />
    <el-tooltip content="Add User" placement="top">
      <el-button color="#303030" size="large" @click="isModalOpen = true">
        <el-icon><Plus /></el-icon>
      </el-button>
    </el-tooltip>

    <el-tooltip content="Refresh" placement="top">
      <el-button color="#303030" size="large" @click="useUserStore.getAllUsers()">
        <el-icon><RefreshLeft /></el-icon>
      </el-button>
    </el-tooltip>

    <!-- Toggle View Button -->
    <el-tooltip :content="changeView ? 'Grid View' : 'Table View'" placement="top">
      <el-button color="#303030" size="large" @click="handleChangeView">
        <el-icon>
          <component :is="changeView ? 'Grid' : 'Expand'" />
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>

  <!-- skeleton -->
  <div v-if="useUserStore.fetchStatus === 'loading'">
    <div v-if="!changeView" class="grid container">
      <el-card shadow="never" v-for="index in 10" :key="index">
        <el-skeleton :rows="5" animated />
      </el-card>
    </div>
    <el-skeleton v-else :rows="10" animated />
  </div>

  <!-- Grid View -->
  <div v-if="!changeView && useUserStore.fetchStatus === 'fulfilled'" class="grid container">
    <user-card
      v-for="user in useUserStore.users"
      :key="user.id"
      :id="user.id"
      :username="user.username"
      :name="user.name"
      :email="user.email"
      :address="user.address"
      :date="user.date"
      @on-view="handleView"
      @on-edit="handleEdit"
      @on-delete="handleDelete"
    />
  </div>

  <!-- Table View -->
  <div v-else>
    <el-table v-if="useUserStore.fetchStatus !== 'loading'" :data="useUserStore.users" style="width: 100%">
      <el-table-column show-overflow-tooltip width="250" prop="name" label="Name" />
      <el-table-column show-overflow-tooltip width="250" prop="email" label="Email" />
      <el-table-column show-overflow-tooltip width="200" prop="address.street" label="Street" />
      <el-table-column show-overflow-tooltip width="200" prop="address.city" label="City" />
      <el-table-column show-overflow-tooltip width="200" prop="date" label="Created at" />
      <el-table-column label="Actions" width="200" fixed="right">
        <template #default="scope">
          <div class="table-actions">
            <el-button size="small" color="#303030" @click="handleView(scope.row.id)">View</el-button>
            <el-button size="small" color="#505050" @click="handleEdit(scope.row.id)">Edit</el-button>
            <el-button size="small" color="#e1e1e1" @click="handleDelete(scope.row.id)">Delete</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-empty
    v-if="useUserStore.users.length <= 0 && useUserStore.fetchStatus !== 'loading' && !changeView"
    description="No user found"
  />

  <!-- Add User Dialog -->
  <el-dialog ref="userFormRef" v-model="isModalOpen" width="500" align-center @closed="handleDialogClosed">
    <template #header>
      <p>Add New User</p>
    </template>
    <user-form ref="resetRef" @on-submit="handleAddUser" mode="add" />
  </el-dialog>

  <!-- Edit User Dialog -->
  <el-dialog
    ref="editFormResetRef"
    v-model="isEditModalOpen"
    width="500"
    align-center
    @closed="handleEditDialogClosed"
    destroy-on-close
  >
    <template #header>
      <p>Edit User</p>
    </template>
    <user-form
      ref="editResetForm"
      :id="getSelectedUser?.id"
      :name="getSelectedUser?.name"
      :username="getSelectedUser?.username"
      :email="getSelectedUser?.email"
      :street="getSelectedUser?.address.street"
      :city="getSelectedUser?.address.city"
      submit-button-text="Update "
      @on-submit="handleUpdate"
      mode="edit"
    />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElLoading } from 'element-plus'
import { ref, onMounted, computed, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateRef } from 'vue'
import dayjs from 'dayjs'

// Components
import UserCard from '@/components/UserCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserForm from '@/components/UserForm.vue'

// Store (Composition API)
import { userStore } from '@/stores/user'

// Types
import type { User } from '@/types'
import { ElMessageBox } from 'element-plus'

// Initial Data
// const users = ref<User[]>([])

// UI state
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const changeView = ref(false)

// expose reset function on forms
const formResetRef = useTemplateRef('resetRef')
const editFormResetRef = useTemplateRef('editResetForm')

// Router
const router = useRouter()

// Store instance
const useUserStore = userStore()

// get selected user by id
const getUserId = ref<number | null>(null)
const getSelectedUser = computed(() => {
  return getUserId.value !== null ? useUserStore.getUserById(getUserId.value) : null
})

// Event Handlers
const handleChangeView = () => {
  changeView.value = !changeView.value
  console.log(changeView.value)
}

const handleView = (id: number) => {
  router.push(`/users/${id}`)
}

const handleDelete = async (id: number) => {
  ElMessageBox.confirm('Are you sure you want to delete this user profile?', 'Warning', {
    type: 'warning',
  })
    .then(async () => {
      const loadingInstance = ElLoading.service({
        lock: true,
        text: 'Deleting User...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      await useUserStore.deleteUser(id)
      loadingInstance.close()
    })
    .catch(() => {
      return
    })
}

const handleEdit = (id: number) => {
  isEditModalOpen.value = true
  getUserId.value = id
}

const handleUpdate = async (id: number, formData: Partial<User>) => {
  const loadingInstance = ElLoading.service({
    lock: true,
    text: 'Updating user profile...',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  await useUserStore.updateUser(id, formData)
  isEditModalOpen.value = false
  loadingInstance.close()
}

const handleAddUser = (formData: Partial<User>) => {
  useUserStore.addUser(formData)
  isModalOpen.value = false
}

// Reset forms on dialog close
const handleDialogClosed = () => {
  formResetRef.value?.resetForm()
}

const handleEditDialogClosed = () => {
  editFormResetRef.value?.resetForm()
}
// Initial data fetch
onBeforeMount(async () => {
  console.log(useUserStore.users)
})

onMounted(async () => {
  await useUserStore.getComments()
  await useUserStore.getAllUsers()
  useUserStore.users = useUserStore.users.map((user) => ({
    ...user,
    date: dayjs().format('dddd, MMMM D, YYYY'),
  }))
})

onBeforeUnmount(() => {
  console.log('on before unmount')
})
</script>

<style scoped>
.table-actions {
  display: flex;
  gap: 4px;
}

.icon-rotate {
  transform: rotate(90deg);
}
.display-on-small {
  display: none;
}
</style>
