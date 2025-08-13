<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" @submit.prevent="submitForm(ruleFormRef)">
    <el-form-item label="Fullname" prop="name" label-position="top">
      <el-input v-model="ruleForm.name" placeholder="Enter your name" clearable />
    </el-form-item>
    <el-form-item label="Username" prop="username" label-position="top">
      <el-input v-model="ruleForm.username" placeholder="Enter your username" clearable />
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
import { dayjs, type FormInstance, type FormRules } from 'element-plus'
import { useUtils } from '@/composables/useUtils'
import { useValidators } from '@/composables/useValidators'

const { capitalizeEachWord } = useUtils()
const { streetValidator, cityValidator, nameValidator, usernameValidator } = useValidators()
const emit = defineEmits(['on-submit'])

interface RuleForm {
  name?: string | null
  username?: string | null
  email?: string | null
  phone?: string | null
  website?: string | null
  street?: string | null
  suite?: string | null
  city?: string | null
  zipcode?: string | null
  company?: string | null
}

interface FormProps extends Partial<RuleForm> {
  id?: number
  mode?: 'edit' | 'add'
  submitButtonText?: string
}

const props = defineProps<FormProps>()

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: props.name,
  username: props.username,
  email: props.email,
  phone: props.phone,
  website: props.website,
  street: props.street,
  suite: props.suite,
  city: props.city,
  zipcode: props.zipcode,
  company: props.company,
})

const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, min: 3, validator: nameValidator, trigger: 'blur' }],
  username: [{ required: true, validator: usernameValidator, trigger: 'blur' }],
  email: [{ required: true, type: 'email', trigger: 'blur' }],
  street: [{ required: true, validator: streetValidator, trigger: 'blur' }],
  city: [{ required: true, validator: cityValidator, trigger: 'blur' }],
})

const formattedValue = () => {
  return {
    ...ruleForm,
    name: capitalizeEachWord(ruleForm.name ?? ''),
    address: {
      street: capitalizeEachWord(ruleForm.street ?? ''),
      city: capitalizeEachWord(ruleForm.city ?? ''),
    },
    date: dayjs().format('dddd, MMMM D, YYYY'),
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (props.mode === 'edit') emit('on-submit', props?.id, formattedValue())
      if (props.mode === 'add') emit('on-submit', formattedValue())
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
