'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router 中使用中间件
  const auth = app.middleware.auth()
  // 七牛上传文件token
  router.get('/blog/uploadToken',auth,controller.home.qiniuToken)
  // 七牛删除文件
  router.post('/blog/qiniuDel',auth,controller.home.qiniuDelete)
  // 登录接口
  router.post('/blog/login',controller.user.userLogin)
  // 验证码接口
  router.get('/blog/captcha',controller.user.getCaptcha)
  // 创建分类
  router.post('/blog/addCategory',auth,controller.admin.addCategory)
  // 获取分类
  router.get('/blog/getCategory/:page',auth,controller.admin.getCategoryList)
  // 删除分类
  router.post('/blog/delCategory',auth,controller.admin.delCategory)
  // 修改分类
  router.post('/blog/modifyCategory',auth,controller.admin.modifyCategory)
  // 创建标签
  router.post('/blog/createTag',auth,controller.admin.createTag)
  // 获取标签
  router.get(`/blog/getTag/:page`,auth,controller.admin.getTagList)
  // 删除标签
  router.post('/blog/delTag',auth,controller.admin.delTag)
  // 修改标签
  router.post('/blog/modifyTag',auth,controller.admin.modifyTag)
  // 创建或更新文章，如果有文章id就更新文章，否则新建文章
  router.post('/blog/postArticle', auth, controller.admin.postArticle);
  // 获取用户的标签和分类数据
  router.get('/blog/getArticleOptions',auth,controller.admin.getArticleOptions)
  // 获取所有文章列表
  router.post('/blog/getArticleList',auth,controller.admin.getArticleList)
  // 获取文章内容
  router.get('/blog/getArticleDetail/:id',auth,controller.admin.getArticleDetail)
  // 删除文章
  router.post('/blog/delArticle',auth,controller.admin.delArticle)
  // 恢复文章
  router.post('/blog/recoveryArticle', auth, controller.admin.recoveryArticle);
  // --------------------------------web------------------------------------
  // 获取点赞数量
  router.get('/blog/web/getPriseNum',controller.client.getpriseNum)
  // 点赞数量
  router.get('/blog/web/addPriseNum',controller.client.addPriseNum)
  // 获取所有分类和标签及其数量
  router.get('/blog/web/getTagsAndCategories', controller.client.getTagsAndCategories);
  // 获取所有文章列表，如果有传keyword,则根据keyword搜索
  router.post('/blog/web/getArticleList', controller.client.getArticleList);
  // 根据分类搜索
  router.get('/blog/web/searchByCategory/:id/:page', controller.client.searchByCategory);
  // 根据标签搜索
  router.get('/blog/web/searchByTag/:id/:page', controller.client.searchByTag);
  // 获取文章的详细信息
  router.get('/blog/web/getArticleDetail/:id', controller.client.getArticleDetail);
};
