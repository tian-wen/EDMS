// JavaScript Document

/* jshint esversion: 6 */

let result_ajax_list;
let result_page_total = 0;
let result_page_current = 0;

// 输入控制
function query_function() {
	'use strict';
	let query_type = $("#query_type").val().trim();

	if(query_type === "normal") {
		let query_input = $("input[name='query_input']").val().trim();
		let query_selection = $("#query_selection").val().trim();
		console.log('query_function() query_input=' + query_input +
			  "&query_type=" + query_type +
			  "&query_selection=" + query_selection);
		if(!query_input || query_input === "" || !query_selection || query_selection==="") {
			return false;
		} else {
			query_list_ajax(query_input, query_type, query_selection);
		}
	} else if(query_type === "advanced") {
		let researcher = $("#researcher_input").val().trim();
		let field = $("#field_input").val().trim();
		let research_content= $("#research_content_input").val().trim();
		let organization = $("#organization_input").val().trim();
		console.log(
			'query_function() query_type=' + query_type +
			  "&researcher_input=" + researcher +
			  "&field_input=" + field +
			  "&research_content_input=" + research_content +
			  "&organization_input=" + organization);
		if ( (!researcher && !field && !research_content && !organization) ||
			(researcher==="" && field==="" && research_content==="" && organization==="") ) {
				return false;
		} else {
			query_list_ajax("", query_type, "", researcher, field, research_content, organization);
		}
	} else {
		return false;
	}
}

function query_list_ajax(qi, qt, qs, r, f, rc, org) {
	'use strict';
	let server_url = "expert/list";
	
	let post_data = {};
	if(qt === "normal") {
		post_data.query_input = qi;
		post_data.query_type = qt;
		post_data.query_selection = qs;
	} else if(qt === "advanced") {
		post_data.query_type = qt;
		post_data.researcher_input = r;
		post_data.field_input = f;
		post_data.research_content_input = rc;
		post_data.organization_input = org;
	} else {
		//隐藏loading动画
		$('.load-container').css({"display": "none"});
		return false;
	}
	
	// HTTP POST (JQuery Ajax)
	$.ajax({
		type: "GET",
		url: server_url,
		data: post_data,
		//crossDomin: true,
		//dataType: "jsonp",
		//jsonp: "jsonp_callback",
		//jsonpCallback: "jsonpCallbackFunction",
		dataType: "json",
		//async: true,    // 使用同步操作
		//timeout: 50000, // 超时时间：50秒
		beforeSend: function(xhr) {
			// 出现loading动画
			$('.load-container').css({"display": "block"});
			// 隐藏页面按钮
			$('#query_result_page').css({"display": "none"});
		},
		success: function(result, status, xhr) {
			//alert('HTTP GET Success! normal_query: ' + 'result=' + result);
			
			// 隐藏loading动画
			$('.load-container').css({"display": "none"});

			if(!result || result === "" || result.length === 0) {
				// 清空researcher_result_list里面的所有内容
				$('.researcher_result_list').empty();
				// 提示无搜索结果
				let html_template = '<p id="search_result_tag">抱歉，无搜索结果，请输入其它关键词以查询。</p>';
				// 增添子元素到researcher_result_list结点
				$('.researcher_result_list').append(html_template);
				return false;
			} else {
				result_page_total = Math.floor(result.length / 20) + 1;
			}
			result_page_current = 1;

			result_ajax_list = JSON.parse("[" + result + "]");
			result = result_ajax_list;

			console.log(result);

			// 清空researcher_result_list里面的所有内容
			$('.researcher_result_list').empty();

			// 对返回结果的每个元素，增添到html_template里
			let html_template = '<p id="search_result_tag">搜索结果 - 按影响力排序（点击以查看专家详细信息）：</p>' +
				'<p id="search_result_info">共 ' + result.length +
				' 条结果，分 ' + result_page_total + ' 页显示，' +
				'当前为第 ' + result_page_current + ' 页。</p>';

			// 先渲染第一页，至多20位专家学者
			let i;
			for(i = 0 ; i < 20 && i < result.length ; i++) {
				html_template += '<dl><hr />';
				let this_score = parseFloat(result[i].score).toFixed(0);
				// 判断专家有没有头像URL
				if(!result[i].img_url || result[i].img_url === "") {
					html_template +=
						'<dt class="dd-img"><img src="static/image/default_expert_image.png" alt="researcher image" /></dt>' +
						'<dd><a onclick="query_detail_ajax(' + result[i].id + ')" id="researcher_' +
						result[i].id + '">' + result[i].name + '</a></dd>' +
						// 使用默认头像
						'<dd><p><strong>影响力：' + this_score + '</strong></p></dd>' +
						'<dd><p><strong>学校</strong>：' + result[i].university + '</p></dd>' +
						'<dd><p><strong>学院</strong>：' + result[i].college + '</p></dd>' +
						'<dd><p><strong>研究方向</strong>：';
					if(!result[i].theme_list || result[i].theme_list === "") {
					    html_template += '无。</p></dd>';
					} else {
						//html_template += result[i].theme_list.split("、", 1)[0] + '。</p>' +
                        html_template += result[i].theme_list + '。</p></dd>';
					}
				} else {
					html_template +=
						'<dt class="dd-img"><img src="' + result[i].img_url + '" alt="researcher image" /></dt>' +
						'<dd><a onclick="query_detail_ajax(' + result[i].id + ')" id="researcher_' +
						result[i].id + '">' + result[i].name + '</a></dd>' +
						'<dd><p><strong>影响力：' + this_score + '</strong></p></dd>' +
						'<dd><p><strong>学校</strong>：' + result[i].university + '</p></dd>' +
						'<dd><p><strong>学院</strong>：' + result[i].college + '</p></dd>' +
						'<dd><p><strong>研究方向</strong>：';
					if(!result[i].theme_list || result[i].theme_list === "") {
					    html_template += '无。</p></dd>';
					} else {
						//html_template += result[i].theme_list.split("、", 1)[0] + '。</p>' +
                        html_template += result[i].theme_list + '。</p></dd>';
					}
				}
				html_template += '</dl>';
			}
			// 增添子元素到researcher_result_list结点
			$('.researcher_result_list').append(html_template);
			// 根据展示的数据量确定页数div的显示位置
			$('#query_result_page').css({"margin": 200 * (Math.floor((i - 1) / 2) + 1) + 100 + "px 0 0 0"});
			// 出现页数div
			$('#query_result_page').css({"display": "block"});
			// 重置页码(第1页～第10页)
			$('#query_result_page_1').attr("value", "1");
			$('#query_result_page_2').attr("value", "2");
			$('#query_result_page_3').attr("value", "3");
			$('#query_result_page_4').attr("value", "4");
			$('#query_result_page_5').attr("value", "5");
			$('#query_result_page_6').attr("value", "6");
			$('#query_result_page_7').attr("value", "7");
			$('#query_result_page_8').attr("value", "8");
			$('#query_result_page_9').attr("value", "9");
			$('#query_result_page_10').attr("value", "10");

			$('#query_result_page input.page_number_button').css("border", "1px solid #6495ed");

			$('#query_result_page_1').css("border", "3px solid #000");

			// 使上一页按钮不可选
			if(!$('#query_result_page_pre').hasClass("disabled")) {
				$('#query_result_page_pre').addClass("disabled");
			}

			// 若总共仅一页,则使下一页按钮和跳转按钮都不可选
			if(result_page_total === 1) {
				if(!$('#query_result_page_next').hasClass("disabled")) {
					$('#query_result_page_next').addClass("disabled");
				}
				if(!$('#query_result_page_button').hasClass("disabled")) {
					$('#query_result_page_button').addClass("disabled");
				}
			} else {
				// 否则去除"不可选"类
				if($('#query_result_page_next').hasClass("disabled")) {
					$('#query_result_page_next').removeClass("disabled");
				}
				if($('#query_result_page_button').hasClass("disabled")) {
					$('#query_result_page_button').removeClass("disabled");
				}
			}

			// 若总共页数小于10,则使部分1～10按钮不可用
			if(result_page_total > 0 || result_page_total < 10) {
				let i = 1;
				for(i = 1 ; i <= result_page_total ; i++) {
					if($('#query_result_page_' + i).hasClass("disabled")) {
						$('#query_result_page_' + i).removeClass("disabled");
					}
				}
				for(i = result_page_total + 1 ; i <= 10 ; i++) {
					if(!$('#query_result_page_' + i).hasClass("disabled")) {
						$('#query_result_page_' + i).addClass("disabled");
					}
				}
			} else {
				// 否则使得1～10按钮都可选
				let i = 1;
				for(i = 1 ; i <= 10 ; i++) {
					if($('#query_result_page_' + i).hasClass("disabled")) {
						$('#query_result_page_' + i).removeClass("disabled");
					}
				}
			}
		},
		error: function(xhr, status, error) {
			// 隐藏loading动画
			$('.load-container').css({"display": "none"});
			alert('HTTP GET Error! status=' + status + '&error=' + error +
				'&statusCode=' + xhr.status + '&responseText=' + xhr.responseText +
				 '&readyState=' + xhr.readyState);
		},
		statusCode: {
			// 当响应对应的状态码时，执行对应的回调函数
			200: function() {
				console.log("200: 请求成功");
			},
			404: function() {
				console.log("404: 找不到页面");
				alert("404: 找不到页面");
			},
			500: function() {
				console.log("500: 服务器错误");
				alert( "500: 服务器错误" );
			}
		},
	});
}

// 查询专家详情
function query_detail_ajax(expert_id) {
	'use strict';
	// 出现loading动画
	$('.load-container').css({"display": "block"});
	window.location.href = "expert/detail?id=" + expert_id;
}

// 切换查询类型：普通查询or高级查询 (normal or advanced)
function toggle_query_type_function() {
	'use strict';

	let query_type = $('#query_type').val().trim();
	if(query_type === 'normal') {
		$('.load-container').css({"padding": "100px 0 20px 0"});
		$('#query_type').val('advanced');
		$('#query_type_button').css("border", "3px solid #000");
		// 禁用普通输入框
		$('#query_input').attr("disabled", true);
		$('#query_input').val("请在下方输入框键入关键字");
		$('#query_input').css({"background-color": "#b0b0b0"});
		// 增添输入框
		$('#advanced_input_list').css({"opacity": "0"});
		let html = $(
			'<span class="input_left"><p>学者姓名:</p><input type="text" id="researcher_input" name="researcher_input" class="advanced-input" value=""  placeholder="请输入专家学者姓名" /></span>' +
			'<span class="input_right"><p>所属机构:</p><input type="text" id="organization_input" name="organization_input" class="advanced-input" value=""  placeholder="请输入学者所属机构" /></span><br />' +
			'<span class="input_left"><p>钻研领域:</p><input type="text" id="field_input" name="field_input" class="advanced-input" value="" placeholder="请输入学者钻研领域" /></span>' +
			'<span class="input_right"><p>研究内容:</p><input type="text" id="research_content_input" name="research_content_input" class="advanced-input" value="" placeholder="请输入学者研究内容" /></span>'
		);
		$('#advanced_input_list').append(html);
		$('#advanced_input_list').animate({opacity: 1}, 500);
		// input框获取焦点时清除placeholder
		$("input#researcher_input").focus(function() {
			$("input#researcher_input").attr({"placeholder": ""});
		});
		$("input#researcher_input").blur(function() {
			$("input#researcher_input").attr({"placeholder": "请输入专家学者姓名"});
		});

		$("input#organization_input").focus(function() {
			$("input#organization_input").attr({"placeholder": ""});
		});
		$("input#organization_input").blur(function() {
			$("input#organization_input").attr({"placeholder": "请输入学者所属机构"});
		});

		$("input#field_input").focus(function() {
			$("input#field_input").attr({"placeholder": ""});
		});
		$("input#field_input").blur(function() {
			$("input#field_input").attr({"placeholder": "请输入学者钻研领域"});
		});

		$("input#research_content_input").focus(function() {
			$("input#research_content_input").attr({"placeholder": ""});
		});
		$("input#research_content_input").blur(function() {
			$("input#research_content_input").attr({"placeholder": "请输入学者研究内容"});
		});
	} else {
		$('.load-container').css({"padding": "20px 0 20px 0"});
		$('#query_type').val('normal');
		$('#query_type_button').css("border", "1px solid #6495ed");
		// 启用普通输入框
		$('#query_input').attr("disabled", false);
		$('#query_input').val("");
		$('#query_input').css({"background-color": "transparent"});
		// 移除输入框
		$('#advanced_input_list').animate({opacity: 0}, 300, "linear", function(){
			$('#advanced_input_list').empty();
		});
	}
}


// 换页时，改变查询结果内容
function change_query_result_page() {
	'use strict';

	if(!result_ajax_list || result_ajax_list.length === 0 || result_ajax_list === "" ||
		parseInt(result_page_current, 10) <= 0 || parseInt(result_page_total, 10) <= 0 ||
		parseInt(result_page_current, 10) > parseInt(result_page_total, 10) ) {
		console.log('function change_query_result_page() error: global variables error.');
		return false;
	}
	
	let result = result_ajax_list;
	let result_total_page = result_page_total;
	let result_now_page = result_page_current;
	// 该页第一条json内容在result中的索引位置
	let content_start_index = (parseInt(result_now_page, 10) - 1) * 20;
	// 该页最后一条json内容在result中的索引位置
	let content_end_index;
	if( (content_start_index + 20) <= result.length ) {
		content_end_index = parseInt(content_start_index, 10) + 19;
	} else {
		content_end_index = parseInt(result.length, 10) - 1;
	}
	// 该页的元素总数
	let content_total = parseInt(content_end_index, 10) - parseInt(content_start_index, 10) + 1;

	// 清空researcher_result_list里面的所有内容
	$('.researcher_result_list').empty();

	// 对返回结果的每个元素，增添到html_template里
	let html_template = '<p id="search_result_tag">搜索结果 - 按影响力排序（点击以查看专家详细信息）：</p>' +
		'<p id="search_result_info">共 ' + result.length +
		' 条结果，分 ' + result_total_page + ' 页显示，' +
		'当前为第 ' + result_now_page + ' 页。</p><ul>';

	// 渲染新页面
	for(let i = parseInt(content_start_index, 10) ; i <= parseInt(content_end_index, 10) ; i++) {
		html_template += '<dl><hr />';
		let this_score = parseFloat(result[i].score).toFixed(0);
		// 判断专家有没有头像URL
		if(!result[i].img_url || result[i].img_url === "") {
			html_template +=
				'<dt class="dd-img"><img src="static/image/default_expert_image.png" alt="researcher image" /></dt>' +
				'<dd><a onclick="query_detail_ajax(' + result[i].id + ')" id="researcher_' +
				result[i].id + '">' + result[i].name + '</a></dd>' +
				// 使用默认头像
				'<dd><p><strong>影响力：' + this_score + '</strong></p></dd>' +
				'<dd><p><strong>学校</strong>：' + result[i].university + '</p></dd>' +
				'<dd><p><strong>学院</strong>：' + result[i].college + '</p></dd>' +
				'<dd><p><strong>研究方向</strong>：';
			if(!result[i].theme_list || result[i].theme_list === "") {
				html_template += '无。</p></dd>';
			} else {
				//html_template += result[i].theme_list.split("、", 1)[0] + '。</p>' +
				html_template += result[i].theme_list + '。</p></dd>';
			}
		} else {
			html_template +=
				'<dt class="dd-img"><img src="' + result[i].img_url + '" alt="researcher image" /></dt>' +
				'<dd><a onclick="query_detail_ajax(' + result[i].id + ')" id="researcher_' +
				result[i].id + '">' + result[i].name + '</a></dd>' +
				'<dd><p><strong>影响力：' + this_score + '</strong></p></dd>' +
				'<dd><p><strong>学校</strong>：' + result[i].university + '</p></dd>' +
				'<dd><p><strong>学院</strong>：' + result[i].college + '</p></dd>' +
				'<dd><p><strong>研究方向</strong>：';
			if(!result[i].theme_list || result[i].theme_list === "") {
				html_template += '无。</p></dd>';
			} else {
				//html_template += result[i].theme_list.split("、", 1)[0] + '。</p>' +
				html_template += result[i].theme_list + '。</p></dd>';
			}
		}
		html_template += '</dl>';
	}
	// 增添子元素到researcher_result_list结点
	$('.researcher_result_list').append(html_template);
	// 根据展示的数据量确定页数div的显示位置
	$('#query_result_page').css({"margin": 200 * (Math.floor((content_total - 1) / 2) + 1) + 100 + "px 0 0 0"});
}


function isChrome() {
	'use strict';
	let ua = navigator.userAgent;
	return (ua.indexOf("Chrome") > -1);
}


$(function() {
	'use strict';

	// input框的enter事件绑定
	$('#query_input').keydown(function (event) {
		// 按下Enter键
		if(event.keyCode === 13 || event.key === 'Enter') {
			query_function();
		}
	});
	
	if (isChrome() && window.history && window.history.pushState) {
		 $(window).on('popstate', function () {
			 window.location.href=window.document.referrer;
			 window.history.go(-2);
		 });
		 window.history.pushState(location.href, document.title);
	 }

	// 切换标签
	$('#query_selection_list ul li').click(function() {
		$(this).addClass('active').siblings().removeClass('active');
	});

	$('#researcher').click(function() {
		$('#researcher_word').addClass('active');
		$('#field_word').removeClass('active');
		$("#query_selection").val("researcher");
	});

	$('#field').click(function() {
		$('#researcher_word').removeClass('active');
		$('#field_word').addClass('active');
		$("#query_selection").val("field");
	});
	
	$('#research_content').click(function() {
		$('#researcher_word').removeClass('active');
		$('#field_word').removeClass('active');
		$("#query_selection").val("research_content");
	});

	$('#organization').click(function() {
		$('#researcher_word').removeClass('active');
		$('#field_word').removeClass('active');
		$("#query_selection").val("organization");
	});
	
	
	// hover: change background-color
	$('#query_button').mouseover(function () {
		$(this).css("background-color","#6495ed");
	}).mouseout(function () {
		$(this).css("background-color","#87cefa");
	});
	
	$('#query_type_button').mouseover(function () {
		$(this).css({"background-color": "#6495ed"});
	}).mouseout(function () {
		$(this).css({"background-color": "#87cefa"});
	});

	// input框获取焦点时清除placeholder
	$("input#query_input").focus(function() {
		$("input#query_input").attr({"placeholder": ""});
	});
	$("input#query_input").blur(function() {
		$("input#query_input").attr({"placeholder": "请输入关键词以查询"});
	});

	$("input#query_result_page_input").focus(function() {
		$("input#query_result_page_input").attr({"placeholder": ""});
	});
	$("input#query_result_page_input").blur(function() {
		$("input#query_result_page_input").attr({"placeholder": "页码"});
	});
	
	// 页面跳转按钮-鼠标悬停移开事件
	$('#query_result_page > ul > li > button').mouseover(function () {
		$(this).css({"background-color": "rgba(100, 149, 237, 0.8)"});
	}).mouseout(function () {
		$(this).css({"background-color": "rgba(100, 149, 237, 0.3)"});
	});
	
	// 页面跳转按钮-点击事件-上一页
	$('#query_result_page_pre').click(function() {
		let jq_query_result_page_pre = $('#query_result_page_pre');
		let jq_query_result_page_next = $('#query_result_page_next');
		// 获取当前两边的按钮所指页数
		let left_button = $('#query_result_page_1').val();
		let i = 0;
		
		if(!result_page_current || result_page_current <= 0 || result_page_current > result_page_total) {
			console.log('pre_page_error! result_page_current is out of range.');
			return false;
		} else if(parseInt(result_page_current, 10) === 1) {
			alert('当前页已经是第一页了');
			return false;
		} else {
			if(left_button.toString() === result_page_current.toString()) {
				// 如果当前页是最左按钮所指的页面，则要调整全部按钮的值
				for(i = 1 ; i <= 10 ; i++) {
					$('#query_result_page_' + i).val( parseInt($('#query_result_page_' + i).val().toString(), 10) - 1 );
				}
				result_page_current = parseInt(result_page_current, 10) - 1;
				// change content
				change_query_result_page();
			} else if(parseInt(left_button, 10) < parseInt(result_page_current, 10)) {
				// 如果当前页在最左按钮所指页面的后面，则修改选中按钮的样式
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10))).css({"border": "3px solid #000"});
				result_page_current = parseInt(result_page_current, 10) - 1;
				// change content
				change_query_result_page();
			} else {
				console.log('pre_page_error!');
				return false;
			}
			// 若按上一页之后到了第一页,则使上一页按钮不可选
			if(result_page_current === 1 && !jq_query_result_page_pre.hasClass("disabled")) {
				jq_query_result_page_pre.addClass("disabled");
			}

			// 若下一页按钮之前有disabled属性,则撤销之
			if(jq_query_result_page_next.hasClass("disabled")) {
				jq_query_result_page_next.removeClass("disabled");
			}
		}
	});
	
	// 页面跳转按钮-点击事件-下一页
	$('#query_result_page_next').click(function() {
		let jq_query_result_page_pre = $('#query_result_page_pre');
		let jq_query_result_page_next = $('#query_result_page_next');
		// 获取当前两边的按钮所指页数
		let left_button = $('#query_result_page_1').val();
		let right_button = $('#query_result_page_10').val();
		let i = 0;
		
		if(!result_page_current || result_page_current <= 0 || result_page_current > result_page_total) {
			console.log('next_page_error! result_page_current is out of range.');
			return false;
		} else if(parseInt(result_page_current, 10) === parseInt(result_page_total, 10)) {
			alert('当前页已经是最后一页了');
			return false;
		} else {
			if(right_button.toString() === result_page_current.toString()) {
				// 如果当前页是最右按钮所指的页面，则要调整全部按钮的值
				for(i = 1 ; i <= 10 ; i++) {
					$('#query_result_page_' + i).val( parseInt($('#query_result_page_' + i).val().toString(), 10) + 1 );
				}
				result_page_current = parseInt(result_page_current, 10) + 1;
				// change content
				change_query_result_page();
			} else if(parseInt(right_button, 10) > parseInt(result_page_current, 10)) {
				// 如果当前页在最右按钮所指页面的前面，则修改选中按钮的样式
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 2)).css({"border": "3px solid #000"});
				result_page_current = parseInt(result_page_current, 10) + 1;
				// change content
				change_query_result_page();
			} else {
				console.log('next_page_error!');
				return false;
			}
			// 若按下一页之后到了最后一页,则使下一页按钮不可选
			if(result_page_current === result_page_total && !jq_query_result_page_next.hasClass("disabled")) {
				jq_query_result_page_next.addClass("disabled");
			}

			// 若上一页按钮之前有disabled属性,则撤销之
			if(jq_query_result_page_pre.hasClass("disabled")) {
				jq_query_result_page_pre.removeClass("disabled");
			}
		}
	});
	
	// 页面跳转按钮-点击事件-按按钮跳转
	$('.page_number_button').click(function() {
		// 获取当前两边的按钮所指页数
		let left_button = $('#query_result_page_1').val();
		let button_value = $(this).val();
		
		if(!result_page_current || result_page_current <= 0 || result_page_current > result_page_total) {
			console.log('button_jump_page_error! result_page_current is out of range.');
			return false;
		} else if(!button_value || button_value === "") {
			console.log('button_value is null or ""');
			return false;
		} else if(parseInt(button_value, 10) <= 0 || parseInt(button_value, 10) > parseInt(result_page_total, 10)) {
			alert('搜索结果总共' + result_page_total + '页，请在该范围内查找结果');
			return false;
		} else {
			$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
			$('#query_result_page_' + (parseInt(button_value, 10) - parseInt(left_button, 10) + 1)).css({"border": "3px solid #000"});
			result_page_current = parseInt(button_value, 10);
			// change content
			change_query_result_page();
		}
	});
	
	// 页面跳转按钮-点击事件-按页码跳转
	$('#query_result_page_button').click(function() {
		// 获取当前两边的按钮所指页数
		let left_button = $('#query_result_page_1').val();
		let right_button = $('#query_result_page_10').val();
		let i = 0;
		let page_input = Math.floor( parseInt($('#query_result_page_input').val().toString().trim(), 10) );
		
		if(!result_page_current || result_page_current <= 0 || result_page_current > result_page_total) {
			console.log('input_jump_page_error! result_page_current is out of range.');
			return false;
		} else if(!page_input || page_input === "") {
			alert('请输入合法页码');
			return false;
		} else if(parseInt(page_input, 10) <= 0 || parseInt(page_input, 10) > parseInt(result_page_total, 10)) {
			alert('搜索结果总共' + result_page_total + '页，请输入该范围内的页码');
			return false;
		} else {
			if(parseInt(page_input, 10) < parseInt(left_button, 10)) {
				// 如果输入的页码比最左按钮所指页面的值还小，则调整全部按钮的值，并使最左按钮为选中按钮
				for(i = 1 ; i <= 10 ; i++) {
					$('#query_result_page_' + i).val(parseInt(page_input, 10) + parseInt(i, 10) - 1);
				}
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
				$('#query_result_page_1').css({"border": "3px solid #000"});
				result_page_current = parseInt(page_input, 10);
				// change content
				change_query_result_page();
			} else if(parseInt(page_input, 10) > parseInt(right_button, 10)) {
				// 如果输入的页码比最右按钮所指页面的值还大，则调整全部按钮的值，并使最右按钮为选中按钮
				for(i = 10 ; i >= 1 ; i--) {
					$('#query_result_page_' + i).val(parseInt(page_input, 10) + parseInt(i, 10) - 10);
				}
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
				$('#query_result_page_10').css({"border": "3px solid #000"});
				result_page_current = parseInt(page_input, 10);
				// change content
				change_query_result_page();
			} else {
				// 如果输入的页码介于最左和最右按钮所指页面的值之间，则只需修改选中按钮的样式
				$('#query_result_page_' + (parseInt(result_page_current, 10) - parseInt(left_button, 10) + 1)).css({"border": "1px solid rgba(100, 149, 237, 0.8)"});
				$('#query_result_page_' + (parseInt(page_input, 10) - parseInt(left_button, 10) + 1)).css({"border": "3px solid #000"});
				result_page_current = parseInt(page_input, 10);
				// change content
				change_query_result_page();
			}
		}
	});
});