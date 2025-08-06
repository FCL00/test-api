import type { InternalRuleItem } from 'async-validator'

export const useValidators = () => {
  const addressValidator = (
    rule: InternalRuleItem,
    value: string,
    callback: (error?: string | Error) => void,
  ) => {
    const trimmed = (value || '').trim()
    // Pattern: Only digits (pure number)
    const isOnlyNumbersPattern = /^\d+$/

    // Pattern: Valid characters only (letters, numbers, space, comma, period, hyphen)
    const validCharactersPattern = /^[A-Za-zÑñ0-9\s,.-]+$/

    // Pattern: Repeated spaces or hyphens
    const repeatedHyphenOrSpacePattern = /[\s-]{2,}/

    // Pattern: Starts or ends with punctuation or space
    const leadingOrTrailingPunctuationPattern = /^[,\-.\s]|[,\-.\s]$/

    //  Required field
    if (!trimmed) {
      return callback(new Error('Address is required'))
    }

    if (trimmed.length < 2) {
      return callback(new Error('Invalid Address'))
    }

    //  Should not be only numbers
    if (isOnlyNumbersPattern.test(trimmed)) {
      return callback(new Error('Address cannot be only numbers'))
    }

    //  Invalid characters
    if (!validCharactersPattern.test(trimmed)) {
      return callback(new Error('Only letters, numbers, commas, periods, and hyphens are allowed'))
    }

    //  Repeated hyphens or spaces
    if (repeatedHyphenOrSpacePattern.test(trimmed)) {
      return callback(new Error('No repeated spaces or hyphens allowed in the address'))
    }

    //  Starts or ends with space or punctuation
    if (leadingOrTrailingPunctuationPattern.test(trimmed)) {
      return callback(new Error('Address cannot start or end with punctuation or space'))
    }
    callback()
  }

  const nameValidator = (
    rule: InternalRuleItem,
    value: string,
    callback: (error?: string | Error) => void,
  ) => {
    const validCharsPattern = /^[A-Za-zÑñ\s-]+$/
    const cleanStructurePattern = /^[A-Za-zÑñ]+(?:[- ][A-Za-zÑñ]+)*$/

    const trimmedValue = (value || '').trim()

    if (!trimmedValue) {
      callback(new Error('This field is required.'))
    } else if (!validCharsPattern.test(trimmedValue)) {
      callback(new Error('Numbers and symbols are not allowed.'))
    } else if (!cleanStructurePattern.test(trimmedValue)) {
      callback(new Error('No leading/trailing or repeated hyphens/spaces allowed.'))
    } else if (trimmedValue.length <= 2) {
      callback(new Error('Invalid Name'))
    } else {
      callback()
    }
  }

  return {
    addressValidator,
    nameValidator,
  }
}
