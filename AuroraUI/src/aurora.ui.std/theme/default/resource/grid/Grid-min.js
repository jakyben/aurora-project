(function(){var au=document,aU=au.documentElement,ac="_",k="__",v=".",r=" ",w="",B="]",ar="-c",ai="-u",aC="$l-",aw="$u-",aD="on",ah="px",aR="tr",a="td",aW="th",b="_tb",ak="div",n="top",c="left",af="none",P="width",J="center",an="hidden",aG="cursor",aj="visible",at="default",W="w-resize",g="outline",aH="1px dotted blue",aI="atype",e="append",aB="insertBefore",aN="insertAfter",f="before",l="_navbar",aP="text-overflow",A="recordid",N="dataindex",Z="row-selected",M="required",ay="item-notBlank",am="item-invalid",d="row-alt",D="grid-rowbox",aL=v+D,t="grid.rowcheck",z="grid.rowradio",E="grid.head",aS="grid-ckb ",ab="grid-select-all",ae="multiple",ap="checkedvalue",x="-readonly",G="item-ckb",S=G+"-self",aT=v+S,av=G+ai,aE=G+ar,I=G+x+ai,R=G+x+ar,T="item-radio-img",aM=T+ar,aA=T+ai,O=T+x+ar,F=T+x+ai,aQ=aT+r+v+aE,q="grid-cell",h="cell-editor",K="cellcheck",V="rowcheck",X="rowradio",al="rownumber",j="grid-",aY=j+al,aF="desc",o="asc",i=j+aF,ax=j+o,p="click",aV="dblclick",H="cellclick",u="render",aO="rowclick",ao="editorshow",Q="nexteditorshow",aJ="keydown",ag="select",y="mousedown",aq="mousemove",ad="mouseup",Y="未找到",az="方法!",L="tr[class!=grid-hl]",s="div[atype=grid.headcheck]",aK="["+N+"=",aX=aW+aK,aa=a+aK,m={autoadjust:true,forexport:true,hidden:false,lock:false,resizable:true,rowspan:1,sortable:true,width:100};$A.Grid=Ext.extend($A.Component,{constructor:function(C){this.selectedId=null;this.lockWidth=0;this.autofocus=C.autofocus||true;$A.Grid.superclass.constructor.call(this,C)},initComponent:function(C){$A.Grid.superclass.initComponent.call(this,C);var U=this.wrap;this.wb=Ext.get(this.id+"_wrap");this.fb=this.wb.child("div[atype=grid.fb]");if(this.fb){this.uf=this.fb.child("div[atype=grid.uf]")}this.uc=U.child("div[atype=grid.uc]");this.uh=U.child("div[atype=grid.uh]");this.ub=U.child("div[atype=grid.ub]");this.uht=U.child("table[atype=grid.uht]");this.lc=U.child("div[atype=grid.lc]");this.lh=U.child("div[atype=grid.lh]");this.lb=U.child("div[atype=grid.lb]");this.lht=U.child("table[atype=grid.lht]");this.sp=U.child("div[atype=grid.spliter]");Ext.getBody().insertFirst(this.sp);this.fs=U.child("a[atype=grid.focus]");this.classfiyColumns();this.initTemplate()},processListener:function(C){$A.Grid.superclass.processListener.call(this,C);this.wrap[C]("mouseover",this.onMouseOver,this)[C]("mouseout",this.onMouseOut,this)[C](p,this.focus,this);if(!(this.canwheel===false)){this.wb[C]("mousewheel",this.onMouseWheel,this)}this.fs[C](Ext.isOpera?"keypress":aJ,this.handleKeyDown,this);this.ub[C]("scroll",this.syncScroll,this)[C](p,this.onClick,this)[C](aV,this.onDblclick,this);this.uht[C](aq,this.onUnLockHeadMove,this);this.uh[C](y,this.onHeadMouseDown,this)[C](p,this.onHeadClick,this);if(this.lb){this.lb[C](p,this.onClick,this)[C](aV,this.onDblclick,this)}if(this.lht){this.lht[C](aq,this.onLockHeadMove,this)}if(this.lh){this.lh[C](y,this.onHeadMouseDown,this)[C](p,this.onHeadClick,this)}this[C](H,this.onCellClick,this)},initEvents:function(){$A.Grid.superclass.initEvents.call(this);this.addEvents(u,aJ,aV,H,aO,ao,Q)},syncScroll:function(){this.hideEditor();this.uh.dom.scrollLeft=this.ub.dom.scrollLeft;if(this.lb){this.lb.dom.scrollTop=this.ub.dom.scrollTop}if(this.uf){this.uf.dom.scrollLeft=this.ub.dom.scrollLeft}},handleKeyDown:function(aZ){var C=aZ.getKey(),U=this.dataset;if(aZ.ctrlKey&&aZ.keyCode==86&&this.canpaste){var a0=window.clipboardData.getData("text");if(a0){Ext.each(a0.split("\n"),function(a4){var a2=a4.split("\t");if(a2==w){return}var a3={},a1=0;Ext.each(this.columns,function(a5){if(this.isFunctionCol(a5.type)){return}if(a5.hidden!==true){a3[a5.name]=a2[a1];a1++}},this);U.create(a3)},this)}}else{if(C==38||C==40||C==33||C==34){if(U.loading==true){return}switch(aZ.getKey()){case 33:U.prePage();break;case 34:U.nextPage();break;case 38:U.pre();break;case 40:U.next();break}}}this.fireEvent(aJ,this,aZ)},processDataSetLiestener:function(C){var U=this.dataset;if(U){U[C]("ajaxfailed",this.onAjaxFailed,this);U[C]("metachange",this.onRefresh,this);U[C]("update",this.onUpdate,this);U[C]("reject",this.onUpdate,this);U[C]("add",this.onAdd,this);U[C]("submit",this.onBeforSubmit,this);U[C]("submitfailed",this.onAfterSuccess,this);U[C]("submitsuccess",this.onAfterSuccess,this);U[C]("query",this.onBeforeLoad,this);U[C]("load",this.onLoad,this);U[C]("loadfailed",this.onAjaxFailed,this);U[C]("valid",this.onValid,this);U[C]("beforeremove",this.onBeforeRemove,this);U[C]("remove",this.onRemove,this);U[C]("clear",this.onLoad,this);U[C]("refresh",this.onRefresh,this);U[C]("fieldchange",this.onFieldChange,this);U[C]("indexchange",this.onIndexChange,this);U[C]("select",this.onSelect,this);U[C]("unselect",this.onUnSelect,this);U[C]("selectall",this.onSelectAll,this);U[C]("unselectall",this.onUnSelectAll,this)}},bind:function(C){if(Ext.isString(C)){C=$(C);if(!C){return}}this.dataset=C;if(C.autopagesize===true){C.pagesize=Math.round(((this.ub.getHeight()||parseFloat(this.ub.dom.style.height))-16)/25)}this.processDataSetLiestener(aD);this.onLoad()},initTemplate:function(){this.rowTdTpl=new Ext.Template(["<td ",aI,'="{',aI,'}" class="',D,'" ',A,'="{',A,'}">']);this.rowNumTdTpl=new Ext.Template(['<td style="text-align:{align}" class="',aY,'" ',aI,'="',aY,'" ',A,'="{',A,'}">']);this.rowNumCellTpl=new Ext.Template(['<div style="',P,":{",P,'}px">{text}</div>']);this.tdTpl=new Ext.Template(['<td style="visibility:{visibility};text-align:{align}" ',N,'="{name}" ',aI,'="',q,'" ',A,'="{',A,'}">']);this.cellTpl=new Ext.Template(['<div class="',q,' {cellcls}" style="',P,":{",P,'}px" id="',this.id,'_{name}_{recordid}" title="{title}"><span>{text}</span></div>']);this.cbTpl=new Ext.Template(['<center><div class="{cellcls}" id="',this.id,"_{name}_{",A,'}"></div></center>'])},getCheckBoxStatus:function(C,a0,aZ){var a2=this.dataset.getField(a0),U=a2.getPropertity(ap),a1=C.data[a0];return G+(aZ?x:w)+((a1&&a1==U)?ar:ai)},createTemplateData:function(U,C){return{width:U.width-2,recordid:C.id,visibility:U.hidden===true?an:aj,name:U.name}},createCell:function(U,a3,a5){var a1=this.createTemplateData(U,a3),a9,a0=this.tdTpl,bb=w,aZ=U.type,a2,a4=this.getEditor(U,a3),a7=[];if(a4!=w){var a6=$A.CmpManager.get(a4);if(a6&&(a6 instanceof $A.CheckBox)){aZ=K}else{bb=h}}else{if(U.name&&Ext.isDefined(a3.getField(U.name).get(ap))){aZ=K;a2=true}}if(aZ==V||aZ==X){a2=this.dataset.execSelectFunction(a3)?w:x;a0=this.rowTdTpl;a1=Ext.apply(a1,{align:J,atype:aZ==V?t:z,cellcls:aZ==V?aS+G+a2+ai:"grid-radio "+T+a2+ai});a9=this.cbTpl}else{if(aZ==K){a1=Ext.apply(a1,{align:J,cellcls:aS+this.getCheckBoxStatus(a3,U.name,a2)});a9=this.cbTpl}else{var a8=a3.getMeta().getField(U.name);if(a8&&Ext.isEmpty(a3.data[U.name])&&a3.isNew==true&&a8.get(M)==true){bb=bb+r+ay}var C=(bb.indexOf(h)!=-1)?5:2,ba=this.renderText(a3,U,a3.data[U.name]);a1=Ext.apply(a1,{align:U.align||c,cellcls:bb,width:a1.width-C,text:ba,title:String(ba).replace(/<[^<>]*>/mg,w)});a9=this.cellTpl;if(aZ==al){a0=this.rowNumTdTpl;a9=this.rowNumCellTpl}}}if(a5){a7.push(a0.applyTemplate(a1))}a7.push(a9.applyTemplate(a1));if(a5){a7.push("</td>")}return a7.join(w)},createRow:function(a0,a3,a2,a1){var aZ=this.parseCss(this.renderRow(a1,a3)),a4=['<tr id="',this.id,a0,a1.id,'" class="',(a3%2==0?w:d),aZ.cls,'"','style="',aZ.style,'">'];for(var U=0,C=a2.length;U<C;U++){a4.push(this.createCell(a2[U],a1,true))}a4.push("</tr>");return a4.join(w)},parseCss:function(aZ){var a1=w,C=w;if(Ext.isArray(aZ)){for(var U=0;U<aZ.length;U++){var a0=this.parseCss(aZ[U]);a1+=";"+a0.style;C+=r+a0.cls}}else{if(Ext.isString(aZ)){var a2=!!aZ.match(/^([^,:;]+:[^:;]+;)*[^,:;]+:[^:;]+;*$/);C=a2?w:aZ;a1=a2?aZ:w}}return{style:a1,cls:C}},renderText:function(C,U,a1){var a0=U.renderer;if(a0){var aZ=$A.getRenderer(a0);if(aZ==null){alert(Y+a0+az);return a1}a1=aZ.call(window,a1,C,U.name);return a1==null?w:a1}return a1==null?w:a1},renderRow:function(C,a1){var a0=this.rowrenderer,U=null;if(a0){var aZ=$A.getRenderer(a0);if(aZ==null){alert(Y+a0+az);return U}U=aZ.call(window,C,a1);return !U?w:U}return U},createTH:function(aZ){var a1=['<tr class="grid-hl">'];for(var U=0,C=aZ.length;U<C;U++){var a0=aZ[U];a1.push("<th ",N,'="',a0.name,'" style="height:0px;width:',a0.hidden===true?0:a0.width,ah,'"></th>')}a1.push("</tr>");return a1.join(w)},onBeforeRemove:function(){$A.Masker.mask(this.wb,_lang["grid.mask.remove"])},onBeforeLoad:function(){this.ub.scrollTo(c,0);this.uh.scrollTo(c,0);$A.Masker.mask(this.wb,_lang["grid.mask.loading"])},onBeforSubmit:function(C){$A.Masker.mask(this.wb,_lang["grid.mask.submit"])},onAfterSuccess:function(){$A.Masker.unmask(this.wb)},preLoad:function(){},onLoad:function(){this.isSelectAll=false;this.clearDomRef();this.preLoad();var C=this.wrap.removeClass(ab).child(s);if(C&&this.selectable&&this.selectionmodel==ae){this.setCheckBoxStatus(C,false)}if(this.lb){this.renderLockArea()}this.renderUnLockAread();this.drawFootBar();$A.Masker.unmask(this.wb);this.fireEvent(u,this)},clearDomRef:function(){this.selectlockTr=null;this.selectUnlockTr=null},customize:function(){var a3=window.location.pathname;var a4=a3.indexOf("modules");var a0=a3.substring(a4,a3.length);var aZ=a0.substring(a0.lastIndexOf("/")+1,a0.length);var U=a3.substring(0,a4);var a2=this.wrap.parent("[url]");if(a2){var a1=a2.getAttributeNS("","url");if(a1){a1=a1.split("?")[0];if(a1.indexOf(U)==-1){var C=a1.lastIndexOf("/");if(C!=-1){a1=a1.substring(C+1,a1.length)}a0=a0.replaceAll(aZ,a1)}else{a0=a1.substring(a1.indexOf(U)+new String(U).length,a1.length)}}}new Aurora.Window({id:"sys_customization_grid",url:U+"modules/sys/sys_customization_grid.screen?source_file="+a0+"&id="+this.id+"&did="+this.dataset.id,title:"个性化设置",height:530,width:560})},onAjaxFailed:function(U,C){$A.Masker.unmask(this.wb)},onMouseWheel:function(U){U.stopEvent();if(this.editing==true){return}var aZ=U.getWheelDelta(),C=this.dataset;if(aZ>0){C.pre()}else{if(aZ<0){C.next()}}},focus:function(){this.fs.focus()},renderLockArea:function(){var C=this.lockColumns,U=['<TABLE cellSpacing="0" atype="grid.lbt" cellPadding="0" border="0"  ',P,'="',this.lockWidth,'"><TBODY>',this.createTH(C)];Ext.each(this.dataset.data,function(a0,aZ){U.push(this.createRow(aC,aZ,C,a0))},this);U.push('</TBODY></TABLE><DIV style="height:17px"></DIV>');this.lbt=this.lb.update(U.join(w)).child("table[atype=grid.lbt]")},renderUnLockAread:function(){var C=this.unlockColumns,U=['<TABLE cellSpacing="0" atype="grid.ubt" cellPadding="0" border="0" ',P,'="',this.unlockWidth,'"><TBODY>',this.createTH(C)];Ext.each(this.dataset.data,function(a0,aZ){U.push(this.createRow(aw,aZ,C,a0))},this);U.push("</TBODY></TABLE>");this.ubt=this.ub.update(U.join(w)).child("table[atype=grid.ubt]")},isOverSplitLine:function(C){var U=0,aZ=false;this.overColIndex=-1;Ext.each(this.columns,function(a1,a0){if(a1.hidden!==true){U+=a1.width}if(C<U+3&&C>U-3&&a1.resizable!=false){aZ=true;this.overColIndex=a0;return false}},this);return aZ},onRefresh:function(){this.onLoad(false);if(this.selectable){for(var U=0,a0=this.dataset,aZ=a0.selected,C=aZ.length;U<C;U++){this.onSelect(a0,aZ[U])}}},onIndexChange:function(aZ,U){var C=this.getDataIndex(U.id);if(C==-1){return}this.selectRow(C,false)},isFunctionCol:function(C){return C==V||C==X||C==al},onAdd:function(aZ,a3,bb){var a1=this.columns,a9=bb===aZ.data.length-1,a4=this.parseCss(this.renderRow(a3,bb)),ba=(bb%2==0?w:d+r)+a4.cls;if(this.lbt){var U=au.createElement(aR),a8=this.lbt.dom.tBodies[0];U.id=this.id+aC+a3.id;U.className=ba;Ext.fly(U).set({style:a4.style});Ext.each(a1,function(bc){if(bc.lock===true){var be=au.createElement(a);if(bc.type==V){Ext.fly(be).set({recordid:a3.id,atype:t});be.className=D;if(this.isSelectAll){be.className+=r+S}}else{if(bc.type==X){Ext.fly(be).set({recordid:a3.id,atype:z});be.className=D}else{if(bc.hidden){be.style.visibility=an}be.style.textAlign=bc.align||c;if(!this.isFunctionCol(bc.type)){be.dataindex=bc.name}var bd={recordid:a3.id,atype:q};if(bc.type==al){be.className=aY;bd.atype=aY}Ext.fly(be).set(bd)}}be.innerHTML=this.createCell(bc,a3,false);U.appendChild(be)}},this);if(a9){a8.appendChild(U)}else{var a5=Ext.fly(a8).query(L);for(var a2=bb,a0=a5.length;a2<a0;a2++){var a6=Ext.fly(a5[a2]).toggleClass(d);a6.select(".grid-rownumber div").each(function(bc){bc.update(Number(bc.dom.innerHTML)+1)});a6.select(aL).each(function(bc){this.setSelectStatus(aZ.findById(bc.getAttributeNS(w,A)))},this)}a8.insertBefore(U,a5[bb])}}var C=au.createElement(aR),a7=this.ubt.dom.tBodies[0];C.id=this.id+aw+a3.id;C.className=ba;Ext.fly(C).set({style:a4.style});Ext.each(a1,function(bc){if(bc.lock!==true){var bd=au.createElement(a);bd.style.visibility=bc.hidden===true?an:aj;bd.style.textAlign=bc.align||c;Ext.fly(bd).set({dataindex:bc.name,recordid:a3.id,atype:q});bd.innerHTML=this.createCell(bc,a3,false);C.appendChild(bd)}},this);if(a9){a7.appendChild(C)}else{var a5=Ext.fly(a7).query(L);for(var a2=bb,a0=a5.length;a2<a0;a2++){Ext.fly(a5[a2]).toggleClass(d)}a7.insertBefore(C,a5[bb])}this.setSelectStatus(a3)},renderEditor:function(a0,C,aZ,U){a0.parent(a).update(this.createCell(aZ,C,false))},onUpdate:function(a1,C,U,a0){this.setSelectStatus(C);var a3=Ext.get([this.id,U,C.id].join(ac));if(a3){var a2=this.findColByName(U),aZ=this.getEditor(a2,C);if(aZ!=w&&($(aZ) instanceof $A.CheckBox)){this.renderEditor(a3,C,a2,aZ)}else{a3.update(this.renderText(C,a2,a0))}}Ext.each(this.columns,function(a5){if(a5.name!=U){var a4=Ext.get([this.id,a5.name,C.id].join(ac));if(a4){if(a5.editorfunction){this.renderEditor(a4,C,a5,this.getEditor(a5,C))}if(a5.renderer){a4.update(this.renderText(C,a5,C.get(a5.name)))}}}},this);this.drawFootBar(U)},onValid:function(a0,C,U,aZ){var a2=this.findColByName(U);if(a2){var a1=Ext.get([this.id,U,C.id].join(ac));if(a1){if(aZ==false){a1.addClass(am)}else{a1.removeClass([ay,am])}}}},onRemove:function(a0,C,U){var aZ=Ext.get(this.id+aC+C.id),a1=Ext.get(this.id+aw+C.id);if(aZ){aZ.remove()}if(a1){a1.remove()}if(Ext.isIE||Ext.isIE9){this.syncScroll()}this.clearDomRef();$A.Masker.unmask(this.wb);this.drawFootBar()},onClear:function(){},onFieldChange:function(a0,C,a1,U,aZ){if(U==M){var a2=Ext.get([this.id,a1.name,C.id].join(ac));if(a2){a2[aZ==true?"addClass":"removeClass"](ay)}}},getDataIndex:function(aZ){for(var U=0,a0=this.dataset.data,C=a0.length;U<C;U++){if(a0[U].id==aZ){return U}}return -1},onSelect:function(aZ,U,a0){if(!U||a0){return}var C=Ext.get(this.id+k+U.id);C.parent(aL).addClass(S);if(C){if(this.selectionmodel==ae){this.setCheckBoxStatus(C,true)}else{this.setRadioStatus(C,true);aZ.locate((aZ.currentPage-1)*aZ.pagesize+aZ.indexOf(U)+1)}this.setSelectStatus(U)}},onUnSelect:function(aZ,U,a0){if(!U||a0){return}var C=Ext.get(this.id+k+U.id);C.parent(aL).addClass(S);if(C){if(this.selectionmodel==ae){this.setCheckBoxStatus(C,false)}else{this.setRadioStatus(C,false)}this.setSelectStatus(U)}},onSelectAll:function(){this.clearChecked();this.isSelectAll=true;this.isUnSelectAll=false;this.wrap.addClass(ab)},onUnSelectAll:function(){this.clearChecked();this.isSelectAll=false;this.isUnSelectAll=true;this.wrap.removeClass(ab)},clearChecked:function(){var C=this.wrap;C.select(aQ).replaceClass(aE,av);C.select(aT).removeClass(S)},onDblclick:function(a3,aZ){var a2=Ext.fly(aZ).parent("td[atype=grid-cell]");if(a2){var a1=this.dataset,a0=a2.getAttributeNS(w,A),C=a1.findById(a0),a4=a1.indexOf(C),U=a2.getAttributeNS(w,N);this.fireEvent(aV,this,C,a4,U)}},onClick:function(a2,a5){var a3=Ext.fly(a5).parent(a);if(a3){var aZ=a3.getAttributeNS(w,aI),a4=a3.getAttributeNS(w,A),U=this.dataset;if(aZ==q){var a1=U.findById(a4),a6=U.indexOf(a1),C=a3.getAttributeNS(w,N);this.fireEvent(H,this,a6,C,a1);this.fireEvent(aO,this,a6,a1)}else{if(aZ==aY){var a1=U.findById(a4),a6=U.indexOf(a1);if(a1.id!=this.selectedId){this.selectRow(a6)}}else{if(aZ==t){var a0=Ext.get(this.id+k+a4);if(a0.hasClass(I)||a0.hasClass(R)){return}if(this.isSelectAll&&!a0.parent(aT)){a0.replaceClass(av,aE)}else{if(this.isUnselectAll&&!a0.parent(aT)){a0.replaceClass(aE,av)}}a0.hasClass(aE)?U.unSelect(a4):U.select(a4)}else{if(aZ==z){var a0=Ext.get(this.id+k+a4);if(a0.hasClass(F)||a0.hasClass(O)){return}U.select(a4)}}}}}},onCellClick:function(aZ,a0,U,C,a1){this.adjustColumn(U);this.showEditor(a0,U,a1)},adjustColumn:function(a0){var aZ=this.findColByName(a0);if(!aZ||!aZ.autoadjust){return}var a2=this.wrap.select("tr.grid-hl "+aX+a0+B),U=Ext.fly(a2.elements[0]).getWidth(),C=U,a3=12,a1=this.width-(this.selectable?23:0)-20;this.wrap.select(aa+a0+"] span").each(function(a4){if(Ext.isIE||Ext.isIE9){a4.parent().setStyle(aP,"clip")}C=Math.max(a4.getWidth()+a3,C);if(Ext.isIE||Ext.isIE9){a4.parent().setStyle(aP,w)}if(C>a1){C=a1;return false}});if(C>U){this.setColumnSize(a0,C)}},setColumnPrompt:function(U,C){this.wrap.select("td.grid-hc"+aK+U+"] div").update(C)},setEditor:function(U,aZ){var C=this.findColByName(U),a0=Ext.get([this.id,U,this.selectedId].join(ac));C.editor=aZ;if(a0){if(aZ==w){a0.removeClass(h)}else{if(!$(aZ) instanceof $A.CheckBox){a0.addClass(h)}}}},getEditor:function(a0,U){var aZ=a0.editor||w;if(a0.editorfunction){var C=window[a0.editorfunction];if(C==null){alert(Y+a0.editorfunction+az);return null}aZ=C.call(window,U,a0.name)||w}return aZ},showEditor:function(a3,a0,a4){if(a3==-1){return}var aZ=this.findColByName(a0);if(!aZ){return}var a2=this.dataset,C=a2.getAt(a3);if(!C){return}if(C.id!=this.selectedId){this.selectRow(a3)}else{this.focusRow(a3)}this.focusColumn(a0);var a1=this.getEditor(aZ,C);this.setEditor(a0,a1);if(a1!=w){var U=$(a1);(function(){var a6=C.get(a0),a9=Ext.get([this.id,a0,C.id].join(ac)),a8=a9.getXY(),a5;U.bind(a2,a0);U.render(C);U.el.on(aJ,this.onEditorKeyDown,this);Ext.fly(aU).on(y,this.onEditorBlur,this);a5=this.currentEditor={record:C,ov:a6,name:a0,editor:U};if(U instanceof $A.CheckBox){U.move(-1000,a8[1]+5);if(a4){U.focus()}else{U.onClick()}a5.focusCheckBox=a9;a9.setStyle(g,aH)}else{var a7=a9.parent();U.move(a8[0],a8[1]);U.setHeight(a7.getHeight()-5);U.setWidth(a7.getWidth()-7);U.isEditor=true;U.isFireEvent=true;U.isHidden=false;U.focus();this.editing=true;U.on(ag,this.onEditorSelect,this);if(a4){a4.call(window,U)}this.fireEvent(ao,this,U,a3,a0,C)}}).defer(10,this)}},onEditorSelect:function(){(function(){this.hideEditor()}).defer(1,this)},onEditorKeyDown:function(a0){var aZ=a0.keyCode,U=this.currentEditor;if(aZ==27){if(U){var C=U.editor;if(C){C.clearInvalid();C.render(C.binder.ds.getCurrentRecord())}}this.hideEditor()}else{if(aZ==13){if(!(U&&U.editor&&U.editor instanceof $A.TextArea)){this.showNextEditor()}}else{if(aZ==9){a0.stopEvent();this.showNextEditor()}}}},showNextEditor:function(){this.hideEditor();var U=this.currentEditor;if(U){var a2=U.editor;if(a2){var a6=function(a9){if(a9 instanceof $A.Lov){a9.showLovWindow()}},a1=this.dataset,a0=a2.binder.name,C=a2.record,a8=a1.data.indexOf(C),aZ=null;if(a8!=-1){var a7=this.columns,a4=false,a3;Ext.each(a7,function(a9,ba){if(a4){if(a9.hidden!=true){a3=this.getEditor(a9,C);if(a3!=w){aZ=a9.name;return false}}}else{if(a9.name==a0){a4=true}}},this);if(aZ){this.fireEvent(H,this,a8,aZ,C,a6)}else{var a5=a1.getAt(a8+1);if(!a5&&this.autoappend!==false){a1.create();a5=a1.getAt(a8+1)}if(a5){this.selectRow(a8+1);Ext.each(a7,function(a9){if(this.getEditor(a9,a5)!=w){this.fireEvent(H,this,a8+1,a9.name,a5,a6);return false}},this)}}}this.fireEvent(Q,this,a8,aZ)}}},focusRow:function(a2){var a1=25,C=this.ub,aZ=C.getScroll().top,a0=C.getHeight(),U=C.dom.scrollWidth>C.dom.clientWidth?16:0;if(a2*a1<aZ){C.scrollTo(n,a2*a1-1)}else{if((a2+1)*a1>(aZ+a0-U)){C.scrollTo(n,(a2+1)*a1-a0+U)}}if(this.autofocus){this.focus()}},focusColumn:function(aZ){var C=25,U=this.ub,a7=this.columns,a1=U.getScroll().left;var a8=0,a5=0,a0=0,a4;for(var a3=0,a2=a7.length;a3<a2;a3++){var a6=a7[a3];if(a6.name==aZ){a5=a6.width}if(a6.hidden!==true){if(a6.lock===true){a0+=a6.width}else{if(a5==0){a8+=a6.width}}}}a4=a8+a5;if(a8<a1){U.scrollTo(c,a8)}else{if((a4-a1)>(this.width-a0)){U.scrollTo(c,a4-this.width+a0+(U.dom.scrollHeight>U.dom.clientHeight?16:0))}}if(this.autofocus){this.focus()}},hideEditor:function(){var U=this.currentEditor;if(U){var C=U.editor;if(C){if(!C.canHide||C.canHide()){var aZ=U.focusCheckBox;if(aZ){aZ.setStyle(g,af);U.focusCheckBox=null}C.el.un(aJ,this.onEditorKeyDown,this);C.un(ag,this.onEditorSelect,this);Ext.fly(aU).un(y,this.onEditorBlur,this);C.move(-10000,-10000);C.onBlur();C.isFireEvent=false;C.isHidden=true;this.editing=false}}}},onEditorBlur:function(U,C){if(this.currentEditor&&!this.currentEditor.editor.isEventFromComponent(C)){this.hideEditor.defer(Ext.isIE9?10:0,this)}},onLockHeadMove:function(C){this.hmx=C.xy[0]-this.lht.getXY()[0];this.lh.setStyle(aG,this.isOverSplitLine(this.hmx)?W:at)},onUnLockHeadMove:function(U){var C=this.uht;this.hmx=U.xy[0]-(C?C.getXY()[0]+C.getScroll().left:0)+this.lockWidth;this.uh.setStyle(aG,this.isOverSplitLine(this.hmx)?W:at)},onHeadMouseDown:function(C){this.dragWidth=-1;if(this.overColIndex==undefined||this.overColIndex==-1){return}this.dragIndex=this.overColIndex;this.dragStart=C.getXY()[0];this.sp.setHeight(this.wrap.getHeight()).show().setStyle({top:this.wrap.getXY()[1]+ah,left:C.xy[0]+ah});Ext.get(aU).on(aq,this.onHeadMouseMove,this).on(ad,this.onHeadMouseUp,this)},onHeadClick:function(a3,a8){var a4=Ext.fly(a8).parent(a),C=this.dataset,aZ;if(a4){aZ=a4.getAttributeNS(w,aI)}if(aZ==E){var a2=a4.getAttributeNS(w,N),U=this.findColByName(a2);if(U&&U.sortable===true){if(C.isModified()){$A.showInfoMessage("提示","有未保存数据!");return}var a5=a4.child(ak),a7=a2,a1=w;if(this.currentSortTarget){this.currentSortTarget.removeClass([ax,i])}this.currentSortTarget=a5;if(Ext.isEmpty(U.sorttype)){U.sorttype=aF;a5.removeClass(ax).addClass(i);a1=aF}else{if(U.sorttype==aF){U.sorttype=o;a5.removeClass(i).addClass(ax);a1=o}else{U.sorttype=w;a5.removeClass([i,ax])}}C.sort(a7,a1)}}else{if(aZ==t){var a0=a4.child(s);if(a0){var a6=a0.hasClass(aE);this.setCheckBoxStatus(a0,!a6);if(!a6){C.selectAll()}else{C.unSelectAll()}}}}},setRadioStatus:function(C,U){if(!U){C.removeClass(aM).addClass(aA)}else{C.addClass(aM).removeClass(aA)}},setCheckBoxStatus:function(C,U){if(!U){C.removeClass(aE).addClass(av)}else{C.addClass(aE).removeClass(av)}},setSelectDisable:function(aZ,U){var C=this.dataset.selected.indexOf(U)==-1;if(this.selectionmodel==ae){aZ.removeClass([aE,av]).addClass(C?I:R)}else{aZ.removeClass([aM,aA,O,F]).addClass(C?F:O)}},setSelectEnable:function(aZ,U){var C=this.dataset.selected.indexOf(U)==-1;if(this.selectionmodel==ae){aZ.removeClass([I,R]).addClass(C?av:aE)}else{aZ.removeClass([aA,aM,F,O]).addClass(C?aA:aM)}},setSelectStatus:function(U){var aZ=this.dataset;if(aZ.selectfunction){var C=Ext.get(this.id+k+U.id);if(!aZ.execSelectFunction(U)){this.setSelectDisable(C,U)}else{this.setSelectEnable(C,U)}}},onHeadMouseMove:function(aZ){aZ.stopEvent();this.dragEnd=aZ.getXY()[0];var U=this.dragEnd-this.dragStart,a0=this.columns[this.dragIndex],C=a0.width+U;if(C>30&&C<this.width){this.dragWidth=C;this.sp.setStyle(c,aZ.xy[0]+ah)}},onHeadMouseUp:function(C){Ext.get(aU).un(aq,this.onHeadMouseMove,this).un(ad,this.onHeadMouseUp,this);this.sp.hide();if(this.dragWidth!=-1){this.setColumnSize(this.columns[this.dragIndex].name,this.dragWidth)}this.syncScroll()},findColByName:function(U){if(U){var a0=this.columns;for(var aZ=0,C=a0.length;aZ<C;aZ++){var a1=a0[aZ];if(a1.name&&a1.name.toLowerCase()===U.toLowerCase()){return a1}}}return},selectRow:function(a1,U){var a0=this.dataset,C=a0.getAt(a1),aZ=(a0.currentPage-1)*a0.pagesize+a1+1;this.selectedId=C.id;if(this.selectlockTr){this.selectlockTr.removeClass(Z)}if(this.selectUnlockTr){this.selectUnlockTr.removeClass(Z)}this.selectUnlockTr=Ext.get(this.id+aw+C.id);if(this.selectUnlockTr){this.selectUnlockTr.addClass(Z)}this.selectlockTr=Ext.get(this.id+aC+C.id);if(this.selectlockTr){this.selectlockTr.addClass(Z)}this.focusRow(a1);this.selectRecord=C;if(U!==false&&aZ!=null){a0.locate.defer(5,a0,[aZ,false])}},setColumnSize:function(C,a5){var a1,a0,aZ=0,U=0;Ext.each(this.columns,function(a6){if(a6.name&&a6.name===C){if(a6.hidden===true){return}a6.width=a5;if(a6.lock!==true){a1=this.uh.child(aX+C+B);a0=this.ub.child(aX+C+B)}else{if(this.lh){a1=this.lh.child(aX+C+B)}if(this.lb){a0=this.lb.child(aX+C+B)}}}if(a6.hidden!==true){a6.lock!==true?(U+=a6.width):(aZ+=a6.width)}},this);this.wrap.select(aa+C+"] DIV.grid-cell").each(function(a6){a6.setStyle(P,Math.max(a5-(a6.hasClass(h)?7:4),0)+ah)},this);this.unlockWidth=U;this.lockWidth=aZ;if(a1){a1.setStyle(P,a5+ah)}if(a0){a0.setStyle(P,a5+ah)}var a4=Math.max(this.width-aZ,0);if(this.fb){this.fb.child(aX+C+B).setStyle(P,a5+ah);this.uf.setStyle(P,a4+ah);this.fb.child("table[atype=fb.ubt]").setStyle(P,U+ah);var a3=this.fb.child("table[atype=fb.lbt]");if(a3){this.fb.child("div[atype=grid.lf]").setStyle(P,(aZ-1)+ah);a3.setStyle(P,aZ+ah)}}if(this.lc){var a2=Math.max(aZ-1,0);this.lc.setStyle({width:a2+ah,display:a2==0?af:w})}if(this.lht){this.lht.setStyle(P,aZ+ah)}if(this.lbt){this.lbt.setStyle(P,aZ+ah)}this.uc.setStyle(P,a4+ah);this.uh.setStyle(P,a4+ah);this.ub.setStyle(P,a4+ah);this.uht.setStyle(P,U+ah);if(this.ubt){this.ubt.setStyle(P,U+ah)}this.syncSize()},drawFootBar:function(C){if(!this.fb){return}Ext.each([].concat(C?C:this.columns),function(a2){var a0=Ext.isString(a2)?this.findColByName(a2):a2;if(a0&&a0.footerrenderer){var a1=$A.getRenderer(a0.footerrenderer);if(a1==null){alert(Y+a0.footerrenderer+az);return}var aZ=a0.name,U=a1.call(window,this.dataset.data,aZ);if(!Ext.isEmpty(U)){this.fb.child(aa+aZ+B).update(U)}}},this)},syncSize:function(){var U=0;Ext.each(this.columns,function(aZ){if(aZ.hidden!==true){if(aZ.lock===true){U+=aZ.width}}});if(U!=0){var C=this.width-U;this.uc.setWidth(C);this.uh.setWidth(C);this.ub.setWidth(C)}},classfiyColumns:function(){this.lockColumns=[],this.unlockColumns=[];this.lockWidth=0,this.unlockWidth=0;Ext.each(this.columns,function(C){if(C.lock===true){this.lockColumns.add(C);if(C.hidden!==true){this.lockWidth+=C.width}}else{this.unlockColumns.add(C);if(C.hidden!==true){this.unlockWidth+=C.width}}},this);this.columns=this.lockColumns.concat(this.unlockColumns)},showColumn:function(U){var C=this.findColByName(U);if(C){if(C.hidden===true){delete C.hidden;this.setColumnSize(U,C.hiddenwidth||C.width);delete C.hiddenwidth;this.wrap.select(aa+U+B).show()}}},hideColumn:function(U){var C=this.findColByName(U);if(C){if(C.hidden!==true){C.hiddenwidth=C.width;this.setColumnSize(U,0,false);this.wrap.select(aa+U+B).hide();C.hidden=true}}},removeColumn:function(C){var a5=this.columns,a6=[],a3=[];Ext.each(C,function(a7){col=this.findColByName(a7);if(!col){return}if(col.lock){a6.push(a7)}else{a3.push(a7)}a5.splice(a5.indexOf(col),1)},this);var a2=a6.length,a1=a3.length;if(a2||a1){this.dataset.query();this.classfiyColumns();if(a2){var U=this.lockWidth<1?1:this.lockWidth,aZ=[];for(var a0=0;a0<a2;a0++){aZ.push(aK+a6[a0]+B)}this.lht.setWidth(this.lockWidth).select(aZ.join(",")).remove();this.lc.setWidth(U-1);this.uc.setWidth(this.wrap.getWidth()-U)}if(a1){var aZ=[];for(var a0=0;a0<a1;a0++){aZ.push(aK+a3[a0]+B)}this.uht.select(aZ.join(",")).remove()}var a4=this.unLockWidth;this.uht.setWidth(a4);this.uh.setWidth(a4);this.ub.setWidth(a4)}},createHead:Ext.isIE||Ext.isIE9?function(a3,a4,aZ,a2,U){var C=a2.query(aR),a0=Ext.fly(C[0]).child("th[width=20]"),a1;if(aZ){a1=a2.query(aK+aZ+B)[0]}if(a4==aN){a1=a1.nextSibling||null;U++}else{if(a4==e){if(a0){a1=a0.dom}U=-1}}Ext.each(a3,function(a9){var a6=Ext.get(au.createElement(aW)),a8=Ext.get(C[1].insertCell(U)),a5=a9.width,a7=a9.name;if(U>-1){U++}a8.addClass("grid-hc").set({dataindex:a7,atype:E}).update("<div>"+a9.prompt+"</div>");if(a1){C[0].insertBefore(a6.dom,a1)}else{C[0].appendChild(a6.dom)}a6.setStyle(P,a5+ah).set({dataindex:a7})})}:function(a3,a4,C,a1){var U=[],a0=[],aZ=a1.query(a4!=e?aK+C+B:aR);Ext.each(a3,function(a5){U.push('<th style="width:',a5.width,ah,';" ',N,'="',a5.name,'"></th>');a0.push('<td class="grid-hc" atype="grid.head" ',N,'="',a5.name,'"><div>',a5.prompt,"</div></td>")});new Ext.Template(U.join(w))[a4](aZ[0],{});new Ext.Template(a0.join(w))[a4](aZ[1],{});var a2=Ext.fly(aZ[0]).child("th[width=20]");if(a2){a2.appendTo(Ext.fly(aZ[0]))}},addColumn:function(bb,U,a2){if(this.dataset.isModified()){$A.showInfoMessage(_lang["grid.info"],_lang["grid.info.continue"])}else{var a7=this.columns,a3=a7.length,ba,a8;if(U&&a2){var a0=this.findColByName(U);if(a0){ba=a0.lock;a8=this[ba?"lockColumns":"unlockColumns"].indexOf(a0);a3=(a2==f?0:1)+a7.indexOf(a0)}else{alert("未找到列"+U);return}}var a9=[],a1=[];Ext.each(bb,function(be){var bd=Ext.apply(Ext.apply({},m),be),bc=this.findColByName(bd.name);if(bc){return}if(bd.lock){a9.push(bd)}else{a1.push(bd)}},this);var aZ=a9.concat(a1);if(aZ.length){var C=a2?(a2==f?aB:aN):e,a6=umethod=C,a4=uname=U,a5=this.wrap;if(ba){umethod=aB;uname=this.unlockColumns[0].name}else{a6=e;a4=null}this.columns=a7.slice(0,a3).concat(aZ).concat(a7.slice(a3));this.classfiyColumns();if(a9.length){if(!this.lht){this.lc=new Ext.Template("<DIV class='grid-la' atype='grid.lc' style='width:24px;'><DIV class='grid-lh' atype='grid.lh' unselectable='on' onselectstart='return false;' style='height:25px;'><TABLE cellSpacing='0' atype='grid.lht' cellPadding='0' border='0' style='width:25px'><TBODY><TR class='grid-hl'></TR><TR height=25></TR></TBODY></TABLE></DIV><DIV class='grid-lb' atype='grid.lb' style='width:100%;height:255px'></DIV></DIV>").insertAfter(this.fs.dom,{},true);this.lh=a5.child("div[atype=grid.lh]");this.lb=a5.child("div[atype=grid.lb]");this.lht=a5.child("table[atype=grid.lht]");this.lb[aD](p,this.onClick,this)[aD](aV,this.onDblclick,this);this.lht[aD](aq,this.onLockHeadMove,this);this.lh[aD](y,this.onHeadMouseDown,this)[aD](p,this.onHeadClick,this)}this.createHead(a9,a6,a4,this.lht,a8)}if(a1.length){this.createHead(a1,umethod,uname,this.uht,a8)}if(this.lb){this.lb.update(w)}this.ub.update(w);Ext.each(aZ,function(bc){this.setColumnSize(bc.name,bc.width)},this);this.dataset.query()}}},insertColumnBefore:function(U,C){this.addColumn(C,U,f)},insertColumnAfter:function(U,C){this.addColumn(C,U,1)},setWidth:function(aZ){if(this.width==aZ){return}this.width=aZ;this.wrap.setWidth(aZ);var U=$A.CmpManager.get(this.id+b);if(U){U.setWidth(aZ)}var C=$A.CmpManager.get(this.id+l);if(C){C.setWidth(aZ)}if(this.fb){this.fb.setWidth(aZ)}var a0=aZ-this.lockWidth;this.uc.setWidth(a0);this.uh.setWidth(a0);this.ub.setWidth(a0);if(this.uf){this.uf.setWidth(a0)}},setHeight:function(a0){if(this.height==a0){return}this.height=a0;var U=$A.CmpManager.get(this.id+b);if(U){a0-=25}var C=$A.CmpManager.get(this.id+l);if(C){a0-=25}if(this.fb){a0-=25}this.wrap.setHeight(a0);var aZ=a0-25;if(this.lb){this.lb.setHeight(aZ)}this.ub.setHeight(aZ)},deleteSelectRows:function(aZ){var U=this.dataset,C=[].concat(U.getSelected());if(C.length>0){U.remove(C)}aZ.close()},remove:function(){var C=this.dataset.getSelected();if(C.length>0){$A.showConfirm(_lang["grid.remove.confirm"],_lang["grid.remove.confirmMsg"],this.deleteSelectRows.createDelegate(this))}},clear:function(){var U=this.dataset,C=U.getSelected();while(C[0]){U.removeLocal(C[0])}},_export:function(){this.showExportConfirm()},showExportConfirm:function(){this.initColumnPrompt();var U=this,a1=0,a0=this.id+"_export",aZ=['<div class="item-export-wrap" style="margin:15px;width:270px" id="',a0,'">','<div class="grid-uh" atype="grid.uh" style="width: 270px; -moz-user-select: none; text-align: left; height: 25px; cursor: default;" onselectstart="return false;" unselectable="on">','<table cellSpacing="0" cellPadding="0" border="0"><tbody><tr height="25px">','<td class="export-hc" style="width:22px;" atype="export.rowcheck"><center><div atype="export.headcheck" class="',aS,av,'"></div></center></td>','<td class="export-hc" style="width:222px;" atype="grid-type">',_lang["grid.export.column"],"</td>","</tr></tbody></table></div>",'<div style="overflow:auto;height:200px;"><table cellSpacing="0" cellPadding="0" border="0"><tbody>'],C=true;Ext.each(this.columns,function(a3,a2){if(!this.isFunctionCol(a3.type)){if(C){C=a3.forexport!==false}aZ.push("<tr",(a1+a2)%2==0?w:' class="',d,'"','><td class="',D,'" style="width:22px;" ',A,'="',a2,'" atype="export.rowcheck"><center><div id="',this.id,k,a2,'" class="',aS,a3.forexport===false?av:aE,'"></div></center></td><td><div class="',q,'" style="width:220px">',a3.prompt,"</div></td></tr>")}else{a1++}},this);if(C){aZ[7]=aE}aZ.push("</tbody></table></div></div>");this.exportwindow=$A.showOkCancelWindow(_lang["grid.export.config"],aZ.join(w),function(a2){$A.showConfirm(_lang["grid.export.confirm"],_lang["grid.export.confirmMsg"],function(a3){U.doExport();a3.close();a2.body.un(p,U.onExportClick,U);a2.close()});return false},null,null,300);this.exportwindow.body.on(p,this.onExportClick,this)},initColumnPrompt:function(){if(!this.isPromptInit){Ext.each(this.columns,function(C){if(!this.isFunctionCol(C.type)){C.prompt=C.name?this.wrap.child("td.grid-hc"+aK+C.name+"] div").dom.innerHTML:(C.prompt||this.dataset.getField(C.name).pro.prompt)}},this);this.isPromptInit=true}},onExportClick:function(a0,a6){var a1=Ext.fly(a6).parent(a);if(a1){var C=a1.getAttributeNS(w,aI);if(C=="export.rowcheck"){var a4=a1.getAttributeNS(w,A),U=a1.child(ak),a3=U.hasClass(aE),aZ=U.getAttributeNS(w,aI),a2=this.columns;this.setCheckBoxStatus(U,!a3);if(aZ=="export.headcheck"){var a5=(this.isFunctionCol(a2[0].type)?1:0)+(this.isFunctionCol(a2[1].type)?1:0);this.exportwindow.body.select("td[atype=export.rowcheck] div[atype!=export.headcheck]").each(function(a7,a9,a8){this.setCheckBoxStatus(a7,!a3);a2[a8+a5].forexport=!a3},this)}else{a2[a4].forexport=!a3}}}},doExport:function(){this.initColumnPrompt();$A.doExport(this.dataset,this.columns)},destroy:function(){$A.Grid.superclass.destroy.call(this);this.processDataSetLiestener("un");this.sp.remove();delete this.sp}});$A.Grid.revision="$Rev$"})();