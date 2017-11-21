# vue-j-lazyload

vue2.X 高性能图片懒加载插件。

进入时绑定onscroll，退出时解绑onscroll，不会所有页面都带有onscroll事件。

## npm

```bash

$ npm install vue-j-lazyload

```

# Usage
main.js
```javascript
import Vue from "vue";
import lazyload from "vue-j-lazyload";

Vue.use(lazyload,{
  loading:"http://img.zcool.cn/community/012c0258d8bb35a801219c77694def.gif", //可选 
});

```

List.js
```html
  <ul class="pic-list" v-use-lazy>    
    <li class="item" v-for="(item,i) in list" :key="i" v-lazy="item.url" :title="item.who"></li>
  </ul>
```
```javascript


export default {
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
};

```
```html
<style>
   body{margin:0;padding:0;height:100vh;overflow:hidden;}
   .pic-list{height:100vh;overflow:auto;}
   li{min-height:30vh;background:none no-repeat 50% 50%;background-size:contain;}
</style>
```