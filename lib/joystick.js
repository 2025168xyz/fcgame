function Joystick(opts){var position={left:"50%",top:"50%"}
this.el=opts&&opts.el
this.color=opts&&opts.color||'white'
this.size=opts&&opts.size||100
this.isFourBtn=opts&&opts.isFourBtn?true:false
this.keyCodes=opts&&opts.keyCodes||[87,83,65,68]
this.btn_down_fn=opts&&opts.btn_down_fn
this.btn_up_fn=opts&&opts.btn_up_fn
this.relative=opts&&opts.relative||true
this.opts={zone:this.el,mode:'static',position:{left:'50%',top:'50%'},color:this.color,size:this.size,}
this.direction=null}
Joystick.prototype.init=function(){var me=this;var manager=nipplejs.create(this.opts);manager.on('start',function(evt,data){})
manager.on('move',function(evt,data){me.onMove&&me.onMove(data)})
manager.on('end',function(evt,data){me.onEnd&&me.onEnd()})
document.querySelector(me.el).addEventListener('touchstart',function(evt){evt.preventDefault()})}
Joystick.prototype.onMove=function(data){var me=this;if(!data.distance)return
var now_direction=me.getDirection(data)
me.handleDirection(now_direction,me.direction)
me.direction=now_direction}
Joystick.prototype.onEnd=function(){var me=this;me.handleCodeArr('up',me.getCodeArr(me.direction))
me.direction=null}
Joystick.prototype.getDirection=function(data){var me=this;if(me.isFourBtn){return data.direction.angle}else{return me.transformDirection(data.angle.degree)}}
Joystick.prototype.transformDirection=function(degree){if(degree>337.5){return 'right'}else if(degree>292.5){return 'right_down'}else if(degree>247.5){return 'down'}else if(degree>202.5){return 'left_down'}else if(degree>157.5){return 'left'}else if(degree>112.5){return 'left_up'}else if(degree>76.5){return 'up'}else if(degree>22.5){return 'right_up'}else{return 'right'}}
Joystick.prototype.handleDirection=function(new_direction,old_direction){var me=this;if(old_direction===null){var code_arr=me.getCodeArr(new_direction)
me.handleCodeArr('down',code_arr)}
if(old_direction!==null&&new_direction!==old_direction){var old_arr=me.getCodeArr(old_direction)
var new_arr=me.getCodeArr(new_direction)
var down_arr=new_arr.filter(code=>{return!old_arr.includes(code)})
me.handleCodeArr('down',down_arr)
var up_arr=old_arr.filter(code=>{return!new_arr.includes(code)})
me.handleCodeArr('up',up_arr)}}
Joystick.prototype.getCodeArr=function(direction){var me=this;switch(direction){case 'up':return[me.keyCodes[0]];break;case 'down':return[me.keyCodes[1]];break;case 'left':return[me.keyCodes[2]];break;case 'right':return[me.keyCodes[3]];break;case 'right_up':return[me.keyCodes[3],me.keyCodes[0]];break;case 'right_down':return[me.keyCodes[3],me.keyCodes[1]];break;case 'left_up':return[me.keyCodes[2],me.keyCodes[0]];break;case 'left_down':return[me.keyCodes[2],me.keyCodes[1]];break;default:break;}}
Joystick.prototype.handleCodeArr=function(type,arr){var me=this;var fn=me.btn_down_fn
if(type!=='down'){fn=me.btn_up_fn}
for(var i=0,len=arr.length;i<len;i++){fn&&fn(me.package(arr[i]))}}
Joystick.prototype.package=function(keyCode){var evt={}
evt.keyCode=keyCode
return evt}