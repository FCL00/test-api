<template>
  <el-card shadow="never">
    <h3 class="flex align-center">
      <el-icon><User /></el-icon>{{ props.name }}
    </h3>
    <p class="flex align-center">
      <el-icon><Message /></el-icon>
      {{ props.email }}
    </p>
    <p class="flex align-center">
      <el-icon><Location /></el-icon>
      {{ props.address?.street }}
    </p>
    <p class="flex align-center">
      <el-icon><OfficeBuilding /></el-icon>
      {{ props.address?.city }}
    </p>
    <p class="flex align-center">
      <el-icon><Calendar /></el-icon>
      {{ props.date }}
    </p>
    <template #footer>
      <div class="flex">
        <el-button color="#303030" size="large" @click="onView"> View Details </el-button>
        <el-button color="#303030" size="large" @click="onEdit"> Edit </el-button>
        <el-button color="#303030" size="large" @click="onDelete"> Delete </el-button>
      </div>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import type { User } from '@/types'
import { Calendar } from '@element-plus/icons-vue'

interface CardProps extends User {
  date?: string
}

const props = defineProps<Partial<CardProps>>()
const emit = defineEmits(['on-view', 'on-edit', 'on-delete'])

function onView() {
  console.log(props.id)
  emit('on-view', props.id)
}

function onEdit() {
  emit('on-edit', props.id)
}

function onDelete() {
  emit('on-delete', props.id)
}
</script>

<style scoped>
.flex {
  display: flex;
  gap: 4px;
}
.align-center {
  align-items: center;
}
.el-button {
  margin-left: 0px;
}
</style>
