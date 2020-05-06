//index.js

//获取应用实例
const app = getApp()

Page({
  data: {
    content:[],
    imglist: [],
    time: "",
    news: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  detail: function(event) {
    //console.log(event.target.dataset.index)
    wx.navigateTo({
      url: '../detail/detail?pageId=' + event.target.dataset.index + '&collection=match_info'
    })
  },
  onLoad: function () {
    let that = this
    // 创建数据库实例
    const db = wx.cloud.database()
    // 2. 构造查询语句
    // collection 方法获取一个集合的引用
    // 可以使用where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等）
    // get 方法会触发网络请求，往数据库取数据
    db.collection('match_info').orderBy('date', 'desc').limit(14).get({
      success(res) {
        //console.log(res.data)
        var content1 = [] 
        var content2 = []
        for (var index in res.data){
          if (index <= 3){
            var content1_len = content1.length
            content1[content1_len + 0] = res.data[index]
            var month = Number(res.data[index].date.getMonth()) + 1
            content1[content1_len + 0].date = res.data[index].date.getFullYear() + "-" + month + "-" + res.data[index].date.getDate()
            //console.log(content1[content1_len + 0].date)
          }
          else {
            var content2_len = content2.length
            content2[content2_len + 0] = res.data[index]
            var month = Number(res.data[index].date.getMonth())+1
            //console.log(month)
            content2[content2_len + 0].date = res.data[index].date.getFullYear() + "-" + month + "-" + res.data[index].date.getDate()
            //console.log(content2[content2_len + 0].date)
          }
        }
        that.setData({
          imglist: content1,
          news: content2
        })
        //console.log(news)
      }
    })

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
