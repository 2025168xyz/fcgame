var JSNES=function(opts){this.opts={ui:JSNES.DummyUI,swfPath:'lib/',preferredFrameRate:60,fpsInterval:500,showDisplay:true,emulateSound:false,sampleRate:44100,CPU_FREQ_NTSC:1789772.5,CPU_FREQ_PAL:1773447.4};if(typeof opts!='undefined'){var key;for(key in this.opts){if(typeof opts[key]!='undefined'){this.opts[key]=opts[key];}}}
this.frameTime=1000/this.opts.preferredFrameRate;this.ui=new this.opts.ui(this);this.cpu=new JSNES.CPU(this);this.ppu=new JSNES.PPU(this);this.papu=new JSNES.PAPU(this);this.mmap=null;this.keyboard=new JSNES.Keyboard();this.ui.updateStatus("Ready to load a ROM.");};JSNES.VERSION="<%= version %>";JSNES.prototype={isRunning:false,fpsFrameCount:0,romData:null,reset:function(){if(this.mmap!==null){this.mmap.reset();}
this.cpu.reset();this.ppu.reset();this.papu.reset();},start:function(){var self=this;if(this.rom!==null&&this.rom.valid){if(!this.isRunning){this.isRunning=true;this.frameInterval=setInterval(function(){self.frame();},this.frameTime);this.resetFps();this.printFps();this.fpsInterval=setInterval(function(){self.printFps();},this.opts.fpsInterval);}}
else{this.ui.updateStatus("There is no ROM loaded, or it is invalid.");}},frame:function(){this.ppu.startFrame();var cycles=0;var emulateSound=this.opts.emulateSound;var cpu=this.cpu;var ppu=this.ppu;var papu=this.papu;FRAMELOOP:for(;;){if(cpu.cyclesToHalt===0){cycles=cpu.emulate();if(emulateSound){papu.clockFrameCounter(cycles);}
cycles*=3;}
else{if(cpu.cyclesToHalt>8){cycles=24;if(emulateSound){papu.clockFrameCounter(8);}
cpu.cyclesToHalt-=8;}
else{cycles=cpu.cyclesToHalt*3;if(emulateSound){papu.clockFrameCounter(cpu.cyclesToHalt);}
cpu.cyclesToHalt=0;}}
for(;cycles>0;cycles--){if(ppu.curX===ppu.spr0HitX&&ppu.f_spVisibility===1&&ppu.scanline-21===ppu.spr0HitY){ppu.setStatusFlag(ppu.STATUS_SPRITE0HIT,true);}
if(ppu.requestEndFrame){ppu.nmiCounter--;if(ppu.nmiCounter===0){ppu.requestEndFrame=false;ppu.startVBlank();break FRAMELOOP;}}
ppu.curX++;if(ppu.curX===341){ppu.curX=0;ppu.endScanline();}}}
this.fpsFrameCount++;},printFps:function(){var now=+new Date();var s='Running';if(this.lastFpsTime){s+=': '+(this.fpsFrameCount/((now-this.lastFpsTime)/1000)).toFixed(2)+' FPS';}
this.ui.updateStatus(s);this.fpsFrameCount=0;this.lastFpsTime=now;},stop:function(){clearInterval(this.frameInterval);clearInterval(this.fpsInterval);this.isRunning=false;},reloadRom:function(){if(this.romData!==null){this.loadRom(this.romData);}},loadRom:function(data){if(this.isRunning){this.stop();}
this.ui.updateStatus("Loading ROM...");this.rom=new JSNES.ROM(this);this.rom.load(data);if(this.rom.valid){this.reset();this.mmap=this.rom.createMapper();if(!this.mmap){return;}
this.mmap.loadROM();this.ppu.setMirroring(this.rom.getMirroringType());this.romData=data;this.ui.updateStatus("Successfully loaded. Ready to be started.");}
else{this.ui.updateStatus("Invalid ROM!");}
return this.rom.valid;},resetFps:function(){this.lastFpsTime=null;this.fpsFrameCount=0;},setFramerate:function(rate){this.opts.preferredFrameRate=rate;this.frameTime=1000/rate;this.papu.setSampleRate(this.opts.sampleRate,false);},toJSON:function(){return{'romData':this.romData,'cpu':this.cpu.toJSON(),'mmap':this.mmap.toJSON(),'ppu':this.ppu.toJSON()};},fromJSON:function(s){this.loadRom(s.romData);this.cpu.fromJSON(s.cpu);this.mmap.fromJSON(s.mmap);this.ppu.fromJSON(s.ppu);}};