<template>
  <el-autocomplete
    v-model="state"
    :fetch-suggestions="querySearch"
    popper-class="my-autocomplete"
    placeholder="Search User"
    @select="handleSelect"
    clearable
  >
    <template #prefix>
      <el-icon class="el-input__icon" @click="handleIconClick">
        <Search />
      </el-icon>
    </template>
    <template #default="{ item }">
      <div class="name">
        <el-icon><User /></el-icon>
        {{ item.name }}
      </div>
      <div class="username">
        <span>@ {{ item.username }}</span>
      </div>
      <div class="email">
        <el-icon><Message /></el-icon>
        {{ item.email }}
      </div>
      <div class="address">
        <el-icon><Location /></el-icon>
        {{ item.address.street }}, {{ item.address.city }}
      </div>
      <el-divider />
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { AutocompleteFetchSuggestionsCallback } from 'element-plus'
import type { User } from '@/types'
import { useRouter } from 'vue-router'

const props = defineProps<{ users: User[] }>()

const state = ref('')
const router = useRouter()

const querySearch = (queryString: string, cb: AutocompleteFetchSuggestionsCallback) => {
  const results = queryString ? props.users.filter(createFilter(queryString)) : props.users
  cb(results)
}
const createFilter = (queryString: string) => {
  const query = queryString.toLowerCase()
  return (user: User) => {
    const { name, username, email, address } = user
    const uname = username.toLowerCase()
    const street = address.street.toLowerCase()
    const city = address.city.toLowerCase()
    const fullAddress = `${street} ${city}`

    return (
      uname.toLowerCase().includes(query) ||
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      street.includes(query) ||
      city.includes(query) ||
      fullAddress.includes(query)
    )
  }
}

const handleSelect = (item: Record<string, string>) => {
  router.push(`/users/${item.id}`)
}

const handleIconClick = (ev: Event) => {
  console.log(ev)
}
</script>

<style scoped></style>
