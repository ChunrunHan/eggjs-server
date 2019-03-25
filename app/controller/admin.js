'use strict'

const Controller = require('egg').Controller

class AdminController extends Controller {
  // 新增分类
  async addCategory(){
    let {ctx} = this;
    let categoryName = ctx.request.body.name
    let {userId} = ctx;
    let resMsg = ctx.helper.resMsg()
    let isNew = await ctx.service.admin.checkDuplicateCategory(categoryName)
    if(!isNew){
      resMsg.code = 1
      resMsg.msg = '该分类已存在'
    }else{
      let result = await ctx.service.admin.createCategory(categoryName)
      if(!result){
        resMsg.code = -1
        resMsg.msg = '分类新增失败'
      }
    }
    ctx.body = resMsg
  }
  // 分类列表获取分类
  async getCategoryList(){
    const {ctx} = this;
    let page = ctx.params.page
    let resMsg = ctx.helper.resMsg()
    let res = await ctx.service.admin.getCategoryList(page)
    resMsg.data = res;
    console.log(res)
    ctx.body = resMsg
  }
  // 删除分类
  async delCategory(){
    const {ctx} = this;
    let {data} = ctx.request.body;
    let resMsg = ctx.helper.resMsg();
    let res;
    if(data instanceof Array){
      // 批量删除
      console.log("批量删除")
      res = await ctx.service.admin.delCategoryBatch(data)
    }else if(typeof data === 'string'){
      // 单个删除
      console.log("单个删除")
      res = await ctx.service.admin.delCategory(data)
    }else{
      resMsg.msg = '参数类型应为数组或字符串'
      resMsg.code = 1
      ctx.body = resMsg
      return
    }
    console.log("删除结果", res)
    if (res === null) {
      resMsg.msg = '分类id不存在'
      resMsg.code = 1
    }
    ctx.body = resMsg
  }
  // 修改分类
  async modifyCategory(){
    const {ctx} = this;
    let {data} = ctx.request.body;
    let resMsg = ctx.helper.resMsg();
    let res = await ctx.service.admin.modifyCategory(data)
    console.log(res)
    if(!res){
      resMsg.code = 1
      resMsg.msg = '修改失败'
    }
    ctx.body = resMsg
  }
  // 创建标签
  async createTag(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    let {name} = ctx.request.body;
    let isNew = await ctx.service.admin.checkDuplicateTag(name)
    if(!isNew){
      resMsg.code = 1
      resMsg.msg = '该标签已存在'
    } else {
      let result = await ctx.service.admin.createTag(name)
      if(!result){
        resMsg.code = -1
        resMsg.msg = '标签新增失败'
      }
    }
    ctx.body = resMsg
  }
  // 标签列表获取标签
  async getTagList(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    let page = ctx.params.page;
    let result = await ctx.service.admin.getTagList(page)
    resMsg.data = result;
    console.log(result)
    ctx.body = resMsg
  }
  // 删除标签
  async delTag(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    let {data} = ctx.request.body;
    let res;
    if(data instanceof Array){
      // 批量删除
      console.log("批量删除",data)
      res = await ctx.service.admin.delTagBatch(data)
    } else if (typeof data === 'string'){
      // 单个删除
      console.log("单个删除")
      res = await ctx.service.admin.delTag(data)
    } else {
      resMsg.msg = '参数类型应为数组或字符串'
      resMsg.code = 1
      ctx.body = resMsg
      return
    }
    console.log("删除结果", res)
    if (res === null) {
      resMsg.msg = '标签id不存在'
      resMsg.code = 1
    }
    ctx.body = resMsg
  }
  // 修改标签
  async modifyTag(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    let {data} = ctx.request.body;
    let res = await ctx.service.admin.modifyTag(data)
    console.log(res)
    if(!res){
      resMsg.code = 1
      resMsg.msg = '修改失败'
    }
    ctx.body = resMsg
  }
  // 创建或更新文章，如果有文章id就更新文章，否则新建文章
  async postArticle(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    // 如果有文章id则更新文章，否则新建文章
    console.log(ctx.request.body.data)
    if(ctx.request.body.data.id){
      console.log('更新文章')
      let oldStatus = await ctx.service.admin.findArticleStatus(ctx.request.body.data.id)
      let res = await ctx.service.admin.updateArticle(ctx.request.body.data.id)
      resMsg.msg = '文章修改成功'
      console.log('以前的文章状态',oldStatus)
      if (oldStatus !== ctx.request.body.data.status) {
        if(oldStatus === 1){
          resMsg.msg = '文章存入草稿成功'
        }else{
          resMsg.msg = '文章发布成功'
        }

      }
    }else{
      console.log("创建文章")
      let res = await ctx.service.admin.createArticle()
      console.log(res)
      if(res){
        resMsg.msg = '文章发布成功'
        if (ctx.request.body.data.status === 2) {
          resMsg.msg = '文章已存入草稿箱'
        }
      } else {
        res.msg = '文章发布失败'
        res.code = 1
      }

    }
    ctx.body = resMsg
  }
  // 获取用户的标签和分类
  async getArticleOptions(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg();
    let categoryListPromise = ctx.service.admin.getCategoryListById(ctx.userId)
    let tagsListPromise = ctx.service.admin.getTagsListById(ctx.userId)
    let categoryList = await categoryListPromise
    let tagsList = await tagsListPromise
    resMsg.data = {
      categoryList,
      tagsList
    }
    ctx.body = resMsg
  }
  // 获取所有文章列表
  async getArticleList(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let {page = 1, keyword = '', status = 1} = ctx.request.body.data;
    console.log(page,keyword,status)
    let articleList = await ctx.service.admin.getArticleList(ctx.userId, page, keyword, status)
    resMsg.data = {
      list: articleList.list,
      count: articleList.count
    }
    ctx.body = resMsg
  }
  // 获取文章详情
  async getArticleDetail(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let {id} = ctx.params;
    console.log('id......',id)
    let res = await ctx.service.admin.getArticleDetailByArticleId(id)
    console.log("查找的id",res)
    resMsg.data = res;
    ctx.body = resMsg
  }
  // 删除文章
  async delArticle(){
    const {ctx} = this;
    let {data} = ctx.request.body;
    let res;
    if(data instanceof Array){
      console.log('批量删除')
      res = await ctx.service.admin.delArticleBatch(data)
    } else if(typeof data == "string"){
      console.log('单个删除')
      res = await ctx.service.admin.delArticle(data)
    }
    if (res === null) {
      resMsg.msg = '文章id不存在'
      resMsg.code = 1
    }
    ctx.body = res
  }
  // 恢复文章
  async recoveryArticle(){
    const {ctx} = this
    let resMsg = ctx.helper.resMsg()
    let {data} = ctx.request.body;
    let res;
    if(data instanceof Array){
      console.log('批量恢复')
      res = await ctx.service.admin.recoveryArticleBatch(data)
    } else if(typeof data == "string"){
      console.log('单个恢复')
      res = await ctx.service.admin.recoveryArticle(data)
    }
    if (res === null) {
      resMsg.msg = '文章id不存在'
      resMsg.code = 1
    }
    ctx.body = resMsg
  }
}

module.exports = AdminController;
