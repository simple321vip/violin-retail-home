export default [
  {
    // GET
    url: '/retail/api/v1/customer',
    method: 'get',
    response: () => {
      return [
        {
          id: '001',
          phone: '13332247026',
          name: '管祥玮',
          comment: '儿子',
        },
        {
          id: '002',
          phone: '13604266117',
          name: '管义刚',
          comment: '爸爸',
        }
      ]
    }
  },
  {
    // CREATE
    url: '/retail/api/v1/customer',
    method: 'POST',
    response: ({ body }) => {
      return {
        id: '003',
        phone: 'xxxxxxxxx',
        name: 'xxxx',
        comment: 'xxxx',
      }
    }
  },
  {
    // UPDATE
    url: '/retail/api/v1/customer',
    method: 'PUT',
    response: ({ body }) => {
      return {
        id: '003',
        phone: 'xxxxxxxxx',
        name: 'xxxx',
        comment: 'xxxx',
      }
    }
  },
  {
    // DELETE
    url: '/retail/api/v1/customer',
    method: 'DELETE',
    response: ({ body }) => {
      return {}
    }
  },
]