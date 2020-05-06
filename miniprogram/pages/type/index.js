// pages/zhaomu/index.js
//获取应用实例
const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
      userInfo: {},
      logged: false,
      takeSession: false,
      type:'',
      grides: []
    },


  onLoad: function (options) {
    let that = this
    var mytype = options.type
    //console.log(mytype)

    // 创建数据库实例
    const db = wx.cloud.database()

    db.collection('match_info').where({ type: mytype}).orderBy('date', 'desc').limit(20).get({
      success(res) {
        //console.log(res.data)
        let content = []
        for (var index in res.data) {
            let content_len = content.length
            content[content_len + 0] = res.data[index]
            var month = Number(res.data[index].date.getMonth()) + 1
            content[content_len + 0].date = res.data[index].date.getFullYear() + "-" + month + "-" + res.data[index].date.getDate()
          content[content_len + 0].index = index
            //console.log(content[content_len + 0].date)
        }
        that.setData({
          grides: content,
          type: mytype
        })
        
      }
    })
    //console.log(grides)
  },
  
  //事件处理函数
  detail: function (event) {
    wx.navigateTo({
      url: '../detail/detail?pageId=' + event.currentTarget.dataset.index +'&collection=match_info'
    })
  },
     
})