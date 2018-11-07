// pages/list/list.js
const weekDayMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]


Page({

  data: {
    weekWeathers: [],
    city: ''
  },

  onLoad(options) {
    console.log("-----list page;;;;;onLoad() ")
    this.data.city = options.city
    this.getWeather()
  },
  onPullDownRefresh() {
    this.getWeather(() => {
      console.log("stop refresh called...")
      wx.stopPullDownRefresh()
    })

  },

  onShow() {
    console.log("-----listpage;;;;onShow() ")
  },

  getWeather(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: this.data.city,
        time: new Date()
      },
      success: res => {
        let result = res.data.result
        console.log(result)
        this.setWeekWeather(result)
      },
      complete: () => {
        console.log("get data completed")
        callback && callback()
      },


    })
  },
  setWeekWeather(result) {
    let weexWeather = []
    for (let i = 0; i < 7; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i)
      weexWeather.push({
        day: weekDayMap[date.getDay()],
        date: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} `,
        temp: `${result[i].minTemp}°C-${result[i].maxTemp}°C`,
        iconPath: '/images/' + result[i].weather + '-icon.png'
      })

    }
    weexWeather[0].day = "今天"
    this.setData({
      weekWeathers: weexWeather
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("-----listpage;;;;onReady() ")
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    console.log("-----listpage;;;;onHide() ")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("-----listpage;;;;onUnload() ")

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("-----listpage;;;;onPullDownRefresh() ")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("-----listpage;;;;onReachBottom() ")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("-----listpage;;;;onShareAppMessage() ")
  }

})

