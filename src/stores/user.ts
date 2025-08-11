// stores/userStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { User, Status } from '@/types'

export const userStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const fetchStatus = ref<Status>('loading')
  const getUserStatus = ref<Status>('loading')
  const addStatus = ref<Status>('loading')
  const updateStatus = ref<Status>('loading')
  const deleteStatus = ref<Status>('loading')

  const BASE_URL = import.meta.env.VITE_BASE_URL

  // Getter (computed)
  const getUserById = (id: number) => {
    return users.value.find((user) => user.id === Number(id))
  }

  // Actions
  async function getAllUsers() {
    try {
      fetchStatus.value = 'loading'
      const response = await fetch(BASE_URL)
      if (!response.ok) {
        fetchStatus.value = 'rejected'
        ElMessage.error('Failed to fetch the data')
        return
      }
      const result = await response.json()
      users.value = result
      fetchStatus.value = 'fulfilled'
    } catch (error) {
      fetchStatus.value = 'rejected'
      console.error(error)
    }
  }

  async function fetchUserById(id: number) {
    try {
      getUserStatus.value = 'loading'
      const response = await fetch(`${BASE_URL}/${id}`)
      if (!response.ok) {
        getUserStatus.value = 'rejected'
        ElMessage.error('User data not found')
        return null
      }
      const result = await response.json()
      getUserStatus.value = 'fulfilled'
      console.log('still running here')
      return result
    } catch (error) {
      getUserStatus.value = 'rejected'
      console.log('not found')
      console.error(error)
    }
  }

  async function addUser(request: Partial<User>) {
    try {
      addStatus.value = 'loading'
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        ElMessage.error('Failed to add user')
        addStatus.value = 'rejected'
        return
      }

      const result = await response.json()
      users.value.unshift(result)
      addStatus.value = 'fulfilled'
      ElMessage.success('Successfully added')
    } catch (error) {
      addStatus.value = 'rejected'
      console.error(error)
    }
  }

  async function updateUser(id: number, updatedData: Partial<User>) {
    console.log('updated id', id)
    const index = users.value.findIndex((user) => user.id === id)

    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        updateStatus.value = 'rejected'
        ElMessage.error('Failed to update')
        return
      }

      const result = await response.json()
      users.value[index] = result
      ElMessage.success('Successfully updated')
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteUser(id: number) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        ElMessage.error('Failed to delete')
        return
      }

      users.value = users.value.filter((user) => user.id !== id)
      ElMessage.success('Successfully deleted')
    } catch (error) {
      console.error(error)
    }
  }

  return {
    users,
    fetchStatus,
    getUserStatus,
    addStatus,
    updateStatus,
    deleteStatus,
    getUserById,
    getAllUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchUserById,
  }
})
