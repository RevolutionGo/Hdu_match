// pages/detail/detail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
      content: {},
      time: "",
      _id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var id = options.pageId
    var mycollection = options.collection
    console.log(id)
    console.log(mycollection)
    // 创建数据库实例
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // 可以使用where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等）
    // get 方法会触发网络请求，往数据库取数据
    db.collection(mycollection).where({_id: id}).get({
      success(res) {
        //console.log(res.data[0])
        var month = Number(res.data[0].date.getMonth()) + 1
        that.setData({
          _id: id,
          content: res.data[0],
          time: res.data[0].date.getFullYear() + "-" + month + "-" + res.data[0].date.getDate()
        })
        //console.log(content)
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
    let that = this;
    return {
      title: '杭电竞赛', // 转发后 所显示的title
      path: '../detail/detail?detail=' + that.data._id, // 相对的路径
      success: (res) => {    // 成功后要做的事情
        console.log(res.shareTickets[0])
        // console.log

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success: (res) => {
            that.setData({
              isShow: true
            })
            console.log(that.setData.isShow)
          },
          fail: function (res) { console.log(res) },
          complete: function (res) { console.log(res) }
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})