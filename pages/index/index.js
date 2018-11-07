const weatherMap = {
  "sunny": "晴天",
  "cloudy": "多云",
  "overcast": "阴天",
  "lightrain": "小雨",
  "heavyrain": "大雨",
  "snow": "下雪"
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
//sdk
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')
var qqmapsdk
//权限常量
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2
//tips
const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

//
Page({

  data: {
    debugCount: 0,
    nowTemp: "14",
    nowWeather: "sunny",
    nowBg: "",
    nowNavigationBarColor: "",
    hourlyWeather: [],
    todayText: '',
    todayTemp: '',
    currentCity: '',
    locationtips: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED

  },
  onPullDownRefresh() {
    this.getNow(() => {
      console.log("stop refresh called...")
      wx.stopPullDownRefresh()
    })

  },

  // onShow() {
  //   console.log("-----indexpage;;;;onShow() ")

  //   wx.getSetting({
  //     success: res => {
  //       let auth = res.authSetting['scope.userlocation']

  //       if (auth && this.data.locationAuthType != AUTHORIZED) {
  //         this.setData({
  //           locationAuthType: AUTHORIZED,
  //           locationtips: AUTHORIZED_TIPS
  //         })

  //         this.getLocation()
  //       }

  //     }

  //   })
  // },

  onLoad() {
    console.log("-----indexPage;;;;;onLoad() ")
    this.qqmapsdk = new QQMapWX({
      key: 'EAXBZ-33R3X-AA64F-7FIPQ-BY27J-5UF5B'
    })
    wx.getSetting({
      success: res => {

        let auth = res.authSetting['scope.userLocation']
        let locationAuthType = auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED

        let locationtips = auth ? AUTHORIZED_TIPS : (auth === false) ? UNAUTHORIZED_TIPS : UNPROMPTED_TIPS
        this.setData({
          locationtips: locationtips,
          locationAuthType: locationAuthType
        })

        if (auth) {
          this.getCityAndWeather()
        } else {
          this.getNow()
        }



      },
      fail: () => {
        this.getNow()
      }



    })



    this.getNow()

  },


  getNow(callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.currentCity
      },
      complete: () => {

        callback && callback()
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      }

    })
  },
  setToday(result) {
    let date = new Date()
    let todaya = result.today
    this.setData({
      todayText: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 今天`,
      todayTemp: `${todaya.minTemp}°C-${todaya.maxTemp}°C`
    })

  },
  setNow(result) {
    let temp = result.now.temp
    let weather = result.now.weather

    this.setData({
      nowTemp: temp,
      nowWeather: weatherMap[weather],
      nowBg: '/images/' + weather + '-bg.png',
    })

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  }, setHourlyWeather(result) {
    //set forecast list
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i++) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })

    }
    hourlyWeather[0].time = "现在"
    this.setData(
      {
        hourlyWeather: hourlyWeather
      }
    )
  },
  onArrowTaped: function (event) {
    this.data.debugCount++
    let tost = "hello clicked arrow" + this.data.debugCount

    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.currentCity,
    })
  },
  getTapLocation() {

    this.getCityAndWeather()
  },
  getCityAndWeather() {
    wx.getLocation({
      success: res => {
        this.setData({
          locationAuthType: AUTHORIZED,
          locationtips: AUTHORIZED_TIPS
        })
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let citya = res.result.address_component.city

            this.setData({
              currentCity: citya,
              locationtips: ''
            })
            this.getNow()

          }

        })

      },
      fail: () => {

        this.setData({
          locationtips: UNAUTHORIZED_TIPS,
          locationAuthType: UNAUTHORIZED
        })


      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("-----indexpage;;;;onReady() ")
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

    console.log("-----indexpage;;;;onHide() ")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("-----indexpage;;;;onUnload() ")

  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("-----indexpage;;;;onReachBottom() ")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("-----indexpage;;;;onShareAppMessage() ")
  }


})