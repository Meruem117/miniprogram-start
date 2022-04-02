const API_HOST = 'http://localhost:8080'

function getData() {
  let data = []
  wx.request({
    url: API_HOST + '/user/all',
    success(res) {
      data = res.data
      console.log(data)
    }
  })
}

module.exports = {
  getData
}