
/**
 * @name	CeL function for compatibility
 * @fileoverview
 * 本檔案包含了相容性 test 專用的 functions。
 * @since	
 * @see
 * <a href="http://msdn.microsoft.com/en-us/library/s4esdbwz%28v=VS.85%29.aspx" accessdate="2010/4/16 20:4">Version Information (Windows Scripting - JScript)</a>
 */

/*
http://www.comsharp.com/GetKnowledge/zh-CN/It_News_K875.aspx
8進制數字表示被禁止， 010 代表 10 而不是 8
引入 JSON
Array 對象內置了一些標準函數，如 indexOf(), map(), filter(), reduce()
# Object.keys() 會列出對象中所有可以枚舉的屬性
# Object.getOwnPropertyNames() 會列出對象中所有可枚舉以及不可枚舉的屬性
# Object.getPrototypeof() 返回給定對象的原型
*/

if (typeof CeL === 'function'){

/**
 * 本 module 之 name(id)，<span style="text-decoration:line-through;">不設定時會從呼叫時之 path 取得</span>。
 * @type	String
 * @constant
 * @inner
 * @ignore
 */
var module_name = 'code.compatibility';

//===================================================
/**
 * 若欲 include 整個 module 時，需囊括之 code。
 * @type	Function
 * @param	{Function} library_namespace	namespace of library
 * @param	load_arguments	呼叫時之 argument(s)
 * @return
 * @_name	_module_
 * @constant
 * @inner
 * @ignore
 */
var code_for_including = function(library_namespace, load_arguments) {

//	**	no requires


/**
 * null module constructor
 * @class	相容性 test 專用的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};






/*	對於舊版沒有Array.push()等函數時之判別及處置,舊版adapter
	從(typeof object.reverse=='function')可偵測object是否為Array
	http://www.coolcode.cn/?p=126
*/
//oldVadapter[generateCode.dLK]='*oldVadapter();';
function oldVadapter(){
 //var _Global=typeof window=='object'?window:this;
 // Global undefined variable
/*
 if(typeof _Global=='undefined')window.undefined=_Global;
 else _Global.undefined=_Global.undefined;
*/

 if(!Array.prototype.push&&typeof Apush=='function')Array.prototype.push=Apush;
 if(!Array.prototype.pop&&typeof Apop=='function')Array.prototype.pop=Apop;
 if(!Array.prototype.shift&&typeof Ashift=='function')Array.prototype.shift=Ashift;
 if(!Array.prototype.unshift&&typeof Aunshift=='function')Array.prototype.unshift=Aunshift;
 //	apply & call: after ECMAScript 3rd Edition	不直接用undefined: for JS5
 if(typeof Function.prototype.apply=='undefined'&&typeof Fapply=='function')Function.prototype.apply=Fapply;
 if(typeof Function.prototype.call=='undefined'&&typeof Fcall=='function')Function.prototype.call=Fcall;
 //if(typeof isNaN!='function'&&typeof NisNaN=='function')isNaN=NisNaN;
 if(typeof encodeURI!='function'&&typeof escape=='function')encodeURI=escape;
 if(typeof decodeURI!='function'&&typeof unescape=='function')decodeURI=unescape;
 if(typeof encodeURIComponent!='function'&&typeof encodeURI=='function')encodeURIComponent=encodeURI;
 if(typeof decodeURIComponent!='function'&&typeof decodeURI=='function')decodeURIComponent=decodeURI;
}

function Apush(o){this[this.length]=o;return this;}
//	將 element_toPush 加入 array_pushTo 並篩選重複的（本來已經加入的並不會變更）
//	array_reverse[value of element_toPush]=index of element_toPush
function pushUnique(array_pushTo,element_toPush,array_reverse){
 if(!array_pushTo||!element_toPush)return array_pushTo;
 var i;
 if(!array_reverse)
  for(array_reverse=new Array,i=0;i<array_pushTo;i++)
   array_reverse[array_pushTo[i]]=i;

 if(typeof element_toPush!='object')
  i=element_toPush,element_toPush=new Array,element_toPush.push(i);

 var l;
 for(i in element_toPush)
  if(!array_reverse[element_toPush])
   //array_pushTo.push(element_toPush),array_reverse[element_toPush]=array_pushTo.length;
   array_reverse[array_pushTo[l = array_pushTo.length] = element_toPush[i]] = l;

 return array_pushTo;
}

//	e.g., Array.prototype.concat does not change the existing arrays, it only returns a copy of the joined arrays.
function Aappend(a) {
	var t = this, s = t.length, i = 0, l = a && a.length || 0;
	for (; i < l; i++)
		t[s + i] = a[i];
	return t;
}

function Apop(){
 if(!this.length)return;
 var t=this.slice(-1);this.length--;return t;//不能用return this[--this.length];
}
function Ashift(){
 //var t=this[0],s=this.join('\0');s=s.substr(s.indexOf('\0')+1);this.length=0;this.push(s.split('\0'));return t;
 var t=this[0];
 this.value=this.slice(1);	//	ECMAScript 不允許設定 this=
 return t;
}
function Aunshift(o){
 if(!this.length)return;
 //var t=this.join('\0');this.length=0;this.push(o);this.push(t.split('\0'));return this;
 return this.value=[o].concat(this);	//	ECMAScript 不允許設定 this=
}	//	不能用t=this.valueOf(); .. this.push(t);
//	奇怪的是，這個版本(5.1版)尚不提供isNaN。(should be isNaN, NOT isNAN)
//	變數可以與其本身比較。如果比較結果不相等，則它會是 NaN。原因是 NaN 是唯一與其本身不相等的值。
//function NisNaN(v){var a=typeof v=='number'?v:parseInt(v);return /*typeof v=='number'&&*/a!=a;}//parseFloat(v)	alert(typeof a+','+a+','+(a===a));
//oldVadapter();

/*	http://www.cnblogs.com/sunwangji/archive/2007/06/26/791428.html	http://www.cnblogs.com/sunwangji/archive/2006/08/21/482341.html
	http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
	http://www.interq.or.jp/student/exeal/dss/ejs/3/1.html
	http://blog.mvpcn.net/fason/
	http://d.hatena.ne.jp/m-hiyama/20051017/1129510043
	http://noir.s7.xrea.com/archives/000203.html

http://msdn.microsoft.com/en-us/library/4zc42wh1(VS.85).aspx
傳回某物件的方法，以另一個物件取代目前的物件。
apply是將現在正在執行的function其this改成apply的引數。所有函數內部的this指針都會被賦值為oThis，這可實現將函數作為另外一個對象的方法運行的目的
xxx.apply(oThis,arrayArgs): 執行xxx，執行時以oThis作為 this，arrayArgs作為 arguments

http://www.tohoho-web.com/js/object.htm#inheritClass
クラスを継承する	親のクラスが持っている機能をすべて使用することができます。

to make classChild inheritance classParent:	http://www.interq.or.jp/student/exeal/dss/ejs/3/2.html
function classChild(_args1,_args2,..){
 處理arguments：arguments.pop() or other way

 classParent.call(this,_args1,_args2,..);	//	way1
 classParent.apply(this,arguments);	//	way2
 //this.constructor=classChild;	//	maybe needless

 // ..
}
classChild.prototype=new classParent;	//	for (objChild instanceof objParent)	關鍵字: 繼承，原型
classChild.prototype.methodOfParent=function(..){..};	//	オーバーライド

var objChild=new classChild(_args);
classParent.prototype.methodOfParent.call(objChild, ..);	//	基底プロトタイプのメソッドを呼び出す。ただしこの呼び出し自体は Programmer が Person を継承しているかどうかを何も考慮していません。


因 arguments 非instanceof Array，arguments.join(sp) → Array.prototype.join.call(arguments,sp)
*/
/**
 * @ignore
 */
if(0)
function Fapply(/* object */ oThis /* = null */, /* Array */ arrayArgs /* = null */) {
 if(oThis == null || oThis == undefined)	//	グローバルオブジェクトに適用
  return arrayArgs == null || arrayArgs == undefined? this(): this(arrayArgs);
 if(!(oThis instanceof Object))
  return undefined;	//	実際は throw TypeError();

 oThis.$_funcTmp000 = this;

 var oReturn;
 if(arrayArgs == null || arrayArgs == undefined)
  oReturn = oThis.$_funcTmp000();
 else if(arrayArgs instanceof Array){
  var i=0,args=[];
  for(;i<arrayArgs.length;i++)
   args[i]='arrayArgs['+i+']';//args.push('arrayArgs['+i+']');
  oReturn = eval("oThis.$_funcTmp000("+args.join(",")+");");	//	因為arrayArgs[i]之type不固定，故不能直接用arrayArgs.join(",")
 }//else{delete oThis.$_funcTmp000;throw TypeError();}

 delete oThis.$_funcTmp000;
 return oReturn;
}
/*	http://msdn.microsoft.com/library/CHT/jscript7/html/jsmthcall.asp
call 方法是用來呼叫代表另一個物件的方法。call 方法可讓您將函式的物件內容從原始內容變成由 thisObj 所指定的新物件。
如果未提供 thisObj 的話，將使用 global 物件作為 thisObj。
*/
/**
 * @ignore
 */
if(0)
function Fcall(/* object */ oThis /* = null [, arg1[, arg2[, ... [, argN]]]]] */){
 var argu=[];//Array.prototype.slice.call(arguments);
 for(var i=1;i<arguments.length;i++)
  argu[i-1]=arguments[i];	//	argu.push(arguments[i]);
 return this.apply(oThis, argu);
}




_// JSDT:_module_
.
/**
 * Are we in a web environment?
 * @param W3CDOM	Are we in a W3C DOM environment?
 * @return	We're in a web environment.
 * @since	2009/12/29 19:18:53
 * @see
 * use lazy evaluation
 * @_memberOf	_module_
 */
is_web = function is_web(W3CDOM) {
	var _s = is_web;
	if (!('web' in _s))
		_s.W3CDOM =
				(
				_s.web = typeof window === 'object'
						&& typeof document === 'object'
						&& window.document === document
						// 下兩個在 IE5.5 中都是 Object
						//&& library_namespace.is_type(window, 'global')
						//&& library_namespace.is_type(document, 'HTMLDocument')
				)
				// W3CDOM, type: Object @ IE5.5
				&& document.createElement
				// &&!!document.createElement
				//	type: Object @ IE5.5
				&& document.getElementsByTagName;

	return W3CDOM ? _s.W3CDOM : _s.web;
};


_// JSDT:_module_
.
/**
 * 判斷為 DOM。
 * @param	name	various name @ name-space window. e.g., document, location
 * @return	{Boolean}	various is object of window
 * @since	2010/1/14 22:04:37
 */
is_DOM = function(name) {
	var r = _.is_web();
	if (!r || !name)
		return r;

	// CeL.debug(CeL.is_type(window[name]));
	try {
		eval('r=' + name);
		r = r === window[name];
	} catch (e) {
		r = false;
	}
	return r;
};


//is_HTA[generateCode.dLK]='is_web';
_// JSDT:_module_
.
/**
 * Are we run in HTA?<br/>
 * ** HTA 中應該在 onload 中呼叫，否則 document.getElementsByTagName 不會有東西！
 * @param [id]	HTA tag id (only used in low version that we have no document.getElementsByTagName)
 * @return	We're in HTA
 * @require	is_web
 * @since	2009/12/29 19:18:53
 * @_memberOf	_module_
 * @see
 * http://msdn2.microsoft.com/en-us/library/ms536479.aspx
 * http://www.microsoft.com/technet/scriptcenter/resources/qanda/apr05/hey0420.mspx
 * http://www.msfn.org/board/lofiversion/index.php/t61847.html
 * lazy evaluation
 * http://peter.michaux.ca/articles/lazy-function-definition-pattern
 */
is_HTA = function is_HTA(id) {
	var _s = is_HTA, a;
	if ('HTA' in _s)
		return _s.HTA;

	if (is_web(1)) {
		a = document.getElementsByTagName('APPLICATION');
		a = a && a.length === 1 && a[0];
	} else
		a = is_web() && id && document.all && document.all[id];

	return _s.HTA = a;
};



//	版本檢查
function checkVer(ver) {
	if (!ver || ver < 5)
		ver = 5; // WScript.FullName,WScript.Path
	with (WScript)
	if (Version < ver)
		with (WshShell) {
		var promptTitle = Locale == 0x411 ? 'アップグレードしませんか？'
				: '請升級', promptC = Locale == 0x411 ? "今使ってる "
						+ WScript.Name
						+ " のバージョンは古過ぎるから、\nMicrosoft Windows スクリプト テクノロジ Web サイトより\nバージョン "
						+ Version + " から " + ver + " 以上にアップグレードしましょう。"
						: "正使用的 "
							+ WScript.Name
							+ " 版本過舊，\n請至 Microsoft Windows 網站將版本由 "
							+ Version + " 升級到 " + ver + " 以上。", url = /* Locale==0x411? */"http://www.microsoft.com/japan/developer/scripting/default.htm";
		if (1 == Popup(promptC, 0, promptTitle, 1 + 48))
			Run(url);
		Quit(1);
	}
}







/*	2008/12/21 18:53:42
value to json
JavaScript Object Notation	ECMA-262 3rd Edition

http://stackoverflow.com/questions/1500745/how-to-pass-parameters-in-eval-in-an-object-form
json={name:'~',values:..,description:'~'}
window[json.name].apply(null, json.values)


usage:
json(value)

parse:
data=eval('('+data+')');	//	字串的前後記得要加上刮號 ()，這是用來告知 Javascript Interpreter 這是個物件描述，不是要執行的 statement。
eval('data='+data);

TODO:

useObj
加入function object成員，.prototype可用with()。加入函數相依性(dependency)

array用name:
(function(){
var o;
o=[..];
var i,v={..};
for(i in v)o[i]=v[i];
return o; 
})()


recursion 循環參照
(function(){
var o;
o={a:[]};
o['b']=[o['a']],
o['a'].push([o['b']]);
return o; 
})()



BUG:
function 之名稱被清除掉了，這可能會產生問題！
(function(){
var f=function(){..};
f.a=..;
f.b=..;
f.prototype={
a:..,
b:..
}
return f; 
})()


*/
//json[generateCode.dLK]='qNum,dQuote';



/*
var a=[],b;a.push(b=[a]);json(a);

test recursion 循環參照
(function(){
var o=[],_1=[o];
o.push(_1);
return o; 
})();

*/

/*
改用 window.JSON, jQuery.parseJSON
據說toJSONString跟parseJSON有可能成為ECMAScript第四版的標準

須判別來源是否為 String or Number!


九个PHP很有用的功能 | 酷壳 - CoolShell.cn
http://coolshell.cn/?p=2394
你是否會把一個比較複雜的數據結構存到數據庫或是文件中？你並不需要自己去寫自己的算法。PHP早已為你做好了，其提供了兩個函數：?serialize()  和 unserialize()
JSON越來越流行，所以在PHP5.2以後，PHP開始支持JSON，你可以使用 json_encode() 和 json_decode() 函數。但是對於一些非常複雜的數據結構，可能會造成數據丟失。


json.dL='dependencyList';	//	dependency List Key
json.forceArray=1;

json.indentString='	';
json.NewLine='\n';
json.separator=' ';
function json(val,name,type){	//	type==2: inside object, treat undefined as ''
var _f=json,expA=[],expC=[],vType=typeof val
,addE=function(o,l,n){
	if(l){
	 o=_f(o,0,2);
	 n=typeof n=='undefined'||n===''?''
		:(/^(\d{1,8})?(\.\d{1,8})?$/.test(n)||/^[a-z_][a-z_\d]{0,30}$/i.test(n)?n:dQuote(n))+':'+_f.separator;
	 expA.push(n,o[1]);

	 //expC.push(_f.indentString+n+o[0].join(_f.NewLine+_f.indentString)+',');
	 o=o[0];
	 o[0]=n+(typeof o[0]=='undefined'?'':o[0]);
	 o[o.length-1]+=',';
	 for(var i=0;i<o.length;i++)
	  o[i]=_f.indentString+(typeof o[i]=='undefined'?'':o[i]);
	 expC=expC.concat(o);
	}else expA.push(o),expC.push(o);
}
//	去掉最後一組的 ',' 並作結
,closeB=function(c){
	var v=expC[expC.length-1];
	if(v.charAt(v.length-1)==',')
	 expC[expC.length-1]=v.slice(0,v.length-1);
	addE(c);
};

switch(vType){
case 'number':
//	http://msdn2.microsoft.com/zh-tw/library/y382995a(VS.80).aspx
//	isFinite(value) ? String(value)
var k=0,m='MAX_VALUE,MIN_VALUE,NEGATIVE_INFINITY,POSITIVE_INFINITY,NaN'.split(','),t=0;
if(val===NaN||val===Infinity||val===-Infinity)t=''+val;
else for(;k<m.length;k++)
 if(val===Number[m[k]]){t='Number.'+m[k];break;}
if(!t){
 //	http://msdn2.microsoft.com/zh-tw/library/shydc6ax(VS.80).aspx
 for(k=0,m='E,LN10,LN2,LOG10E,LOG2E,PI,SQRT1_2,SQRT2'.split(',');k<m.length;k++)
  if(val===Math[m[k]]){t='Math.'+m[k];break;}
 if(!t)
  if(k=(''+val).match(/^(-?\d*[1-9])(0{3,})$/))
   t=k[1]+'e'+k[2].length;
  else{

   //	有理數判別
   k=qNum(val);

   //	小數不以分數顯示. m==1:非分數
   m=k[1];
   while(m%2==0)m/=2;
   while(m%5==0)m/=5;

   t=k[2]==0 && m!=1?k[0]+'/'+k[1]:
	//	TODO: 加速(?)
	(t=Math.floor(val))==val&&(''+t).length>(t='0x'+val.toString(16)).length?t:val;
  }

}
addE(t);
break;
case 'null':
addE(''+val);
break;
case 'boolean':
addE(val);
break;
case 'string':
addE(dQuote(val));
break;
case 'undefined':
addE(type==2?'':'undefined');
break;

case 'function':
//	加入function object成員，.prototype可用with()。加入函數相依性(dependency)
var toS,f;
//	這在多執行緒有機會出問題！
if(typeof val.toString!='undefined'){toS=val.toString;delete val.toString;}
f=''+val;
if(typeof toS!='undefined')val.toString=toS;

f=f.replace(/\r?\n/g,_f.NewLine);	//	function 才會產生 \r\n 問題，所以先處理掉
var r=/^function\s+([^(\s]+)/,m=f.match(r),t;
if(m)m=m[1],addE('//	function ['+m+']'),t=f.replace(r,'function'+_f.separator);
if(m&&t.indexOf(m)!=-1)alert('function ['+m+'] 之名稱被清除掉了，這可能會產生問題！');
addE(t||f);
//	UNDO
break;

case 'object':
try{
if(val===null){addE(''+val);break;}
var c=val.constructor;
if(c==RegExp){
 addE(val);
 break;
}
if(c==Date || vType=='date'){	//	typeof val.getTime=='function'
 //	與 now 相隔過短(<1e7, 約3h)視為 now。但若是 new Date()+3 之類的會出現誤差！
 addE('new Date'+((val-new Date)>1e7?'('+val.getTime()+')':''));	//	date被當作object
 break;
}
if((''+c).indexOf('Error')!=-1){
 addE('new Error'+(val.number||val.description?'('+(val.number||'')+(val.description?(val.number?',':'')+dQuote(val.description):'')+')':''));
 break;
}

var useObj=0;
if(c==Array){
 var i,l=0;
 if(!_f.forceArray)for(i in val)
  if(isNaN(i)){useObj=1;break;}else l++;

 if(_f.forceArray || !useObj && l>val.length*.8){
  addE('[');
  for(i=0;i<val.length;i++)
   addE(val[i],1);
  closeB(']');
  break;
 }else useObj=1;
}

if(useObj||c==Object){// instanceof
 addE('{');
 for(var i in val)
  addE(val[i],1,i);
 closeB('}');
 break;
}
addE(dQuote(val));
break;
}catch(e){
if(28==(e.number&0xFFFF))
 alert('json: Too much recursion?\n循環參照？');
return;
}

case 'unknown':	//	sometimes we have this kind of type
default:
alert('Unknown type: ['+vType+'] (constructor: '+val.constructor+'), please contract me!\n'+val);
break;
//alert(vType);
}
return type?[expC,expA]:expC.join(_f.NewLine);
}

*/








return (
	_// JSDT:_module_
);
};

//===================================================

CeL.setup_module(module_name, code_for_including);

};
