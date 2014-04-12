
/**
 * @name	CeL function for calendars.
 * @fileoverview
 * 本檔案包含了曆法轉換的功能。
 * @since
 * 2014/4/12 15:37:56
 */

'use strict';
if (typeof CeL === 'function')
CeL.run(
{
name : 'data.date.calendar',
require : 'data.code.compatibility.|data.native.set_bind|data.date.String_to_Date',

code : function(library_namespace) {

//	requiring
var set_bind, String_to_Date;
eval(this.use());


/**
 * null module constructor
 * @class	calendars 的 functions
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



// copy from data.date.
// 一整天的 time 值。should be 24 * 60 * 60 * 1000 = 86400000.
var ONE_DAY_LENGTH_VALUE = new Date(0, 0, 2) - new Date(0, 0, 1);


//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 長曆: 伊斯蘭曆

//Tabular Islamic calendar / Hijri calendar / التقويم الهجري المجدول /
//http://en.wikipedia.org/wiki/Tabular_Islamic_calendar
//伊斯蘭曆(回回曆)
//陳垣編的《中西回史日曆》(中華書局1962年修訂重印)。
//陈氏中西回史日历冬至订误，鲁实先


/*

CeL.run('data.date');

//正解
CeL.assert(["-1/12/29",'622/7/15'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);
CeL.assert(["1/1/1",'622/7/16'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);
CeL.assert(["1/1/2",'622/7/17'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);

CeL.assert(["1/1/30",'622/8/14'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);
CeL.assert(["1/2/1",'622/8/15'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);

CeL.assert(["1/12/29",'623/7/4'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);
CeL.assert(["2/1/1",'623/7/5'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);

CeL.assert(["30/12/29",'651/8/23'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);
CeL.assert(["31/1/1",'651/8/24'.to_Date('CE').to_Tabular().slice(0,3).join('/')]);

//反解
CeL.assert(["-1,12,29",CeL.Tabular_to_Date(-1,12,29).to_Tabular().slice(0,3).join(',')]);
CeL.assert(["1,1,1",CeL.Tabular_to_Date(1,1,1).to_Tabular().slice(0,3).join(',')]);
CeL.assert(["1,1,2",CeL.Tabular_to_Date(1,1,2).to_Tabular().slice(0,3).join(',')]);

CeL.assert(["1,1,30",CeL.Tabular_to_Date(1,1,30).to_Tabular().slice(0,3).join(',')]);
CeL.assert(["1,2,1",CeL.Tabular_to_Date(1,2,1).to_Tabular().slice(0,3).join(',')]);

CeL.assert(["1,12,29",CeL.Tabular_to_Date(1,12,29).to_Tabular().slice(0,3).join(',')]);
CeL.assert(["2,1,1",CeL.Tabular_to_Date(2,1,1).to_Tabular().slice(0,3).join(',')]);

CeL.assert(["30,12,29",CeL.Tabular_to_Date(30,12,29).to_Tabular().slice(0,3).join(',')]);
CeL.assert(["31,1,1",CeL.Tabular_to_Date(31,1,1).to_Tabular().slice(0,3).join(',')]);

*/


var Tabular_cycle_years = 30, Tabular_half_cycle = 15,
//平年日數。6=(12 / 2)
//每年有12個月。奇數個月有30天，偶數個月有29天，除第12/最後一個月在閏年有30天。
Tabular_common_year_days = (30 + 29) * 6,
//每一30年周期內設11閏年。
Tabular_leaps_in_cycle = 11,
//
Tabular_cycle_days = Tabular_common_year_days * Tabular_cycle_years + Tabular_leaps_in_cycle,
// 622/7/15 18:
// 伊斯蘭曆每日以日落時分日。例如 AH 1/1/1 可與公元 622/7/16 互換，但 AH 1/1/1 事實上是從 622/7/15 的日落時算起，一直到 622/7/16 的日落前為止。
// '622/7/16'.to_Date('CE').format(): '622/7/19' === new Date(622, 6, 19)
Tabular_start_offset = String_to_Date('622/7/16', {
	parser : 'CE'
}).getTime(),
//Tabular_leap_count[shift + Tabular_cycle_years]=new Array(30:[各年於30年周期內已累積 leap days])
Tabular_leap_count = [],
// 各月累積日數。[0, 30, 30+29, 30+29+30, ..]
Tabular_month_days = [ 0 ];

(function () {
	for(var month = 0, count = 0; month < 12;)
		Tabular_month_days.push(count += (month++ %2 === 0 ? 30 : 29));
	//assert: Tabular_common_year_days === Tabular_month_days.pop();
})();

function list_leap() {
	for ( var s = -Tabular_cycle_years; s <= Tabular_cycle_years; s++) {
		for ( var year = 1, shift = s, leap = []; year <= Tabular_cycle_years; year++)
			if ((shift += Tabular_leaps_in_cycle) > Tabular_half_cycle)
				shift -= Tabular_cycle_years, leap.push(year);
		library_namespace.log(s + ': ' + leap);
	}
}

//0: 2,5,7,10,13,16,18,21,24,26,29
//-3: 2,5,8,10,13,16,19,21,24,27,29
//1: 2,5,7,10,13,15,18,21,24,26,29
//-5: 2,5,8,11,13,16,19,21,24,27,30

//shift: 小餘, -30 ~ 30.
function get_Tabular_leap_count(shift, year_serial) {
	if (0 < (shift |= 0))
		shift %= Tabular_cycle_years;
	else
		shift = 0;
	// + Tabular_cycle_years: 預防有負數。
	if (!((shift + Tabular_cycle_years) in Tabular_leap_count))
		// 計算各年於30年周期內已累積 leap days。
		for ( var year = 0, count = 0,
		// new Array(Tabular_cycle_years)
		leap_days_count = Tabular_leap_count[shift +  Tabular_cycle_years] = [ 0 ];
		//
		year < Tabular_cycle_years; year++) {
			if ((shift += Tabular_leaps_in_cycle) > Tabular_half_cycle)
				shift -= Tabular_cycle_years, count++;
			leap_days_count.push(count);
		}

	return Tabular_leap_count[shift +  Tabular_cycle_years][year_serial];
}

function Tabular_to_Date(year, month, date, shift) {
	return new Date(Tabular_start_offset +
	// 計算距離 Tabular_start_offset 日數。
	(Math.floor((year = year < 0 ? year | 0 : year > 0 ? year - 1 : 0) / Tabular_cycle_years) * Tabular_cycle_days
	// 添上閏年數。
	+ get_Tabular_leap_count(shift,
	// 確認 year >=0。
	(year %= Tabular_cycle_years) < 0 ? (year += Tabular_cycle_years) : year )
	// 添上年之日數。
	+ year * Tabular_common_year_days
	// 添上月之日數。
	+ Tabular_month_days[(month || 1) - 1]
	// 添上日數。
	+ (date || 1) - 1 ) * ONE_DAY_LENGTH_VALUE);
}

//[ year, month, date, 餘下時間值(單位:日) ]
function Date_to_Tabular(date, shift) {
	var month,
	// 距離 Tabular_start_offset 的日數。
	tmp = (date - Tabular_start_offset) / ONE_DAY_LENGTH_VALUE,
	//
	delta = tmp - (date = Math.floor(tmp)),
	// 距離 Tabular_start_offset 的30年周期之年數。
	year = Math.floor(date / Tabular_cycle_days) * Tabular_cycle_years;

	// 本30年周期內之日數。
	date %= Tabular_cycle_days;
	// 保證 date >=0。
	if (date < 0)
		date += Tabular_cycle_days;

	// 本30年周期內之年數: 0~30。
	// 30: 第29年年底。
	tmp = (date / Tabular_common_year_days) | 0;
	year += tmp;
	date %= Tabular_common_year_days;

	// 求出為本年第幾天之序數。
	// 減去累積到第 tmp 年首日，應該有幾個閏日。
	date -= get_Tabular_leap_count(shift, tmp);
	if (date < 0)
		// 退位
		year--, date += Tabular_common_year_days;

	// 至此確定年序數與求出本年第幾天之序數。

	// 這邊的計算法為 Tabular Islamic calendar 特殊設計過，並不普適。
	// 理據: 每月日數 >=29 && 末月累積日數 - 29*月數 < 29 (不會 overflow)

	// tmp 可能是本月，或是下月累積日數。
	tmp = Tabular_month_days[ month = (date / 29) | 0 ];
	if (date < tmp)
		// tmp 是下月累積日數。
		tmp = Tabular_month_days[ --month ];
	// 本月日數。
	date -= tmp;

	// 序數→日期名
	return [ year + (year < 0 ? 0 : 1), month + 1, date + 1, delta ];
}


_.Tabular_to_Date = Tabular_to_Date;

//----------------------------------------------------------------------------------------------------------------------------------------------------------//
// 長曆: 西雙版納傣曆計算
// 適用範圍: 傣曆 0~103295 年

/*

完全按张公瑾:《西双版纳傣文〈历法星卜要略〉历法部分译注》、《傣历中的纪元纪时法》計算公式推算，加上過去暦書多有出入，因此與實暦恐有一兩天差距。
《中国天文学史文集 第三集》


http://blog.sina.com.cn/s/blog_4131e58f0101fikx.html
傣曆和農曆一樣，用干支紀年和紀日。傣曆干支約於東漢時由漢地傳入，使用年代早於紀元紀時的方法。不過傣族十二地支所代表的對象和漢族不完全相同，如「子」不以表鼠而代表大象，「辰」不代表龍，而代表蛟或大蛇。


[张公瑾,陈久金] 傣历中的干支及其与汉历的关系 (傣曆中的干支及其與漢曆的關係, 《中央民族学院学报》1977年第04期)
值得注意的是, 傣历中称干支日为“腕乃” 或‘婉傣” , 意思是“ 里面的日子” 或“傣族的日子” , 而一周一匕日的周日, 明显地是从外面传进来的, 则称为“腕诺” 或,’m 命” , 即“外面的日子· 或“ 你的日子’, , 两者你我相对, 内外有8lJ, 是很清楚的。很明显, 傣历甲的干支纪年与纪日是从汉历中吸收过来的, 而且已经成了傣历中不可分害少的组成部分。在傣文的两本最基本的推算历法书‘苏定》和《苏力牙》中, 干支纪年与纪日的名称冠全书之首, 可见汉历成份在傣历中的重要性。


《中央民族學院學報》 1979年03期
傣曆中的紀元紀時法
張公瑾
傣曆中的紀元紀時法,與公曆的紀時法相近似,即以某一個時間為傣曆紀元開始累計的時間,以後就順此按年月日往下記,至今年(1979年)10月1日(農曆己未年八月十一)為傣曆1341年12月月出11日,這是一種情況。
還有一種情況是:公元1979年10月1日又是傣曆紀元的第1341年、傣曆紀元的第16592月,並是傣曆紀元的第489982日。對這種年月日的累計數,現譯稱為傣曆紀元年數、紀元積月數和紀元積日數。

*/


/*
year:
傣曆紀元年數。

應可處理元旦，空日，除夕，閏月，後六月，後七月等。

Dai_Date(紀元積日數)
Dai_Date(紀元年數, 特殊日期)
	特殊日期: 元旦/除夕/空1/空2
Dai_Date(紀元年數, 0, 當年日序數)
Dai_Date(紀元年數, 月, 日)
	月: 1~12/閏/後6/後7

元旦：
	Dai_Date(year, 0)
	Dai_Date(year, '元旦')
當年日序 n：
	Dai_Date(year, 0, n)
空日：
	Dai_Date(year, '空1日')
	Dai_Date(year, '空2日')
	Dai_Date(year, 0, -1)
	Dai_Date(year, 0, -2)
除夕：
	Dai_Date(year, '除夕')
閏月：
	Dai_Date(year, '閏9', date)
	Dai_Date(year, '雙9', date)
	Dai_Date(year, '閏', date)

後六月：
	Dai_Date(year, '後6', date)

後七月：
	Dai_Date(year, '後7', date)


注意：由於傣曆元旦不固定在某月某日，因此同一年可能出現相同月分與日期的日子。例如傣曆1376年（公元2014年）就有兩個六月下五日。

為了維持獨一性，此處以後六月稱第二次出現的六月同日。

*/
function Dai_Date(year, month, date) {
	if (isNaN(year = Dai_Date.to_valid_year(year)))
		return new Date(NaN);

	var days = typeof date === 'string' && (date = date.trim()).match(/^([^\d]*)(\d+)/), is_leap;
	// 處理如「六月下一日」或「六月月下一日」即傣曆6月16日。
	if (days) {
		date = days[2] | 0;
		if (/月?上/.test(days[1]))
			date += 15;
	} else
		date |= 0;

	if (typeof month === 'string')
		if (/^[閏雙][9九]?月?$/.test(month))
			month = 9, is_leap = true;
		else if (days = month.match(/^後([67])/))
			month = days[1];

	if (isNaN(month) || month < 1 || 12 < month) {
		// 確定元旦之前的空日數目。
		days = Dai_Date.null_days(year - 1);
		switch (month) {
		case '空2日':
			// 若有空2日，其必為元旦前一日。
			date--;
		case '空日':
		case '空1日':
			date -= days;
		case '除夕':
			date -= days + 1;
		}

		// 當作當年日序。
		days = Dai_Date.new_year_days(year) + date | 0;

	} else {
		// 將 (month) 轉成月序：
		// 6月 → 0
		// 7月 → 1
		// 12月 → 6
		// 1月 → 7
		if ((month -= 6) < 0
		// 後6月, 後7月
		|| days)
			month += 12;

		if (month < 2 && 0 < date
		// 處理應為年末之6月, 7月的情況。
		&& (month === 0 ? date : 29 + date) <
		//
		Dai_Date.new_year_date_serial(year))
			month += 12;

		days = Dai_Date.days_6_1(year) + date - 1
		//
		+ (month >> 1) * (29 + 30) | 0;
		if (month % 2 === 1)
			days += 29;

		if ((month > 3 || month === 3 && is_leap)
		// 處理閏月。
		&& Dai_Date.is_leap(year))
			days += 30;
		if (month > 2 && Dai_Date.is_full8(year))
			days++;
	}

	return new Date(Dai_Date.epoch + days * ONE_DAY_LENGTH_VALUE);
}

// 適用範圍: 傣曆 0~103295 年
Dai_Date.to_valid_year = function (year) {
	return !isNaN(year) && 0 <= year && year < 103296 && year == (year | 0) && (year | 0) || NaN;
};

// 閏9月, 閏九月。
Dai_Date.is_leap = function(year) {
	// 傣曆零年當年九月置閏月。
	return year == 0 ||
	// 攝 = (year + 1) % 19;
	((year + 1) % 19) in {
		0 : 1,
		2 : 1,
		5 : 1,
		8 : 1,
		10 : 1,
		13 : 1,
		16 : 1
	};
};


// 當年日數。365 or 366.
Dai_Date.year_days = function(year) {
	return Dai_Date.new_year_days(year + 1) - Dai_Date.new_year_days(year);
};

// 當年空日數目。1 or 2.
// 注意：這邊之年分，指的是當年除夕後，即明年（隔年）元旦之前的空日數目。
// e.g., Dai_Date.null_days(100) 指的是傣曆100年除夕後，即傣曆101年元旦之前的空日數目。
// 依 Dai_Date.date_of_days() 的做法，空日本身會被算在前一年內。
Dai_Date.null_days = function(year) {
	// 傣曆潑水節末日之元旦（新年的第一天）與隔年元旦間，一般為365日（有「宛腦」一天）或366日（有「宛腦」兩天）。
	return Dai_Date.year_days(year) - 364;
};

/*

傣历算法剖析

原法@曆法星卜要略, 傣曆中的紀元紀時法：
x := year + 1
y := Floor[(year + 4)/9]
z := Floor[(year - y)/3]
r := Floor[(x - z)/2]
R := year - r + 49049
S := Floor[(36525875 year + R)/100000]
d := S + 1
Simplify[d]

1 + Floor[(
  49049 + 36525876 year - 
   Floor[1/2 (1 + year - Floor[1/3 (year - Floor[(4 + year)/9])])])/
  100000]


簡化法：
x := year + 1
y := ((year + 4)/9)
z := ((year - y)/3)
r := ((x - z)/2)
R := year - r + 49049
S := ((36525875 year + R)/100000)
d := S + 1
Simplify[d]

(1609723 + 394479457 year)/1080000


// test 簡化法 @ Javascript:
for (var year = -1000000, days; year <= 1000000; year++) {
	if (CeL.Dai_Date.new_year_days(year) !== CeL.Dai_Date
			.new_year_days_original(year))
		console.error('new_year_days: ' + year);
	var days = CeL.Dai_Date.new_year_days(year);
	if (CeL.Dai_Date.year_of_days(days) !== year
			|| CeL.Dai_Date.year_of_days(days - 1) !== year - 1)
		console.error('year_of_days: ' + year);
}


// get:
-976704
-803518
-630332
-523297
-350111
-176925
-69890
103296
276482
449668
556703
729889
903075

*/

// 元旦紀元積日數, accumulated days
// 原法@曆法星卜要略：
Dai_Date.new_year_days_original = function(year) {
	return 1 + Math
			.floor((49049 + 36525876 * year - Math.floor((1 + year - Math
					.floor((year - Math.floor((4 + year) / 9)) / 3)) / 2)) / 100000);
};

// 元旦紀元積日數, accumulated days
// 簡化法：適用於 -69889 ~ 103295
Dai_Date.new_year_days = function(year, get_remainder) {
	// 防止 overflow。但效果相同。
	// var v = 365 * year + 1 + (279457 * year + 529723) / 1080000,
	var v = (394479457 * year + 1609723) / 1080000 | 0,
	//
	f = Math.floor(v);
	// 餘數
	return get_remainder ? v - f : f;
};

// 簡化法：適用於 -3738 ~ 1000000
Dai_Date.year_of_days = function(days) {
	return Math.floor((1080000 * (days + 1) - 1609723) / 394479457) | 0;
};


// 紀元積月數, accumulated month


/*

原法@傣曆中的紀元紀時法：
day = 元旦紀元積日數

b := 11 day + 633
c := Floor[(day + 7368)/8878]
d := Floor[(b - c)/692]
dd := day + d
e := Floor[dd/30]
f := Mod[dd, 30]
Simplify[e]
Simplify[f]

e:
Floor[1/30 (day + 
    Floor[1/692 (633 + 11 day - Floor[(7368 + day)/8878])])]

f:
Mod[day + Floor[1/692 (633 + 11 day - Floor[(7368 + day)/8878])], 30]

*/

// 元旦之當月日序基數
// d = 30~35: 7/(d-29)
// others: 6/d
Dai_Date.new_year_date_serial = function(year, is_days) {
	var days = is_days ? year : Dai_Date.new_year_days(year) | 0;
	days +=
	// 小月補足日數
	Math.floor((633 + 11 * days - Math.floor((7368 + days) / 8878)) / 692) | 0;
	// (days / 30 | 0) 是元旦所在月的紀元積月數
	days = days % 30 | 0;

	// 高立士. 傣歷與潑水節的推算. 當餘數在 8~29 之間時，潑水節必定在六月，若餘數在 0~7，潑水節必定在七月初。若在 7 月，餘數就須加 1，才是新年的具體日子。
	// 七月. 7/date0 → 6/30, 7/date1 → 6/31..
	return days < 8 ? days + 30 : days;
};

// 6/1 紀元積日數, accumulated days
// 簡化法：適用於 -69889 ~ 103295
Dai_Date.days_6_1 = function(year, get_remainder) {
	var days = Dai_Date.new_year_days(year) | 0,
	//
	date = Dai_Date.new_year_date_serial(days, true) | 0;

	return days - date + 1 | 0;
};

// 八月滿月
Dai_Date.is_full8 = function(year) {
	var days_diff = Dai_Date.days_6_1(year + 1) - Dai_Date.days_6_1(year) - 354
			| 0;
	// assert: 0: 無閏月, 30: 閏9月.
	if (days_diff === 30)
		days_diff -= 30;
	// assert: days_diff == 0 || 1
	return days_diff;
};

/*

CeL.Dai_Date(0).format({
	parser : 'CE',
	format : '%Y/%m/%d %年干支年%日干支日',
	locale : 'cmn-Hant-TW'
});

for (var y = 1233, i = 0, m; i < 12; i++) {
	m = i + 6 > 12 ? i - 6 : i + 6;
	console.log(y + '/' + m + '/' + 1 + ': '
			+ CeL.Dai_Date(y, m, 1).format({
				parser : 'CE',
				format : '%年干支年%日干支日',
				locale : 'cmn-Hant-TW'
			}));
}

*/

Dai_Date.date_name = function (date) {
	return date > 15 ? '下' + (date - 15) : date < 15 ? '出' + date : 15;
};

//return 紀元積日數之 [ year, month, date ];
Dai_Date.date_of_days = function(days) {
	var date, year = Dai_Date.to_valid_year(Dai_Date.year_of_days(days)) | 0;
	if (isNaN(year))
		return [];

	// 取得自 6/1 起之日數(當年日序數)
	date = days - Dai_Date.days_6_1(year);
	if (date >= (29 + 30 + 29)) {
		if (Dai_Date.is_full8(year)) {
			if (date === (29 + 30 + 29))
				return [ year, 8, Dai_Date.date_name(30) ];
			date--;
		}
		if (date >= 2 * (29 + 30) && Dai_Date.is_leap(year)) {
			if (date < 2 * (29 + 30) + 30)
				return [ year, '閏9', Dai_Date.date_name(date - 2 * (29 + 30) + 1) ];
			date -= 30;
		}
	}

	// month starts @ 6.
	var month = 6 + ((date / (29 + 30) | 0) << 1) | 0;
	if ((date %= 29 + 30) >= 29)
		month++, date -= 29;
	date++;
	if (month > 12) {
		month -= 12;
		if (month >= 6 && ((month > 6 ? date + 29 : date)
		// 在 date < 今年元旦日序的情況下，由於仍具有獨一性，因此不加上'後'。
		>= Dai_Date.new_year_date_serial(year)))
			// 會將空日視為前面的一年。
			month = '後' + month;
	}

	return [ year, month, Dai_Date.date_name(date) ];
};

// 傣曆紀元起算日期
Dai_Date.epoch = String_to_Date('638/3/22', {
	parser : 'Julian'
}).getTime()
//
- Dai_Date.new_year_days(0) * ONE_DAY_LENGTH_VALUE;


_.Dai_Date = Dai_Date;

/*

// test: 經過正反轉換運算，應該回到相同的日子。
function get_serial(month) {
	if (isNaN(month)) {
		var matched = month.match(/^[^\d](\d{1,2})$/);
		if (!matched)
			throw 'Illegal month name: ' + month;
		month = matched[1] | 0;
	}
	return month;
}
var date = CeL.Dai_Date.epoch, ONE_DAY = new Date(0, 0, 2) - new Date(0, 0, 1), TO_DAY = 20000
		* 366 * ONE_DAY + date, date_name, old_date_name, error = [], tmp;
for (date -= 20 * 366 * ONE_DAY; date < TO_DAY && error.length < 400; date += ONE_DAY) {
	date_name = (new Date(date)).to_Dai();
	if (old_date_name &&
	//
	(old_date_name[1] !== date_name[1] || date_name[2] - old_date_name[2] !== 1)) {
		if (false)
			console.log((date - CeL.Dai_Date.epoch) / ONE_DAY + ': '
					+ date_name.join());
		// 確定 old_date_name 的下一個天為 date_name。
		if ((old_date_name[1] !== 12 || date_name[1] !== 1)
		//
		&& (tmp = get_serial(date_name[1]) - get_serial(old_date_name[1]))
		//
		&& tmp !== 1 || date_name[2] - old_date_name[2] !== 1)
			error.push((new Date(date)).format({parser:'CE',format:'%Y/%m/%d'}) + ' 月份未連續: ' + (new Date(date - ONE_DAY)).to_Dai().join('/') + ' → ' + date_name.join('/'));
		old_date_name = date_name;
	}
	if (date - CeL.Dai_Date(date_name[0], date_name[1], date_name[2]) !== 0)
		error.push(date + ' (' + (date - CeL.Dai_Date.epoch) / ONE_DAY + '): '
				+ date_name.join('/'));
}
console.error(error.join('\n'));


-42657868800000 (-7304): -20/6/20
-42626332800000 (-6939): -19/6/1
-42594796800000 (-6574): -18/6/12
-42563174400000 (-6208): -17/6/24
-42531638400000 (-5843): -16/6/5
-42500102400000 (-5478): -15/6/15
-42468566400000 (-5113): -14/6/26
-42436944000000 (-4747): -13/6/8
-42405408000000 (-4382): -12/6/19
-42342336000000 (-3652): -10/6/10
-42310713600000 (-3286): -9/6/22
-42279177600000 (-2921): -8/6/3
-42247641600000 (-2556): -7/6/14
-42216105600000 (-2191): -6/6/25
-42184483200000 (-1825): -5/6/6
-42152947200000 (-1460): -4/6/17
-42121411200000 (-1095): -3/6/28
-42089875200000 (-730): -2/6/9
-42058252800000 (-364): -1/6/21

*/


//----------------------------------------------------------------------------------------------------------------------------------------------------------//



library_namespace.extend({
	to_Tabular: set_bind(Date_to_Tabular),
	to_Dai: function () {
		// 轉成紀元積日數。
		return Dai_Date.date_of_days((this - Dai_Date.epoch) / ONE_DAY_LENGTH_VALUE | 0);
	}
}, Date.prototype, null, 'function');


return (
	_// JSDT:_module_
);
}


});

