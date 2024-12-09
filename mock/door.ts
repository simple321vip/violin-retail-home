export default [
  {
    // GET
    url: '/retail/api/v1/door',
    method: 'get',
    response: () => {
      return [
        {
          id: '001',
          name: '柜门1',
          length: 2400,
          width: 300,
          amount: 3,
          comment: '儿子',
        },
        {
          id: '002',
          name: '柜门2',
          length: 2400,
          width: 300,
          amount: 3,
          comment: '儿子',
        },
        {
          id: '003',
          name: '柜门3',
          length: 2400,
          width: 300,
          amount: 3,
          comment: '儿子',
        },
        {
          id: '004',
          name: '柜门4',
          length: 2400,
          width: 300,
          amount: 3,
          comment: '儿子',
        },
      ]
    }
  },
  {
    // CREATE
    url: '/retail/api/v1/door',
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
    url: '/retail/api/v1/door',
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
    url: '/retail/api/v1/door',
    method: 'DELETE',
    response: ({ body }) => {
      return {}
    }
  },
]