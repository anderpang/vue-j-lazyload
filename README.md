# vue-j-lazyload

vue2.X 高性能图片懒加载插件

## npm

```bash

$ npm install vue-j-lazyload

```

# Usage

List.js
```html
  <ul ref="el" class="pic-list">    
    <li class="item" v-for="(item,i) in list" :key="i" v-lazy="item.url" :title="item.who"></li>
  </ul>
```
```javascript
import lazyload from "vue-j-lazyload";

export default lazyload({
  name: 'list',
  data () {
    return {
       list:[]
    }
  },
  created:function(){
    fetch("http://gank.io/api/data/%E7%A6%8F%E5%88%A9/30/1").then(function(res){
        return res.json();
    }).then(function(j){
        this.list.push(...j.results);  
    }.bind(this));
  },
},
//lazyload配置，可选
{
  loading:"http://img.zcool.cn/community/012c0258d8bb35a801219c77694def.gif", //可选 
  error:"",     //可选，图片加载失败时要显示的图片
  context:"el"  //可选,滚动容器，默认window  
});

```
```html
<style>
   body{margin:0;padding:0;height:100vh;overflow:hidden;}
   .pic-list{height:100vh;overflow:auto;}
   li{min-height:30vh;background:none no-repeat 50% 50%;background-size:contain;}
</style>
```