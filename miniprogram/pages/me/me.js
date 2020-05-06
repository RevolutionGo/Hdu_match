//index.js
/*
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
*/

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    avatarUrl: '',
    openid: '',
    logged: false,
    username: '',
    place: '',
    newsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onGetOpenid();
    
    console.log('进入用户页检查是否登录:', this.data.logged)
    console.log('是否已授权：', wx.getStorageSync('isLogin'))
    console.log('是否已有用户openId：', app.globalData.openid)

    wx.showLoading({
      title: '正在加载...',
      mask: true
    });

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权')
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                logged: true,
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                username: res.userInfo.nickName,
                place: res.userInfo.province + ', ' + res.userInfo.country
              })
            }
          })
        }
        wx.hideLoading();
      }
    })

    // 是否存在用户的openId
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        console.log(app.globalData.openid)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        
      }
    })
  },

  goDetail(event) {
    wx.navigateTo({
      url: '/pages/detail/detail?pageId=' + event.currentTarget.dataset.id +'&collection=zhaomo_info',
    })
    console.log(event.target.dataset.id)
  },

  onGetUserInfo: function (e) {
    
    if (!this.data.logged && e.detail.userInfo) {

      console.log(e)
      wx.setStorageSync('isLogin', 'isLogin')

      this.setData({
        logged: true,
        //openid = app.globalData.openid,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        username: e.detail.userInfo.nickName,
        place: e.detail.userInfo.province + ', ' + e.detail.userInfo.country
      })

    }
  },
  //删除我的招募
  delete_item(event) {
    wx.showModal({
      title: '提示',
      content: "确认要删除本条招募吗？",
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          const db = wx.cloud.database()
          db.collection('zhaomo_info').doc(event.currentTarget.dataset.id).remove({
            success: function (res) {
              console.log(res.data)
              wx.showToast({
                title: '删除成功！',
                icon: 'success',
                duration: 2000
              })
              wx.reLaunch({
                url: '../me/me',
              })
            }
          })
          删除
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //编辑我的招募
  edit_item(event) {
    wx.navigateTo({
      url: '../edit/edit?id=' + event.currentTarget.dataset.id
    })
  },
  // 读取发布列表
  getcollect() {
    const db = wx.cloud.database()
    // 查看是否有发布记录
    db.collection('zhaomo_info').orderBy('date', 'desc').where({
      _openid: app.globalData.openid,
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        if (!res.data.length) { // 如果从未发布
          console.log(' 从未发布')
          this.setData({
            newsList: []
          })
        } else { // 如果已有发布记录
          db.collection('zhaomo_info').get().then(res => {
            console.log(res.data)
            this.setData({
              newsList: res.data
            })
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onContact(e) {
    console.log('onContact', e)
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
    this.getcollect()
    console.log(0)
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
