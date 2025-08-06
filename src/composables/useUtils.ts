export const useUtils = () => {
  /**
   *  Capitalize each word of the string
   * @param {any} value:string
   * @returns {any}
   */
  const capitalizeEachWord = (value: string): string => {
    if (!value) return ''
    return value
      .split(' ')
      .map((word) =>
        word
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('-'),
      )
      .join(' ')
  }

  return { capitalizeEachWord }
}
