<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    @submit.prevent="submitForm(ruleFormRef)"
  >
    <el-form-item label="Fullname" prop="name" label-position="top">
      <el-input v-model="ruleForm.name" placeholder="Enter your name" clearable />
    </el-form-item>
    <el-form-item label="Email" prop="email" label-position="top">
      <el-input v-model="ruleForm.email" placeholder="Enter your email" clearable />
    </el-form-item>
    <el-form-item label="Street" prop="street" label-position="top">
      <el-input v-model="ruleForm.street" placeholder="Enter your street" clearable />
    </el-form-item>
    <el-form-item label="City" prop="city" label-position="top">
      <el-input v-model="ruleForm.city" placeholder="Enter your city" clearable />
    </el-form-item>
    <el-button native-type="submit" color="#303030" size="large">
      {{ submitButtonText ? submitButtonText : 'Add New User' }}
    </el-button>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUtils } from '@/composables/useUtils'

const { capitalizeEachWord } = useUtils()
const emit = defineEmits(['on-submit'])

interface RuleForm {
  name?: string
  email?: string
  phone?: string
  website?: string
  street?: string
  suite?: string
  city?: string
  zipcode?: string
  company?: string
}

interface FormProps extends Partial<RuleForm> {
  id?: number
  submitButtonText?: string
}

const props = defineProps<FormProps>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: props.name ?? '',
  email: props.email ?? '',
  phone: props.phone ?? '',
  website: props.website ?? '',
  street: props.street ?? '',
  suite: props.suite ?? '',
  city: props.city ?? '',
  zipcode: props.zipcode ?? '',
  company: props.company ?? '',
})

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, min: 3, trigger: 'blur' }],
  email: [{ required: true, type: 'email', trigger: 'blur' }],
  street: [{ required: true, trigger: 'blur' }],
  city: [{ required: true, trigger: 'blur' }],
})

const formattedValue = () => {
  return {
    ...ruleForm,
    name: capitalizeEachWord(ruleForm.name ?? ''),
    address: {
      street: capitalizeEachWord(ruleForm.street ?? ''),
      city: capitalizeEachWord(ruleForm.city ?? ''),
    },
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      emit('on-submit', formattedValue())
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = () => {
  ruleFormRef.value?.resetFields()
}
// expose the reset feature to the parent component
defineExpose({ resetForm })
</script>

<style scoped>
.el-form-item--label-top .el-form-item__label {
  color: white;
}

.el-button {
  width: 100%;
  margin-top: 20px;
}
</style>
