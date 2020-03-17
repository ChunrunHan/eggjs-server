const Service = require('egg').Service;

class AdminService extends Service {
  // 检查分类名字是否重复
  async checkDuplicateCategory(name) {
    const { ctx, app } = this;
    let res = await app.mysql.get('class', { name: name })
    console.log(res)
    return res === null
  }
  // 新增分类
  async createCategory(name) {
    const { ctx, app } = this
    let result = await app.mysql.insert('class', { name: name, userid: ctx.userId });
    return result.affectedRows === 1
  }
  // 获取分类列表
  async getCategoryList(page) {
    console.log(page)
    const { ctx, app } = this
    let [list, count] = await Promise.all([
      app.mysql.select('class', { // 搜索表
        limit: 10, // 返回数据量
        offset: (page - 1) * 10, // 数据偏移量
      }),
      app.mysql.select('class')
    ])
    console.log("list", list)
    console.log("count", count)
    return {
      list,
      count: count.length
    }
  }
  // 单个删除分类信息
  async delCategory(id) {
    const { ctx, app } = this
    return await app.mysql.delete('class', {
      id: id,
    });
  }
  // 批量删除分类信息
  async delCategoryBatch(list) {
    const { ctx, app } = this
    for (let i = 0; i < list.length; i++) {
      let res = await app.mysql.delete('class', {
        id: list[i],
      });
      console.log("res", res)
      if (res.affectedRows === 1) {
        if(list.length - 1 === i){
          return list.length - 1 === i
        }
      } else {
        return false
      }
    }
  }
  // 修改分类信息
  async modifyCategory({ id, name }) {
    const { ctx, app } = this;
    console.log(id, name)
    const row = {
      id: id,
      name: name
    };
    const result = await app.mysql.update('class', row); // 更新表中的记录
    return result.affectedRows === 1;
  }
  // 检查标签名字是否重复
  async checkDuplicateTag(name) {
    const { ctx, app } = this;
    let res = await app.mysql.get('lable', { name: name })
    return res === null
  }
  // 新增标签信息
  async createTag(name) {
    const { ctx, app } = this;
    let result = await app.mysql.insert('lable', { name: name, userid: ctx.userId });
    return result.affectedRows === 1
  }
  // 获取标签信息
  async getTagList(page) {
    const { ctx, app } = this;
    let [list, count] = await Promise.all([
      app.mysql.select('lable', {
        limit: 10,
        offset: (page - 1) * 10
      }),
      app.mysql.select('lable')
    ])
    return {
      list,
      count: count.length
    }
  }
  // 单个删除标签信息
  async delTag(id) {
    const { ctx, app } = this;
    let res = app.mysql.delete('lable', { id: id })
    return res
  }
  // 批量删除标签信息
  async delTagBatch(list) {
    const { app } = this;
    console.log("list",list)
    console.log("list",list.length)
    for (let i = 0; i < list.length; i++) {
      let res = await app.mysql.delete('lable', {
        id: list[i],
      });
      console.log("res", res)
      if (res.affectedRows === 1) {
        if(list.length - 1 === i){
          return list.length - 1 === i
        }
      } else {
        return false
      }
    }
  }
  // 修改标签信息
  async modifyTag({ id, name }) {
    const { ctx, app } = this;
    console.log(id, name)
    const row = {
      id: id,
      name: name
    };
    const result = await app.mysql.update('lable', row); // 更新表中的记录
    return result.affectedRows === 1;
  }
  // 创建文章
  async createArticle() {
    const { ctx, app } = this;
    let { data } = ctx.request.body;
    console.log("data", data)
    let result = await app.mysql.insert('article', {
      title: data.title,
      classid: data.classid,
      lableid: data.lableid,
      content: data.content,
      status: data.status,
      userid: ctx.userId
    });
    console.log(result)
    return result.affectedRows === 1
  }
  // 查找文章的status
  async findArticleStatus(id) {
    const { ctx, app } = this;
    let sql = `select status from article where id = ${id}`
    let res = await app.mysql.query(sql)
    return res[0].status
  }
  // 更新文章
  async updateArticle(id) {
    const { ctx, app } = this;
    console.log("id", id)
    let { data } = ctx.request.body;
    console.log("data", data)
    const row = {
      id: data.id,
      title:data.title,
      classid: data.classid,
      lableid: data.lableid,
      content: data.content,
      status: data.status,
      userid: data.userid
    };
    const result = await app.mysql.update('article', row);
    return result.affectedRows === 1;
  }
  // 根据用户id获取分类列表，只返回所有分类，用于文章编辑页
  async getCategoryListById(id) {
    const { ctx, app } = this
    return await app.mysql.select('class', {
      where: { userid: id },
      columns: ['id', 'name']
    })
  }
  // 根据用户id获取标签列表，只返回所有标签，用于文章编辑页
  async getTagsListById(id) {
    const { ctx, app } = this
    return await app.mysql.select('lable', {
      where: { userid: id },
      columns: ['id', 'name']
    })
  }
  // 获取所有文章列表
  async getArticleList(userId, page, keyword, status) {
    const { ctx, app } = this;
    const TABLE_NAME = 'article';
    let sql = `select id,title,content,status,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime from ${TABLE_NAME} where ${keyword !== '' ? "title like '%" + keyword + "%' and" : ''} status = ${status} and userid = ${userId} order by createTime desc limit ${(page - 1) * 10},10;`;
    const row = await app.mysql.query(sql);
    let sql1 = `select * from ${TABLE_NAME} where ${keyword !== '' ? "title like '%" + keyword + "%' and" : ''}  status = ${status} and userid = ${userId}`;
    const rows = await app.mysql.query(sql1);
    console.log("sql1", sql1)
    return {
      list: row,
      count: rows.length
    }
  }
  // 根据文章id获取文章详情
  async getArticleDetailByArticleId(id){
    const {app} = this;
    return await app.mysql.get('article',{id:id})
  }
  // 单个删除文章信息
  async delArticle(id) {
    const { ctx, app } = this;
    if(ctx.request.body.truly){
      let res = app.mysql.delete('article', { id: id })
      return res
    }else{
      const row = {
        id: id,
        status: 3
      };
      let res = app.mysql.update('article',row)
      return res.affectedRows === 1;
    }

  }
  // 批量删除文章信息
  async delArticleBatch(list) {
    const { ctx, app } = this;
    if(ctx.request.body.truly){
      for (let i = 0; i < list.length; i++) {
        let res = await app.mysql.delete('article', {
          id: list[i],
        });
        console.log("res", res)
        if (res.affectedRows === 1) {
          if(list.length - 1 === i){
            return list.length - 1 === i
          }
        } else {
          return false
        }
      }
    }else{
      for (let i = 0; i < list.length; i++) {
        let row = {
          id: list[i],
          status: 3
        };
        let res = await app.mysql.update('article', row);
        console.log("res", res)
        if (res.affectedRows === 1) {
          if(list.length - 1 === i){
            return list.length - 1 === i
          }
        } else {
          return false
        }
      }
    }
  }
  // 单个恢复文章
  async recoveryArticle (id){
    const {ctx,app} = this;
    const row = {
      id: id,
      status: 1
    };
    let res = app.mysql.update('article',row)
    return res.affectedRows === 1;
  }
  // 批量恢复文章
  async recoveryArticleBatch(list){
    const {ctx,app} = this;
    for (let i = 0; i < list.length; i++) {
      let row = {
        id: list[i],
        status: 1
      };
      let res = await app.mysql.update('article', row);
      console.log("res", res)
      if (res.affectedRows === 1) {
        if(list.length - 1 === i){
          return list.length - 1 === i
        }
      } else {
        return false
      }
    }
  }
}

module.exports = AdminService
