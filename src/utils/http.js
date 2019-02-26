import axios from 'axios'
export const  $http = axios.create({
    timeout: 45000,
    // method: 'get',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
