/* copyright webscripts.biz(Nadeem Elahi: nadeem.elahi@gmail.com) */
"use strict";

window.addEventListener("load", start, false);

/* GNU v 3 license */
var T = new function(){ //singleton
   this.id = "T -singleton";
   var items = [], len;
   this.add=function(item){
      items.push(item);len=items.length;
   };
   var rmIdx;
   this.rm=function(item){
      rmIdx=items.indexOf(item);
      items.splice(rmIdx,1);
      len=items.length;
   };
   var dt,ct,lt=Date.now();
   var raf = window.requestAnimationFrame || 
      window.msRequestAnimationFrame || 
      window.oRequestAnimationFrame || 
      window.mozRequestAnimationFrame || 
      indow.webkitRequestAnimationFrame || 
      function(cb){setTimeout(cb,30);};
   var i,t=0;
   function ticker(){
      ct=Date.now();
      dt=ct-lt;
      t += dt;
      if(t>30){
	 for(i=0;i<len;i++){
	    items[i].tick(t);
	 }
	 t=0;
      } 
      lt=ct;
      raf(ticker);
   } 
   ticker();
};

var SR = new function(){ //Slide Rotator
   var i = 0, all=[], len = 0;
   this.addFirst = function(slide){
      all.push(slide);
      slide.nadIdx = 0;
      slide.nadNext = 0;
      len = 1;
   };
   this.add = function(slide){
      all.push(slide);
      slide.nadIdx = len;
      slide.nadNext = 0;
      all[len-1].nadNext = len;
      len++;
   };
   this.startSlide = function(idx){
      all[idx].show();
   };
};

var Util = {
   empty : function($){
      while($.firstChild){
	 $.removeChild($.firstChild);
      }
   }
};

function start(){
   var i, d = document, $txt,
      $allSlides=[], _allSlides=[], len,
      $activeSlideDisplay, $timerDisplay, $numInRotationDisplay;

   $allSlides = d.getElementsByClassName("eachSlide");
   len = $allSlides.length;

   $activeSlideDisplay = d.getElementById("activeSlideDisplay");
   $timerDisplay = d.getElementById("timerDisplay");
   $numInRotationDisplay = d.getElementById("numInRotationDisplay");

   function EachSlide(){
      var i, len = 6, //6 slides
	 current, elapsed, duration = 2000;

      this.nadIdx; //set by SR Slider Rotator
      this.nadNext;

      this.show = function(idx){
	 for(i=0; i<6; i++){
	    $allSlides[i].style.display = "none";
	 }
	 $allSlides[this.nadIdx].style.display = "block";
	 Util.empty($activeSlideDisplay);
	 $txt = d.createTextNode("slide " + this.nadIdx);
	 $activeSlideDisplay.appendChild($txt);
	 current = 0;
	 T.add(this);
      };

      this.tick = function(t){
	 current += t;

	 Util.empty($timerDisplay);
	 $txt = d.createTextNode( (current/100 >>0)*100 + " ms");
	 $timerDisplay.appendChild($txt);

	 if(current > duration){
	    console.log("DONE duration");
	    T.rm(this);
	    SR.startSlide(this.nadNext);
	 }
      };
   }

   for(i=0;i<len;i++){
      _allSlides[i] = new EachSlide();
   }
   //_allSlides[1].show();
   //console.log(_allSlides[0]);
   SR.addFirst(_allSlides[0]);
   SR.startSlide(0);

   var currentAddedCount = 1;
   function addSlide(){
      if(currentAddedCount >= len) return; //max six slides
      SR.add(_allSlides[currentAddedCount ]);
      currentAddedCount++;

      Util.empty($numInRotationDisplay);
      $txt = d.createTextNode( currentAddedCount );
      $numInRotationDisplay.appendChild($txt);
   }

   function nadClickHandler(evt){
      if(!evt) var evt = window.event;
      
      if(evt.target.id == "addSlide"){
	 addSlide();
      }

   }
   d.body.addEventListener("click", nadClickHandler, false);
 
}
