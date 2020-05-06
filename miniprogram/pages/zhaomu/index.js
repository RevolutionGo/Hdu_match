// pages/zhaomu/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhaomulist: [],
    pagetitle:'队友招募',
  },  
  //事件处理函数
  detail: function (event) {
    //console.log(event.target.dataset.index)
    wx.navigateTo({
      url: '../detail/detail?pageId=' + event.currentTarget.dataset.index + '&collection=zhaomo_info'
    })
  },
  //事件处理函数
  edit: function () {
    wx.navigateTo({
      url: '../edit/edit',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onLoad: function () {
    let that = this
    // 创建数据库实例
    const db = wx.cloud.database()
    db.collection('zhaomo_info').orderBy('date', 'desc').get({
      success(res) {
        console.log(res.data)
        var content = []
        for (var index in res.data) {
            var content_len = content.length
            content[content_len + 0] = res.data[index]
            var month = Number(res.data[index].date.getMonth()) + 1
            content[content_len + 0].date = res.data[index].date.getFullYear() + "-" + month + "-" + res.data[index].date.getDate()
            //console.log(content[content_len + 0].date)
        }
        that.setData({
          zhaomulist: content
        })
        //console.log(zhaomulist)
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})