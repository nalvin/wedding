/*
* Photo Lottery
* Author: Kris Zhang
* Lincense: MIT
* https://github.com/newghost/js-lottery.git
*/
/*
Fix old IE.
*/
var token = "EAABtTOZBid2cBAPSsPpnsZC24oCprkCWCgZAKsK0jmnxuNux3r58mKlVxLKmY13XeNKvqGPChLeJ7rkUZC04zCOCxTXaxf4htbrwLuZAqZCaZCcphgERBSnbK8CzHNrVuDyr2I37jFGpPZBzSbw5zOFwHSWrvIn3t8GopTtKsmL5XQZDZD";
var targetId = "1569234599765262";
var url = "https://graph.facebook.com/v2.10/" + targetId + "/feed?fields=full_picture,message,from&access_token=" + token;
var idList = [];
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
					idList.push(tmpId);
					img.src = ("http://graph.facebook.com/" + tmpId + "/picture?type=large&redirect=true&height=200");
					
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

var selectedList = [];


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

    var u_hide = document.getElementById("click_start");
    u_hide.style.display = "none";

    var u_show = document.getElementById("click_first");
    u_show.style.display = "block";
  };

  var stop = function() {
    clearInterval(timer);
    timer = null;
	
	var selectedName = [];
	while(selectedList.length < 3){
		var selected  = Math.floor(Math.random() * itemCount);
		if(!selectedName.includes(idList[selected])){
			selectedList.push(selected);
			selectedName.push(idList[selected]);
			console.log(selected);
		}
	}
    setCurIdx();
  };

  //Index: first item on the left
  var setCurIdx = function() {
	var x = document.getElementById("lottery-container");
	x.style.display = "none";
	
	var hero           = $("#lottery-hero1 img");
	var name           = document.getElementById("lottery-hero1-p");
    var showimg = $("#lottery-container li img");
    var showtxt = $("#lottery-container li div");
    var imgUrl = showimg.eq(selectedList[0]).attr("src");
    name.innerHTML = showtxt[selectedList[0]].innerHTML;
    hero.attr("src", imgUrl).show("slow"); 

    var congradulation = document.getElementById("congradulation");
    congradulation.style.display = "block";

    var u_hide = document.getElementById("click_first");
    u_hide.style.display = "none";

    var u_show = document.getElementById("click_second");
    u_show.style.display = "block";
  };

  var second = function() {
  	var hero           = $("#lottery-hero2 img");
	var name           = document.getElementById("lottery-hero2-p");
    var showimg = $("#lottery-container li img");
    var showtxt = $("#lottery-container li div");
    var imgUrl = showimg.eq(selectedList[1]).attr("src");
    name.innerHTML = showtxt[selectedList[1]].innerHTML;
    hero.attr("src", imgUrl).show("slow"); 

    var u_hide = document.getElementById("click_second");
    u_hide.style.display = "none";

    var u_show = document.getElementById("click_third");
    u_show.style.display = "block";
  };

  var third = function() {
  	var hero           = $("#lottery-hero3 img");
	var name           = document.getElementById("lottery-hero3-p");
    var showimg = $("#lottery-container li img");
    var showtxt = $("#lottery-container li div");
    var imgUrl = showimg.eq(selectedList[2]).attr("src");
    name.innerHTML = showtxt[selectedList[2]].innerHTML;
    hero.attr("src", imgUrl).show("slow");

    var u_hide = document.getElementById("click_second");
    u_hide.style.display = "none";

    var u_show = document.getElementById("click_third");
    u_show.style.display = "none";
  };

  var running = function() {
    return timer != null;
  };

  return {
      init: init
    , start: start
    , stop: stop
    , running: running
    , setCurIdx: setCurIdx
    , second: second
    , third: third
  };

})();

$(document).ready(function() {
	FBquery();
  //Lottery.init();
});
