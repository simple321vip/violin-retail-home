export default [
  {
    url: '/auth/api/v1/authorize',
    method: 'post',
    response: () => {
      return {
        token: "ABCDEFG"
      }
    }
  }
]
