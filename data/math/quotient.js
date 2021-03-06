
/**
 * @name	CeL quotient function
 * @fileoverview
 * 本檔案包含了 quotient 的 functions。
 * @since	2010/3/11 16:59:59
 * @example
 * <code>
 * CeL.run('data.math');
 * //	TODO: bug
 * CeL.run('data.math.quotient');
 * var q1 = new CeL.quotient(2,3);
 * //	數字基底的轉換:
 * CeL.log(CeL.quotient.parse_base('4877.6'.toLowerCase(),10).to_base(16).replace(/_([^\(]+)/,'_<i style="text-decoration:overline">$1</i>'));
 * </code>
 */


/*
TODO:
use {String} value + {Number} exponent

http://www.leemon.com/crypto/BigInt.html
http://www-cs-students.stanford.edu/~tjw/jsbn/
http://java.sun.com/javase/6/docs/api/java/math/BigInteger.html

*/

'use strict';
if (typeof CeL === 'function')
CeL.run(
{
name:'data.math.quotient',
require : 'data.math.to_rational_number|data.math.GCD|data.math.factorization',
code : function(library_namespace) {

//	requiring
var to_rational_number = this.r('to_rational_number'), GCD = this.r('GCD'), factorization = this.r('factorization');


//library_namespace.debug(to_rational_number);
//library_namespace.debug(GCD);


//============================================================================
//	definition of module quotient

var
/*
整數部分
分數	fraction
真分數	proper fraction
vinculum  = "divide by"
*/
			/**
			 * 有理數 rational number，有理数全体のつくる集合はしばしば、商を意味する integer の頭文字をとり、太字の Q で表す。<br />
			 * 若要輸入不同基底的數值，請用 parse_base()
			 *
			 * @param	numerator	分子
			 * @param	[denominator]	分母
			 * @param {Boolean}[approximate]	取近似值
			 *
			 * @example
			 * <code>
			 * CeL.log((new CeL.integer(3,4)).count('*',new CeL.integer(2,7)).reduce().to_print_mode());
			 * </code>
			 *
			 * @class	integer 的 functions
			 * @constructor
			 */
_// JSDT:_module_
= function(numerator, denominator, approximate) {
	if (typeof numerator === 'object' && numerator instanceof _
			//&& numerator.Class === 'quotient'
			)
		return numerator;
	if (isNaN(numerator))
		numerator = 0;
	if (!denominator || isNaN(denominator))
		denominator = 1;
	else if (denominator < 0)
		denominator = -denominator, numerator = -numerator;

	// to_rational_number 需 test，並回傳(分子,分母,誤差)！
	var q = to_rational_number(numerator);
	//library_namespace.debug(numerator + ' → ' + q);
	if (!q)
		numerator = 0;
	else if (approximate || !q[2])
		// 無誤差時使用之
		numerator = q[0], denominator *= q[1] || 1;
	else
		while (numerator % 1 || denominator % 1)
			// 化為整數
			numerator *= 10, denominator *= 10;

	// value
	this.n = numerator, this.d = denominator;
	// this.type='quotient';
	//library_namespace.debug(this.n + ' / ' + this.d);
	return this;
};

//class public interface	---------------------------

_// JSDT:_module_
.
/**
 * 循環節分隔符號： {String} 整數.小數__repetend_separator__循環節
 * @_memberOf	_module_
 */
repetend_separator = '_';//' '

_// JSDT:_module_
.
/**
 * 數字集
 * @_memberOf	_module_
 * @see
 * <a href="http://en.wikipedia.org/wiki/Numerical_digit" accessdate="2010/4/16 20:47">Numerical digit</a>
 */
digit_char = '0123456789abcdefghijklmnopqrstuvwxyz';//.split('')


_// JSDT:_module_
.
/**
 * 轉換指定進位的數字成為 quotient 物件
 * @since	2004/7/9 16:13
 * @param number	數字
 * @param base	基底
 * @param	{String}[digit_chars]	循環小數 digit 字集。
 * @return	回傳 quotient 物件，請用 quotient.to_base() 傳回所欲之 base
 * @_memberOf	_module_
 * @example
 * var q=parse_base('10000.'+_.repetend_separator+'3',11);
 * if(!q)
 * 	alert('bad input!');
 * else
 * 	library_namespace.debug('<br />'+q.base(8)+','+q.base()+' , '+q.to_print_mode()+','+q.print(1)+','+q.to_print_mode(2)+','+q.to_print_mode(3,0,'',5));
 */
parse_base = function(number, base, digit_char) {
	// if(!num) num = 0;
	if ((!(base = Math.floor(base)) || base < 2) && digit_char)
		base = digit_char.length;

	if (!digit_char)
		digit_char = _.digit_char;
	if (isNaN(base) || base < 2 || digit_char.length < base)
		base = 10;
	if (!number || base === 10
			&& ('' + number).indexOf(_.repetend_separator) === -1)
		// 可能有循環小數，所以不能放過僅僅 base === 10
		return new _(number);

	var i = 0, n = new _(0, 1), m = 0, t = 0, p, c = {}, r = new _(0, 1);
	for (; i < digit_char.length; i++)
		c[digit_char.charAt(i)] = i; // 字集

	number += '', i = -1, n.d = r.d = 1;
	//library_namespace.debug('<br />'+i+','+num.length+','+t+','+num+','+n.to_print_mode());
	if (number.charAt(0) === '-')
		i = 0, m = 1;
	while (++i < number.length && (p = number.charAt(i)) != '.')
		// 整數
		if (isNaN(p = c[p]) || p >= base)
			// error!
			return;
		else
			t = t * base + p;
	//library_namespace.debug('<br />'+i+','+num.length+','+t+','+num+','+n.to_print_mode());
	while (++i < number.length
			&& (p = number.charAt(i)) != _.repetend_separator)
		// 小數
		if (isNaN(p = c[p]) || p >= base)
			// error!
			return;
		else
			n.n = n.n * base + p, n.d *= base;
	while (++i < number.length)
		// 循環節
		if (isNaN(p = c[number.charAt(i)]) || p >= base)
			return; // error!
		else
			r.n = r.n * base + p, r.d *= base;
	//library_namespace.debug('<br />**'+n.to_print_mode());
	//	善後
	n = n.count('+=', t);
	if (r.n)
		r.d = (r.d - 1) * n.d, n.count('+=', r);
	n.reduce();
	//library_namespace.debug('<br />*'+n.to_print_mode());
	if (m)
		n.n = -n.n;
	return n;
};



_// JSDT:_module_
.prototype = {

//	instance public interface	-------------------


/**
 * 最簡分數/化簡, 約分 reduction
 * @return	化簡後的
 * @_name	_module_.prototype.reduce
 */
reduce : function() {
	var g = GCD(this.n, this.d);
	if (g && g > 1)
		this.n /= g, this.d /= g;
	return this;
},

/**
 * 四則運算/算數運算 + - * / (+-×÷), **, ^, [=]
 * @param op	operator
 * @param q2	the second quotient
 * @return	計算後的結果
 * @see
 * <a href="http://www.javaworld.com.tw/jute/post/view?bid=35&amp;id=30169&amp;tpg=1&amp;ppg=1&amp;sty=1&amp;age=0#30169" accessdate="2010/4/16 20:47">JavaWorld@TW Java論壇 - post.view</a>
 * @_name	_module_.prototype.count
 */
count : function(op, q2) {
	var q;
	if (op.slice(-1) === '=')
		q = this, op = op.slice(0, -1);
	else
		q = new _(this);

	q2 = new _(q2);
	//library_namespace.debug('<br />'+this.type+','+q.to_print_mode()+' , '+q2.to_print_mode());
	if (op === '-')
		q2.n = -q2.n, op = '+';
	else if (op === '/') {
		var t = q2.n;
		q2.n = q2.d, q2.d = t, op = '*';
	}
	//library_namespace.debug('<br />'+q.to_print_mode(1)+','+q2.to_print_mode(1));
	if (op === '+')
		q.n = q.n * q2.d + q.d * q2.n, q.d *= q2.d;
	else if (op === '*')
		q.n *= q2.n, q.d *= q2.d;
	// N! 是指 N的階乘 (Factorial,power)
	else if ((op === '**' || op === '^') && q2.reduce().d === 1) {
		q.reduce(), q.n = Math.pow(q.n, q2.n), q.d = Math.pow(q.d, q2.n);
		return q;
	} else {
		library_namespace.error('illegal operator [' + op + ']!');
		return this;
	}
	//library_namespace.debug('<br />'+q.to_print_mode(1)+','+q2.to_print_mode(1));
	//	other: error
	//library_namespace.debug('<br />_'+q.reduce().to_print_mode());
	try {
		return q.reduce();
	} catch (e) {
	}
	return q;
},

/**
 * 依指定基底轉成循環小數 circulating decimal / repeating decimal。
 * 特殊情況可以考慮使用 .toString()，會快很多。
 * TODO: 小數
 * @since	2004/7/9 13:28
 * @param base	基底
 * @param digit_char	循環小數 digit 字集
 * @return	(decimal/數字部分string,repunitIndex/循環節Repetend出現在)
 * @see
 * <a href="http://mathworld.wolfram.com/RepeatingDecimal.html" accessdate="2010/4/16 20:47">Repeating Decimal -- from Wolfram MathWorld</a>
 * <a href="http://hk.geocities.com/goodprimes/OFrp.htm">循環小數與素數。素之異類。</a>
 * @_name	_module_.prototype.to_base
 */
to_base : function(base, digit_char) {
	//if (!isNaN(digit_char)) digit_char += '';
	if (typeof digit_char !== 'string' || digit_char.length < 2)
		// 字集
		digit_char = _.digit_char;

	// 基底預設為 10 進位
	if (!(base = Math.floor(base)) || base == 10 ||
			// illegal base
			base < 2 || base > digit_char.length)
		return this.to_decimal();

	this.reduce();

	var d = this.d, o = this.n, i, t, m = 0,
	// find base 的因數(factor)
	f = factorization(base);
	if (o < 0)
		// 負數
		o = -o, m = 1;

	// find 分母的因數(factor)與基底 base 之交集(不能用GCD)
	for (var i = 0, g = 1, t = d; i < f.length; i += 2)
		while (t % f[i] === 0)
			g *= f[i], t /= f[i];

	// get 整數 integer 部分 → out
	f = o % d;
	i = (o - f) / d;
	o = '';
	while (i)
		t = i % base, i = (i - t) / base, o = digit_char.charAt(t) + o;
	if (!o)
		o = '0', m = 0;
	//library_namespace.debug('<br />_' + typeof o + ',' + (o || '(null)') + ',' + o);
	if (!f)
		return m ? '-' + o : o;

	// 進入小數
	o += '.';

	// set 餘數f/分母d, 餘數residue mark r=f, 循環節 Repetend location of out:l, 已解決的因數 s
	var r = f, l = o.length, s = 1;

	// do main loop
	// while(o.length-l<d){ // 限制?位: debug用
	while (true) {
		//library_namespace.debug('<br />.'+r+','+f+'/'+d+'('+base+'),'+s+':'+g+','+o);
		if (!f) {
			// 可以整除，無循環。
			l = 0;
			break;
		}
		f *= base;
		if (s === g) {
			// 分母與 base 已互質
			t = f, f %= d, o += digit_char.charAt((t - f) / d);
			if (f === r)
				// bingo! 餘數重複出現，循環節結束。
				break;
		} else {
			// f 與 d 已互質
			t = GCD(base, d), s *= t, f /= t, d /= t,
			//	do the same thing
			t = f, f %= d, o += digit_char.charAt((t - f) / d),
			//	r 需重設..此處有否可能出問題? maybe not?
			r = f, l = o.length;
		}
	}

	//	善後
	if (l)
		o += '(' + (o.length - l) + ')', o = o.slice(0, l)
		+ _.repetend_separator + o.substr(l);
	if (m)
		o = '-' + o;
	return o;
},

/**
 * 為十進位最佳化的 to_base()<br />
 * 以結論來說，好像快不了多少?
 * @since 2004/7/9 13:47
 * @return
 * @_name	_module_.prototype.to_decimal
 */
to_decimal : function() {
	this.reduce();
	var d = this.d, t = d, g = 1, m = 0, f, o = this.n;
	if (o < 0)
		o = -o, m = 1; // 負數

	// find 分母的 2,5 因數
	while (t % 2 === 0)
		//	使用下面這行會造成 bug: 輸出 .110011001100110011001100110011001100(2) 會導致 g===t===0, 掛掉
		//	以結論來說，好像快不了多少?
		//g <<= 1, t >>= 1;
		g *= 2, t /= 2;
		while (t % 5 === 0)
			g *= 5, t /= 5;

		// get 整數 integer 部分 → out
		f = o % d, o = (o - f) / d;
		//library_namespace.debug('<br />_'+typeof o+','+(o||'(null)')+','+o);
		if (!f)
			// 留下+-
			return (m ? '-' : '') + o;

	// 進入小數
	o += '.';

	// set 餘數f/分母d, 餘數 residue mark r=f, 循環節 Repetend location of out:l, 已解決的因數 s
	var r = f, l = o.length, s = 1;

	// do main loop
	// while(o.length-l<d){// 限制?位:debug用
	while (true) {
		//library_namespace.debug('<br />.'+r+','+f+'/'+d+','+s+':'+g+','+o);
		if (!f) {
			// 可以整除，無循環。
			l = 0;
			break;
		}
		f *= 10;
		if (s === g) {
			// 分母與 base 已互質
			t = f, f %= d, o += (t - f) / d;
			if (f === r)
				// bingo! 循環節結束
				break;
		} else {
			t = d % 5 === 0 ? d % 2 === 0 ? 10 : 5 : 2, s *= t, f /= t, d /= t,
			// do the same thing
			t = f, f %= d, o += (t - f) / d,
			// r 需重設..此處有否可能出問題? maybe not?
			r = f, l = o.length;
		}
	}

	//	善後
	if (l)
		o += '(' + (o.length - l) + ')',
		o = o.slice(0, l) + _.repetend_separator + o.substr(l);
	if (m)
		o = '-' + o;
	return o;
},


/*
有效位數、小數位數	http://technet.microsoft.com/zh-tw/library/ms190476.aspx
Precision, Scale
有效位數是數字的位數。小數位數是數字中在小數點右側的位數。例如，123.45 這個數字的有效位數是 5，小數位數是 2。
Precision is the number of digits in a number. Scale is the number of digits to the right of the decimal point in a number. For example, the number 123.45 has a precision of 5 and a scale of 2.
*/

/**
 * 顯示成各種不同模式的數字
 * @since	2004/7/9 14:23
 * @param mode	顯示模式
 * 0	真分數 proper fraction、假分數 improper fraction (U.S., British or Australian) or top-heavy fraction (British, occasionally North America),
 * 1	帶分數 mixed numeral (often called a mixed number, also called a mixed fraction),
 * 2	直接除(10進位),
 * 3	轉成循環小數 repeating decimal,除至小數點下digit位數（非四捨五入！）.
 * @param base	基底
 * @param sum_char	顯示帶分數時代表整數與真分數之間的分隔。多為' '或'+'或''。
 * @param digit	轉成循環小數時，代表循環小數 digit 字集
 * @return	{String}	顯示模式數字
 * @_name	_module_.prototype.to_print_mode
 */
to_print_mode : function(mode, base, sum_char, digit) {
	if (mode < 3 || !mode) {
		if (mode === 2)
			return this.n / this.d;
		var p, f;
		if (!mode || this.n < this.d)
			p = this.n + '/' + this.d;
		else
			f = this.n % this.d,
			p = (this.n - f) / this.d
					+ (f ? (sum_char || '+') + f + '/' + this.d : '');
		return p;
	}

	if (mode === 3) {
		var n = this.to_base(base, sum_char);
		if (isNaN(digit))
			return n;
		var f = n.indexOf(_.repetend_separator), b = n.indexOf('.');
		if (f === -1 || !digit)
			return b === -1 ? n :
				digit ? n.slice(0, b + digit + 1) : n.slice(0, b);
		digit += b + 1,
		//	循環節
		b = n.substr(f + 1),
		n = n.slice(0, f);
		while (n.length < digit)
			n += b;
		return n.slice(0, digit);
	}
},

/**
 * 測試大小/比大小
 * @param q2	the second quotient
 * @return	{Number}	0:==, <0:<, >0:>
 * @_name	_module_.prototype.compare_to
 */
compare_to : function(q2) {
	q2 = new _(q2);
	return this.n * q2.d - this.d * q2.n;
}

};

//	setup toString function
_.prototype.toString = _.prototype.to_print_mode;



return (
	_// JSDT:_module_
);
}


});

