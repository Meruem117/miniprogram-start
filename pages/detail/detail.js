// pages/detail/detail.js
const commentService = require('../../services/comment')
const constant = require('../../utils/constant')

Page({
  data: {
    id: 0,
    page: 1,
    size: 4,
    data: {},
    list: [],
    total: 0,
    subCommentId: 0,
    replyId: 0,
    replyName: '',
    content: '',
    focus: false,
    isMain: true,
    hasMore: true,
    icon: constant.ICON
  },
  onLoad: function (option) {
    this.setData({
      id: option.id,
      subCommentId: option.id
    })
    this.loadDetail()
    this.loadCommentList()
  },
  /**
   * 加载详情
   */
  async loadDetail() {
    const res = await commentService.getCommentById(this.data.id)
    this.setData({
      data: res.data,
      replyId: res.data.userId,
      replyName: res.data.userName
    })
  },
  /**
   * 加载评论列表
   */
  async loadCommentList() {
    let params = {
      userId: 0,
      commentId: this.data.id,
      key: '',
      page: this.data.page,
      size: this.data.size
    }
    const res = await commentService.getPages(params)
    if (res.data.list.length > 0) {
      this.setData({
        list: this.data.list.concat(res.data.list),
        total: res.data.total,
        hasMore: res.data.total > this.data.size && res.data.list.length === this.data.size
      })
    } else {
      this.setData({
        hasMore: false
      })
    }
  },
  /**
   * 下拉刷新评论列表
   */
  onRefresh() {
    this.setData({
      list: [],
      page: 1,
      hasMore: true
    })
    this.loadCommentList()
  },
  /**
   * 加载更多评论
   */
  loadMore() {
    if (this.data.hasMore) {
      this.setData({
        page: ++this.data.page
      })
      this.loadCommentList()
    }
  },
  /**
   * 跳转用户详情
   * @param {TargetDataset<{id: number}>} e 
   */
  toUser(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../user/user?id=' + id
    })
  },
  /**
   * 跳转评论用户详情
   * @param {{detail: number}} e 
   */
  toCommentUser(e) {
    const id = e.detail
    wx.navigateTo({
      url: '../user/user?id=' + id
    })
  },
  /** 
   * 点击主评论
   */
  tapMainComment() {
    this.setData({
      subCommentId: this.data.id,
      replyId: this.data.data.userId,
      replyName: this.data.data.userName,
      focus: true,
      isMain: true
    })
  },
  /** 
   * 点击列表评论
   * @param {{detail: {id: number,userid: number,username: string}}} e 
   */
  tapSubComment(e) {
    this.setData({
      subCommentId: e.detail.id,
      replyId: e.detail.userid,
      replyName: e.detail.username,
      focus: true,
      isMain: false
    })
  },
  /**
   * 评论框监听
   * @param {{detail: string}} e 
   */
  onChange(e) {
    this.setData({
      content: e.detail
    })
  },
  /**
   * 评论
   */
  onComment() {
    if (!this.data.content) {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none'
      })
      return
    }
    let comment = {
      userId: 2,
      commentId: this.data.id,
      subCommentId: this.data.subCommentId,
      replyId: this.data.replyId,
      replyName: this.data.replyName,
      content: this.data.content,
    }
    commentService.addComment(comment).then(() => {
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      })
      this.setData({
        content: '',
        focus: false
      })
      this.loadCommentList()
    })
  },
})