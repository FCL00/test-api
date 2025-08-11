import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import type { User, Status } from '@/types'

export const userStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    fetchStatus: '' as Status,
    addStatus: '' as Status,
    updateStatus: '' as Status,
    deleteStatus: '' as Status,
  }),
  getters: {
    getUserById: (state) => (id: string) => state.users.find((user) => user.id === Number(id)),
  },
  actions: {
    async getAllUsers() {
      const BASE_URL = import.meta.env.VITE_BASE_URL

      try {
        this.fetchStatus = 'pending'
        const response = await fetch(BASE_URL)
        if (!response.ok) {
          ElMessage.error('Failed to fetch the data')
        }
        const result = await response.json()
        this.users = result
        this.fetchStatus = 'fulfilled'
      } catch (error) {
        this.fetchStatus = 'rejected'
        console.error(error)
      }
    },

    async addUser(request: Partial<User>) {
      const BASE_URL = import.meta.env.VITE_BASE_URL
      try {
        this.addStatus = 'pending'
        const response = await fetch(`${BASE_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        })

        if (!response.ok) {
          ElMessage.error('Failed to add user')
        }
        const result = await response.json()
        this.users.push({ ...result })
        console.log('request', result)
        console.log(this.users)
        this.addStatus = 'fulfilled'
        ElMessage.success('Successfully added')
      } catch (error) {
        this.addStatus = 'rejected'
        console.error(error)
      }
    },

    async updateUser(id: number, updatedData: Partial<User>) {
      const index = this.users.findIndex((user) => user.id === id)
      const BASE_URL = import.meta.env.VITE_BASE_URL
      try {
        const response = await fetch(`${BASE_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        })

        if (!response.ok) {
          ElMessage.error('Failed to updated')
          return
        }

        const result = await response.json()
        this.users[index] = result
        ElMessage.error('Successfully updated')
      } catch (error) {
        console.error(error)
      }
    },

    async deleteUser(id: number) {
      const BASE_URL = import.meta.env.VITE_BASE_URL
      const index = this.users.findIndex((user) => user.id === id)
      try {
        const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
        if (!response.ok) {
          ElMessage.error('Failed to delete')
          return
        }
        const result = await response.json()
        this.users[index] = result
      } catch (error) {
        console.error(error)
      }
    },
  },
})
