(function(){
var DOC=document;
    SVG_NS = 'http://www.w3.org/2000/svg',
	hasSVG = !!DOC.createElementNS && !!DOC.createElementNS(SVG_NS, "svg").createSVGRect,
	fill = "<v:fill color='{fillColor}' opacity='{fillOpacity}'/>",
	stroke = "<v:stroke startarrow='{startArrow}' endarrow='{endArrow}' color='{strokeColor}' joinstyle='miter' weight='{strokeWidth}px' opacity='{strokeOpacity}'/>",
    pathReg = /\w|[\s\d-+.,]*/g,
    numberReg = /[\d-+.]+/g,
    firstUp = function(w){
    	return w.toLowerCase().replace(/^\S/,w.toUpperCase().charAt(0));
    },
    newSVG = function(tag){
    	return Ext.get(DOC.createElementNS(SVG_NS, tag));
    },
    newVML = function(vml){
    	return Ext.get(DOC.createElement(vml));
    },
    encodeStyle = function(prop,value){
    	var tmp,style,css=[];
        if (!Ext.isObject(prop)) {
            tmp = {};
            tmp[prop] = value;
            prop = tmp;
        }
        for (style in prop) {
            value = prop[style];
            css.push(style);
            css.push(':');
            css.push(value);
            css.push(';');
        }
        return css.join('');
    }

/**
 * @class Aurora.Graphics
 * @extends Aurora.Component
 * 图形基础组件.
 * @author huazhen.wu@hand-china.com
 * @constructor
 * @param {Object} config 配置对象. 
 */
$A.Graphics=Ext.extend($A.Component,{
	constructor: function(config) {
		this.root=config.root;
		$A.Graphics.superclass.constructor.call(this,config);
		return this;
	},
	initComponent : function(config){ 
		$A.Graphics.superclass.initComponent.call(this,config);
		this['init'+(hasSVG?'SVG':'VML')+'Element']();
    },
    initEvents : function(){
    	$A.Graphics.superclass.initEvents.call(this);
    	this.addEvents(
	    	/**
	         * @event click
	         * 单击事件.
	         * @param {Aurora.Tab} obj 组件对象.
	         */
    		'click'
    	)
    },
	processListener: function(ou){
		$A.Graphics.superclass.processListener.call(this,ou);
		this.wrap[ou]('click',this.onClick,this,{preventDefault:true});
    },
    initSVGElement : function(){
    	this.root = newSVG("svg");
    	this.wrap.dom.appendChild(this.root.dom);
    },
    initVMLElement : function(){
    	if (!DOC.namespaces.hcv) {
            DOC.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
            DOC.createStyleSheet().cssText = 
                'v\\:roundrect,v\\:oval,v\\:image,v\\:polyline,v\\:line,v\\:group,v\\:fill,v\\:path,v\\:shape,v\\:stroke'+
                '{ behavior:url(#default#VML); display: inline-block; } ';
        }
        this.root = newVML("v:group");
        this.root.setStyle({position:'relative',width:'100%',height:'100%'})
        this.root.set({coordsize:this.width+','+this.height,CoordOrig:'0 50'})
        this.wrap.dom.appendChild(this.root.dom);
    },
    onClick : function(e){
    	this.fireEvent('click',this,e);
    },
	createGElement : function(name,config){
    	return new $A[firstUp(name)](Ext.apply(config,{root:Ext.get(config.root)||this.root}));
    },
    setOpacity : function(o){
    	
    },
    setStroke : function(config){
    	
    }
});

$A.Path=Ext.extend($A.Graphics,{
	zoom:10000,
	initSVGElement : function(){
		this.wrap = newSVG("path");
    	this.wrap.dom.style.cssText=encodeStyle({
    		'fill':this.fillcolor,
    		'fill-opacity':this.fillopacity,
    		'stroke':this.strokecolor,
    		'stroke-width':this.strokewidth,
    		'stroke-opacity':this.strokeopacity
    	})+this.style;
    	this.wrap.set({d:this.d});
    	this.root.appendChild(this.wrap);
    },
    initVMLElement : function(){
    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
    		style:this.style,
    		path:this.convertPath(this.d),
    		zoom:this.zoom,
    		fillColor:this.fillcolor||'black',
    		fillOpacity:this.fillopacity||'1',
    		strokeColor:this.strokecolor||'none',
    		strokeWidth:this.strokecolor?this.strokewidth:0,
    		strokeOpacity:this.strokecolor?(this.strokeopacity||1):0
    	},true)
    },
    convertPath : function(p){
    	var arr=p.match(pathReg),p1=[0,0],p2=[0,0],path=[],sf=this,
    	f1=function(s,isC){
    		var arr=Ext.isArray(s)?s:s.match(numberReg);
    		for(var i=0;i<arr.length;i++){
    			if(!isC||i/2%3==2){
    				p2[0]+=f4(arr[i]);
    				p2[1]+=f4(arr[++i]);
    				path=path.concat(p2);
    			}else{
    				path=path.concat([p2[0]+f4(arr[i]),p2[1]+f4(arr[++i])]);
    			}
    		}
    	},
    	f2=function(s,re){
    		var arr=s.match(numberReg);
    		while(arr.length&&arr.length%7==0){
	    		var	rx=f4(arr.shift()),
	    			ry=f4(arr.shift()),
	    			rr=f4(arr.shift()),
	    			la=Number(arr.shift()),//是否是大角度弧线
	    			sw=Number(arr.shift()),//是否是顺时针
	    			x=f4(arr.shift()),
	    			y=f4(arr.shift()),
	    			l,t,r,b;
	    		if(re){
	    			x+=p2[0];
	    			y+=p2[1];
	    		}
	    		var dx=Math.abs(x-p2[0]),dy=Math.abs(y-p2[1]);
	    		rx=dx;ry=dy;
	    		path.push(sw?'wa':'at');
	    		if((sw^la)^x<p2[0]){
					if(y<p2[1]){
						l=p2[0];
						t=p2[1]-ry;
					}else{
						l=p2[0]-rx;
						t=p2[1];
					}
	    		}else{
	    			if(y<p2[1]){
						l=p2[0]-rx;
						t=p2[1]-(ry<<1);
					}else{
						l=p2[0]-(rx<<1);
						t=p2[1]-ry;
					}
	    		}
	    		r=l+(rx<<1);
				b=t+(ry<<1);
	    		path.push(l,t,r,b,p2[0],p2[1],x,y);
	    		p2=[x,y];
    		}
    	},
    	f3=function(s){
    		var a=s.match(numberReg).slice(-2);
    		return [f4(a[0]),f4(a[1])];
    	},
    	f4=function(n){
    		return Math.floor(n*sf.zoom);
    	},
    	f5=function(s){
    		for(var i=0,a=s.match(numberReg);i<a.length;i++){
    			path.push(f4(a[i]))
    		}
    	}
    	for(var i=0;i<arr.length;i++){
    		switch(arr[i]){
    			case 'M': p1=f3(arr[i+1]);
    			case 'C':
    			case 'L': p2=f3(arr[i+1]);path.push(arr[i]);f5(arr[++i]);break;
    			case 'm': path.push('M');f1(arr[++i]);p1=[].concat(p2);break;
    			case 'c': path.push('C');f1(arr[++i],true);break;
    			case 'l': path.push('L');f1(arr[++i]);break;
    			case 'h': path.push('L');f1(arr[++i]+" 0");break;
    			case 'v': path.push('L');f1("0 "+arr[++i]);break;
    			case 'H': path.push('L');p2[0]=f4(arr[++i]);path.push(p2[0],p2[1]);break;
    			case 'V': path.push('L');p2[1]=f4(arr[++i]);path.push(p2[0],p2[1]);break;
    			case 'A': f2(arr[++i]);break;
    			case 'a': f2(arr[++i],true);break;
    			case 'Z': 
    			case 'z': path.push('X');p2=[].concat(p1);break;
    		}
    	}
    	path.push('E');
    	return path.join(' ');
    },
    vmlTpl : ["<v:shape coordsize='{zoom},{zoom}' style='position:absolute;left:0;top:0;width:1px;height:1px;{style}' path='{path}'>",
    fill,stroke,"</v:shape>"]
});
$A.Line = function(config){
	var a= config.points.match(numberReg);
	a.splice(2,0,"L");
	return new $A.Path(Ext.apply(config,{d:["M"].concat(a).join(' ')}));
}
$A.Oval=Ext.extend($A.Graphics,{
	initSVGElement : function(){
		this.wrap = newSVG("ellipse");
    	this.wrap.dom.style.cssText=encodeStyle({
    		'fill':this.fillcolor,
    		'fill-opacity':this.fillopacity,
    		'stroke':this.strokecolor,
    		'stroke-width':this.strokewidth,
    		'stroke-opacity':this.strokeopacity
    	})+this.style;
    	this.wrap.set({cx:this.cx,cy:this.cy,rx:this.rx,ry:this.ry});
    	this.root.appendChild(this.wrap);
    },
    initVMLElement : function(){
    	this.wrap=new Ext.Template(this.vmlTpl).append(this.root.dom,{
    		style:this.style,
    		left:this.cx-this.rx,
    		top:this.cy-this.ry,
    		width:this.rx<<1,
    		height:this.ry<<1,
    		fillColor:this.fillcolor||'black',
    		fillOpacity:this.fillcolor=='none'?'0':(this.fillopacity||'1'),
    		strokeColor:this.strokecolor||'none',
    		strokeWidth:this.strokecolor?this.strokewidth:0,
    		strokeOpacity:this.strokecolor?(this.strokeopacity||1):0
    	},true)
    },
    vmlTpl : ["<v:oval style='left:{left}px;top:{top}px;width:{width}px;height:{height}px;{style}'>",
    fill,stroke,"</v:oval>"]
});

$A.Rect = function(config){
	var l = Number(config.x)||0,
		t = Number(config.y)||0,
		h = Number(config.height)||200,
		w = Number(config.width)||200,
		rx = Math.min(Number(config.rx)||0,w/2),
		ry = Math.min(Number(config.ry)||0,h/2),
		round = rx>0&&ry>0,
		lx = rx!=w/2,
		ly = ry!=h/2,
		d = ['M',l,t+(round?ry:0)];
		if(round)d.push('A',rx,ry,0,0,1,l+rx,t);
		if(lx)d.push('H',l+w-(round?rx:0));
		if(round)d.push('A',rx,ry,0,0,1,l+w,t+ry);
		if(ly)d.push('V',t+h-(round?ry:0));
		if(round)d.push('A',rx,ry,0,0,1,l+w-rx,t+h);
		if(lx)d.push('H',l+(round?rx:0));
		if(round)d.push('A',rx,ry,0,0,1,l,t+h-ry);
		if(ly)d.push('Z');
	return new $A.Path(Ext.apply(config,{d:d.join(' ')}));
}

$A.Diamond = function(config){
	var l = Number(config.x)||0,
		t = Number(config.y)||0,
		h = Number(config.height)||100,
		w = Number(config.width)||200,
		d = ['M',
			l,t+config.height/2,
			'L',
			l+w/2,t,
			l+w,t+h/2,
			l+w/2,t+h,
			'Z'];
	return new $A.Path(Ext.apply(config,{d:d.join(' ')}));
}
})();