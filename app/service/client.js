const Service = require('egg').Service;

class ClientService extends Service {
  // 获取点赞数量
  async getpriseNum(){
    const {app} = this;
    let arry = await app.mysql.select('praise')
    return arry[0]['count']
  }
  // 点赞数量增加
  async addPriseNum(){
    const {app} = this;
    let count = await this.getpriseNum();
    console.log('getprisenum......',count)
    let newcount = count + 1
    let sql = `update praise set count = ${newcount} where count = ${count}`
    let result = await app.mysql.query(sql)
    return result.affectedRows === 1;
  }
  // 获取分类
  async getCategoriesCount(){
    const {ctx,app} = this;
    let categories = await app.mysql.select('class')
    console.log(categories)
    let res = []
    for (let index = 0; index < categories.length; index++) {
      let item = categories[index]
      console.log(item)
      let count = await app.mysql.select('article',{where:{ status: 1, classid: item.id }})
      console.log("count",count)
      res.push({
        count: count.length,
        categoryName: item.name,
        categoryId: item.id
      })
    }
    console.log("res",res)
    return res
  }
  // 获取标签
  async getTagsCount(){
    const { ctx,app } = this
    let tags = await app.mysql.select('lable')
    console.log(tags)
    let res = []
    for (let index = 0; index < tags.length; index++) {
      let item = tags[index]
      let sql = `SELECT * FROM article where status = 1 and FIND_IN_SET(${item.id},lableid);`
      let count = await app.mysql.query(sql)
      res.push({
        count: count.length,
        tagName: item.name,
        tagId: item.id
      })
    }
    console.log(res)
    return res
  }
  // 获取所有文章列表，如果有传keyword,则根据keyword搜索
  async getAllArticleById(page, keyword){
    const { ctx,app } = this
    const TABLE_NAME = 'article';
    let sql = `select A.id,title,C.name as classname,C.id as classid,lableid,reading,content,A.status,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime from article as A left join class as C on A.classid = C.id where ${keyword !== '' ? "title like '%" + keyword + "%' and" : ''} status = 1 limit ${(page - 1) * 10},10;`;
    // console.log(sql)
    let row = await app.mysql.query(sql);
    let sql1 = `select * from ${TABLE_NAME} where ${keyword !== '' ? "title like '%" + keyword + "%' and" : ''}  status = 1`;
    let rows = await app.mysql.query(sql1);
    // console.log("sql1", sql1)
    let list = row
    let count = rows.length;

    for(let i = 0;i<list.length;i++){
      console.log(list[i].lableid)
      list[i].lableArry = []
      let labled = list[i].lableid.split(',')
      for(let j = 0;j<labled.length;j++){
        let sql2 = `SELECT id,name FROM lable where id = ${labled[j]};`
        let result = await app.mysql.query(sql2)
        console.log('获取的标签名字',result[0].name)
        list[i].lableArry.push({
          name: result[0].name,
          id: result[0].id
        })
      }
    }
    // 截出预览部分
    list.map(item => {
      item.content = item.content.split('<!-- more -->')[0]
      return item
    })
    return {
      list,
      count
    }
  }
  // 根据id 获取文章的详情
  async getArticleDetailByArticleId(id) {
    const { ctx,app } = this
    console.log("当前的文章id",id)
    let reading = await app.mysql.select('article',{
      where:{id:id},
      columns: ['reading']
    })
    console.log("reading",reading[0]['reading'])
    let newReading = reading[0]['reading'] + 1
    let row = {
      id:id,
      reading: newReading
    }
    let addReading = await app.mysql.update('article',row)
    if(addReading.affectedRows === 1){
      let sql = `select A.id,title,C.name as classname,C.id as classid,lableid,reading,content,A.status,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime from article as A left join class as C on A.classid = C.id where A.id = ${id};`;
      console.log(sql)
      let res = await app.mysql.query(sql);
      res = res[0]
      res.lableArry = []
      let labled = res.lableid.split(",")
      console.log("labled",labled)
      for(let j = 0;j<labled.length;j++){
        let sql2 = `SELECT id,name FROM lable where id = ${labled[j]};`
        let result = await app.mysql.query(sql2)
        res.lableArry.push({
          name: result[0].name,
          id: result[0].id
        })
      }
      console.log("获取的数据啊", res)
      return res
    }
  }
  // 根据分类搜索
  async searchByCategory(page, id) {
    const { ctx,app } = this
    const TABLE_NAME = 'article';
    let sql = `select A.id,title,C.name as classname,C.id as classid,lableid,reading,content,A.status,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime from article as A left join class as C on A.classid = C.id where A.classid = ${id} and status = 1 limit ${(page - 1) * 10},10;`;
    console.log(sql)
    let row = await app.mysql.query(sql);
    let sql1 = `select * from ${TABLE_NAME} where classid = ${id} and status = 1`;
    let rows = await app.mysql.query(sql1);
    console.log("sql1", sql1)
    let list = row
    let count = rows.length;

    for(let i = 0;i<list.length;i++){
      console.log(list[i].lableid)
      list[i].lableArry = []
      let labled = list[i].lableid.split(',')
      for(let j = 0;j<labled.length;j++){
        let sql2 = `SELECT id,name FROM lable where id = ${labled[j]};`
        let result = await app.mysql.query(sql2)
        console.log('获取的标签名字',result[0].name)
        list[i].lableArry.push({
          name: result[0].name,
          id: result[0].id
        })
      }
    }
    // 截出预览部分
    list.map(item => {
      item.content = item.content.split('<!-- more -->')[0]
      return item
    })
    return {
      list,
      count
    }
  }
  // 根据标签搜索
  async searchByTag(page, id) {
    const { ctx,app } = this
    const TABLE_NAME = 'article';
    let sql = `select A.id,title,C.name as classname,C.id as classid,lableid,reading,content,A.status,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i:%s') as createTime from article as A left join class as C on A.classid = C.id where FIND_IN_SET(${id},lableid) and status = 1 limit ${(page - 1) * 10},10;`;
    console.log(sql)
    let row = await app.mysql.query(sql);
    let sql1 = `select * from ${TABLE_NAME} where FIND_IN_SET(${id},lableid) and status = 1`;
    let rows = await app.mysql.query(sql1);
    console.log("sql1", sql1)
    let list = row
    let count = rows.length;

    for(let i = 0;i<list.length;i++){
      console.log(list[i].lableid)
      list[i].lableArry = []
      let labled = list[i].lableid.split(',')
      for(let j = 0;j<labled.length;j++){
        let sql2 = `SELECT id,name FROM lable where id = ${labled[j]};`
        let result = await app.mysql.query(sql2)
        console.log('获取的标签名字',result[0].name)
        list[i].lableArry.push({
          name: result[0].name,
          id: result[0].id
        })
      }
    }
    // 截出预览部分
    list.map(item => {
      item.content = item.content.split('<!-- more -->')[0]
      return item
    })
    return {
      list,
      count
    }
  }



}

module.exports = ClientService
