// pages/edit/edit.js
var app = getApp()
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    images: '',
    _id: ''
  },

  onLoad: function (options){
    let that = this
    let userOpenId = app.globalData.openid
    if (!userOpenId) {
      wx.showToast({
        title: '您还未登录,请先登录~',
        icon: 'none'
      })

      setTimeout(() => {
        wx.switchTab({
          url: '../me/me',
        })
      }, 1500)
    } else {
      console.log(userOpenId)
    }
    if(options.id){
      var _id = options.id
      console.log(_id)
      // 创建数据库实例
      const db = wx.cloud.database()
      db.collection('zhaomo_info').where({ _id: _id }).get({
        success(res) {
          //console.log(res.data[0])
          that.setData({
            title: res.data[0].title,
            content: res.data[0].page,
            images: res.data[0].img,
            _id: _id
            //thisopenid: res.data[0]._openid,
          })
          //console.log(content)
        }
      })
    }
    
  },
  onShow: function () {
    
  },
  handleTitleInput(e) {
    this.setData({
      title: e.detail.value,
      titleCount: e.detail.value.length
    })
  },

  handleContentInput(e) {
    this.setData({
      content: e.detail.value,
      contentCount: e.detail.value.length
    })
  },

  chooseImage(e) {
    var that = this
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        var filePath = res.tempFilePaths[0]
        var filename = filePath.match(/[^.]+?\.[^.]+?$/)[0]
        // 上传图片
        const cloudPath = 'zhaomu-image' + filename
        console.log(filename)
        console.log(filePath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: function(res) {
            console.log('[上传文件] 成功：', res)
            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            that.setData({
              images: res.fileID
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

  removeImage(e) {
    const idx = e.target.dataset.idx
    //const images = this.data.images.splice(idx, 1)
    this.setData({
      images: ''
    })
    //console.log(idx,images)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    var images = [this.data.images]
    console.log(idx)
    wx.previewImage({
      current: images[0],
      urls: images,
    })
  },

  //添加
  res: function (e) {
    var that = this;
    var date = new Date()
    var img = that.data.images
    console.log(that.data.images)
    var moren = 'cloud://match-info-hku60.6d61-match-info-hku60-1301792554/zhaomu-image.jpg'
    if(!img)img=moren
    const db = wx.cloud.database()
    if (e.detail.value.title && e.detail.value.content){
      if(!that.data._id){
        //新增记录
        console.log('新增记录')
        db.collection('zhaomo_info').add({
          data: {
            title: e.detail.value.title,
            page: e.detail.value.content,
            summary: e.detail.value.content.slice(0, 40) + '...',
            img: img,
            date: date
          },
          success: res => {
            // 在返回结果中会包含新创建的记录的 _id
            this.setData({
              title: e.detail.value.title,
              content: e.detail.value.content,
              images: img,
            })
            wx.showToast({
              title: '新增记录成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)

            setTimeout(function () {
              wx.reLaunch({
                url: '../zhaomu/index'
              })
            }, 2000)

          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '新增记录失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })
      //新增记录结束
      }else{
        //更新记录
        console.log('更新记录')
        db.collection('zhaomo_info').doc(that.data._id).update({
          // data 传入需要局部更新的数据
          data: {
            title: e.detail.value.title,
            page: e.detail.value.content,
            summary: e.detail.value.content.slice(0, 20) + '...',
            img: img,
            date: date
          },
          success: res => {
            // 在返回结果中会包含更新的记录的 _id
            this.setData({
              title: e.detail.value.title,
              content: e.detail.value.content,
              images: img,
            })
            wx.showToast({
              title: '更新记录成功',
            })
            console.log('[数据库] [更新记录] 成功，记录 _id: ', res._id)

            setTimeout(function () {
              wx.reLaunch({
                url: '../zhaomu/index'
              })
            }, 2000)

          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '更新记录失败'
            })
            console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      }
      
    }else{
        wx.showToast({
          title: '输入不能为空！',
          icon: 'none',
          duration: 2000
        })
    }
  },

})