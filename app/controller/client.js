'use strict'

const Controller = require('egg').Controller

class ClientController extends Controller {
  // 获取点赞数量
  async getpriseNum(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let res = await ctx.service.client.getpriseNum()
    console.log('.............',res)
    resMsg.data = res
    ctx.body = resMsg
  }
  // 点赞
  async addPriseNum(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let res = await ctx.service.client.addPriseNum()
    console.log(res)
    resMsg.data = res
    ctx.body = resMsg
  }
  // 获取所有分类和标签以及数量
  async getTagsAndCategories(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let [ categoriesCount, tagsCount ] = await Promise.all([
      ctx.service.client.getCategoriesCount(),
      ctx.service.client.getTagsCount()
    ])
    resMsg.data = {
      categoriesCount,
      tagsCount
    }
    ctx.body = resMsg
  }
  // 获取所有文章列表，如果有传keyword,则根据keyword搜索
  async getArticleList(){
    const { ctx } = this
    let { page = 1, keyword = '' } = ctx.request.body
    let resMsg = ctx.helper.resMsg()
    let articleList = await ctx.service.client.getAllArticleById(page, keyword)
    console.log('article',articleList)
    resMsg.data = {
      list: articleList.list,
      count: articleList.count
    }
    ctx.body = resMsg
  }
  // 获取文章的详细信息
  async getArticleDetail(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let id = ctx.params.id;
    let res = await ctx.service.client.getArticleDetailByArticleId(id)
    resMsg.data = res
    ctx.body = resMsg
  }
  // 根据分类搜索
  async searchByCategory(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let {id,page} = ctx.params;
    console.log(id,page)
    let articleList = await ctx.service.client.searchByCategory(page, id)
    console.log(articleList)
    resMsg.data = {
      list: articleList.list,
      count: articleList.count
    }
    ctx.body = resMsg
  }
  // 根据标签搜索
  async searchByTag(){
    const {ctx} = this;
    let resMsg = ctx.helper.resMsg()
    let {id,page} = ctx.params;
    let articleList = await ctx.service.client.searchByTag(page, id)
    resMsg.data = {
      list: articleList.list,
      count: articleList.count
    }
    ctx.body = resMsg
  }

}

module.exports = ClientController
