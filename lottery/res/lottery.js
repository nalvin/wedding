/*
* Photo Lottery
* Author: Kris Zhang
* Lincense: MIT
* https://github.com/newghost/js-lottery.git
*/
/*
Fix old IE.
*/
var token = "120177205344103|FUBCjYJTBgpcnizpbt3bq2wkfXE";
var targetId = "1569234599765262";
var url = "https://graph.facebook.com/v2.10/" + targetId + "/feed?fields=full_picture,message,from&access_token=" + token;
function FBquery() 
{	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200) {
				var myArr = JSON.parse(this.responseText).data;
				var ul = document.getElementById("lottery-ul");
				for (idx = 0; idx < myArr.length; idx++){
					var li = document.createElement("li");
					var img = document.createElement("img");
					var txt = document.createElement("div");
					txt.innerHTML=(myArr[idx].from.name);
					var tmpId = myArr[idx].from.id;
					img.src = ("http://graph.facebook.com/" + tmpId + "/picture?type=large&redirect=true&height=142");
					
					li.appendChild(img);
					li.appendChild(txt);
					ul.appendChild(li);					
				}			
				window.console.log(ul);
				Lottery.init();				
			}
		};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();				
};


var timer           = null,
      itemWidth       = 142,
      itemCount       = 0,
      curPos          = 0;


var Lottery = (function() {

  var init = function() {
	var $content        = $("#lottery-container ul");
    //Pre-caculate the count of items
    itemCount       = $("#lottery-container ul li").size();
	window.console.log(itemCount);
  };

  var start  = function() {
	var x = document.getElementById("lottery-container");
	x.style.display = "block";
	  
    clearInterval(timer);
	var $content        = $("#lottery-container ul");
	var $hero           = $("#lottery-hero img");
   
    timer = setInterval(function() {
      curPos = parseInt($content.css("left")) | 0;
      curPos -= itemWidth / 2;
      (curPos < 0 - itemWidth * itemCount) && (curPos = 0);
      $content.css("left", curPos);
    }, 25);
    $hero.hide();
  };

  var stop = function() {
    clearInterval(timer);
    timer = null;
	var selectedList = []
	while(selectedList.length < 3){
		var selected  = Math.floor(Math.random() * itemCount);
		if(!selectedList.includes(selected)){
			selectedList.push(selected);
			console.log(selected);
		}
	}
    setCurIdx(selectedList);
  };

  var running = function() {
    return timer != null;
  };

  //Index: first item on the left
  var setCurIdx = function(idx) {
	var x = document.getElementById("lottery-container");
	x.style.display = "none";
	
	var $hero           = $("#lottery-hero1 img");
    var $items = $("#lottery li img");
    var imgUrl = $items.eq(idx[0]).attr("src");
    $hero.attr("src", imgUrl).show("slow");

	var $hero           = $("#lottery-hero2 img");
    var $items = $("#lottery li img");
    var imgUrl = $items.eq(idx[1]).attr("src");
    $hero.attr("src", imgUrl).show("slow");
	
	var $hero           = $("#lottery-hero3 img");
    var $items = $("#lottery li img");
    var imgUrl = $items.eq(idx[2]).attr("src");
    $hero.attr("src", imgUrl).show("slow");
    
  };


  return {
      init: init
    , start: start
    , stop: stop
    , running: running
    , setCurIdx: setCurIdx
  };

})();

$(document).ready(function() {
	FBquery();
  //Lottery.init();
});
