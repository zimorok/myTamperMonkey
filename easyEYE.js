// ==UserScript==
// @name         easyEye
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Read your web novel easily on mobile with paginated content
// @author       Zimorok
// @match        *://boxnovel.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==
GM_addStyle(".btn-group button{background-color:#4caf50;border:1px solid green;color:#fff;padding:10px 24px;cursor:pointer;float:left;position:sticky;position:-webkit-sticky;bottom:0}.btn-group:after{content:'';clear:both;display:table}.btn-group button:not(:last-child){border-right:none}.btn-group button:hover{background-color:#3e8e41}");
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
    var newPage = $('<div class="page">').css({'border':'1px solid black','text-align':'justify','padding':'5px'});
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
    //--create the page ID and add the div.page
	$('div.page').each(function(index){
		$(this).prop('id','page_'+index);
	});

	//--creating next/previous button
	//--append the next/previous button to <body>
	var nav = '<div class="btn-group"><button href="#prev"><&laquo; Prev</button><button href="#next">Next &raquo;</button></div>';
	$('body').append(nav);
	for(var pn = 0; pn < $('div.page').length; pn++)
	{
		nav.append('<a href="#page_'+pn+'">'+pn+'</a>');
	}
	//--simple numbering and scroll-to 
	$("a[href^='#']").click(function(e) {
	e.preventDefault();
	
	var position = $($(this).attr("href")).offset().top;

	$("body, html").animate({
		scrollTop: position
	} /* speed */ );
	});

}

$(window).resize(paginate).resize();
$('html, body').animate({ scrollTop: $('#story').offset().top }, 'slow'); //--focus to the story

//--debug
console.log('Pages: '+$('div.page').length);
});
