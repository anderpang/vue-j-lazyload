function lazyload(component,opts){
    var directives=component.directives||(component.directives={}),
        lazy=new Lazy(opts);    
    addEvent(component,"mounted",function(){
         var lazy_ctx=lazy._opts.context;
         
         lazy._opts._context=typeof lazy_ctx==="string"?this.$refs[lazy_ctx]:lazy._opts.content;         
         lazy._toggleScroll(true);
    });
    addEvent(component,"destroyed",function(){
         lazy._toggleScroll(false);
    });

    directives.lazy=lazy;

    return component;
}

function addEvent(component,hook,fn){
     var oFn=component[hook],tf=typeof oFn;
     switch(tf){
         case "function":
          component[hook]=[oFn,fn];
         break;
         case "object":
          component[hook].push(fn);
          break;
         default:
           component[hook]=fn;
         break;
     }
}

function Lazy(opts){
   var defaultOpts={
            bg:true,
            timeout:100,
            loading:null, 
            error:null,
            context:window
       },k;
       
   for(k in opts){
       defaultOpts[k]=opts[k];
   }

   this.height=window.innerHeight;
   this._timestamp=0;

   this._listeners=[];
   this._opts=defaultOpts;

   this._scroll=this._scroll.bind(this);
}

Lazy.prototype={
    inserted(el,binding){   
       var _this=binding.def,
           loading=_this._opts.loading;

       if(loading){
          _this._opts.bg?el.style.backgroundImage="url('"+loading+"')":el.src=loading;
       }
       if(_this._checkInView(el,binding.value)){
           return;
       }

       _this._listeners.push({
           el:el,        
           src:binding.value
       });
    },
   update(el,binding){
      if(binding.value===binding.oldValue)return;

       var _this=binding.def,
           ls=_this._listeners,
           i=ls.length,
           has=false;
        while(i--){
            if(ls[i].el===el){
                ls[i].src=binding.value;
                has=true;
                break;
            }
        }

        has||_this.inserted(el,binding);
    },
    
    unbind(el,binding){
       var ls=binding.def._listeners,
           i=ls.length;
        while(i--){
            if(ls[i].el===el){
                ls.splice(i,1);
                break;
            }
        }
    },
    _checkInView(el,src){
       var bound=el.getBoundingClientRect();
       if(bound.bottom>0&&bound.top<this.height){           
           this._loadImg(el,src);
           return true;
       }
       return false;
    },
    _loadImg(el,src){
        var img=new Image(),
            opts=this._opts,
            bg=opts.bg;

        img.onload=function(){
            bg?el.style.backgroundImage="url('"+src+"')":el.src=src;
        };

        if(opts.error){
            img.onerror=function(){
               bg?el.style.backgroundImage="url('"+opts.error+"')":el.src=opts.error;
            };
        }

        img.src=src;
    },
    _scroll(e){
        var timestamp=e&&e.timeStamp||Date.now(),
            timeout=this._opts.timeout;
         clearTimeout(this._timer);

        if(timestamp-this._timestamp>timeout)
        {        
            var ls=this._listeners,
            i=ls.length;

            while(i--){
                if(this._checkInView(ls[i].el,ls[i].src)){
                    ls.splice(i,1);
                }
            }
        }
        else
        {
          this._timer=setTimeout(this._scroll,timeout);
        }
        this._timestamp=timestamp;
    },
    _toggleScroll(bl){
        this._opts._context[bl?"addEventListener":"removeEventListener"]("scroll",this._scroll,false);
    }
}


export default lazyload;