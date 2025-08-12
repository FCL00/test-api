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
import { onMounted, ref } from 'vue'
import type { AutocompleteFetchSuggestionsCallback } from 'element-plus'
import type { User } from '@/types'
import { userStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const { users } = userStore()
const state = ref('')
const links = ref<User[]>([])
const router = useRouter()

const querySearch = (queryString: string, cb: AutocompleteFetchSuggestionsCallback) => {
  const results = queryString ? links.value.filter(createFilter(queryString)) : links.value
  cb(results)
}
const createFilter = (queryString: string) => {
  const query = queryString.toLowerCase()
  return (restaurant: User) => {
    const { name, username, email, address } = restaurant
    const uname = username
    const street = address.street.toLowerCase()
    const city = address.city.toLowerCase()
    const fullAddress = `${street} ${city}`

    return (
      uname.includes(query) ||
      name.toLowerCase().includes(query) ||
      email.toLowerCase().includes(query) ||
      street.includes(query) ||
      city.includes(query) ||
      fullAddress.includes(query)
    )
  }
}

const loadAll = () => {
  return users
}
const handleSelect = (item: Record<string, string>) => {
  router.push(`/users/${item.id}`)
}

const handleIconClick = (ev: Event) => {
  console.log(ev)
}

onMounted(() => {
  links.value = loadAll()
})
</script>

<style scoped></style>
