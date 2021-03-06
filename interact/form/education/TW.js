/**
 * @name CeL 輸入教育程度 (educational attainment, 最高學歷) 的範例 module。
 * @fileoverview 本檔案包含了輸入教育程度的 (educational attainment, 最高學歷) functions。
 * @since 2010/1/7 23:50:43 草創。<br />
 *        2012/12/18 0:16:9 為 .run() 體制重寫。
 */

'use strict';
if (typeof CeL === 'function')
	CeL.run({
		name : 'interact.form.education.TW',
		require : 'interact.form.select_input.',
		code : function(library_namespace) {

			// class private -----------------------------------

			function education_TW() {
				// applies the parent's constructor.
				library_namespace.select_input.apply(this, arguments);
				if (!this.loaded)
					return;

				this.setClassName('education_input');
				this.setSearch('includeKeyWC');
				this.setAllList(this.default_list);

				var _this = this;
				this.setProperty('onblur', function() {
					if (!_this.clickNow)
						_this.triggerToInput(0);
				});

				// show arrow.
				this.triggerToInput(1);
				this.focus(0);
			}

			// 最高教育程度
			// http://wwwc.moex.gov.tw/ct.asp?xItem=250&CtNode=1054
			education_TW.prototype.default_list =
			// 請填寫
			'博士（含）以上,碩士/研究所,學士/大學院校,副學士/專科,高中/高職,國中/國民中學,國小（含）以下,其他：請說明'
					.split(',');

			library_namespace.inherit(education_TW,
					'interact.form.select_input');

			return education_TW;
		},

		// this is a sub module.
		no_extend : '*,this'
	});
