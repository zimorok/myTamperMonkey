// ==UserScript==
// @name         easyEye
// @namespace    http://tampermonkey.net/
// @updateURL	 https://github.com/zimorok/myTamperMonkey/raw/master/easyEYE.js
// @version      0.1.11
// @description  Read your web novel easily on mobile with paginated content
// @author       Zimorok
// @match        *://boxnovel.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==
GM_addStyle("#nav{width:100%;text-align:center;margin:0 auto;position:fixed;bottom:0;left:0;right:0}.subs{background-color:green}.subs button{height:30px}");
var $ = window.jQuery
$(document).ready(function() {
    'use strict';

    var chapterText = $("div.reading-content p").each(function(){
						$(this).clone().wrap('<p>').parent().html();
						});

    //--div.read-container
    //--replace the whole div text with only the chapterText
    $('div.text-left').wrap('<div id="story">').html(chapterText);

//--https://stackoverflow.com/questions/12202324/split-text-into-pages-and-present-separately-html5
var contentBox = $('div.text-left');
var words = contentBox.html().split(' ');
function paginate() {
    var newPage = $('<div class="page">').css({'text-align':'justify','margin':'0 auto'});
    contentBox.empty().append(newPage);
    var pageText = null;
    for(var i = 0; i < words.length; i++) {
        var betterPageText;
        if(pageText) {
            betterPageText = pageText + ' ' + words[i];
        } else {
            betterPageText = words[i];
        }
        newPage.html(betterPageText);
        if(newPage.height() > $(window).height()) {
            newPage.html(pageText);
            newPage.clone().insertBefore(newPage)
            pageText = null;
        } else {
            pageText = betterPageText;
        }
    }

	//--creating next/previous button
	//--append the next/previous button to <body>
	var nav = '<button href="#next" class="prev"> &laquo; Previous Page</button>&nbsp;<button href="#next" class="next"> Next Page &raquo;</button>';
	$('div.page').prepend(nav);

	//--to next page 
	$(".next").click(function() {
       $('html,body').animate({ scrollTop:$(this).parent().next().offset().top}, 'fast');

	});
	//--to previous page 
	$(".prev").click(function() {
       $('html,body').animate({ scrollTop:$(this).parent().prev().offset().top}, 'fast');

	});

}

$(window).resize(paginate).resize();
$('html, body').animate({ scrollTop: $('#story').offset().top }, 'slow'); //--focus to the story

//--debug
console.log('Pages: '+$('div.page').length);
});
