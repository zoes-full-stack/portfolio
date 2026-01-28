
var cc = document.createElement('canvas');
var g= cc.getContext('2d');
var s = document.querySelector('svg');

const stage = document.querySelector('.robot-stage');
stage.appendChild(cc);
var allPts;
	var RED = "#303030";


var segments = [	

	[0.989, 1, '#000080',40],
	[0.989, 1, 'black', 50],
	[0.989, 1, '#0060f0',60],
	[0.989, 1, 'black', 70],
	[0.9, 1, '#0060f0', 60],
	[0.9, 1, 'black', 70],
	[0.8, 0.9, 'black', 30],
	[0.8, 0.81, '#c0c0c0', 39],
	[0.8, 0.81, 'black', 50],
	[.36, 0.8, '#a0a0a0', 5],
	[.4, 0.8, 'grey', 20],
	[.4, 0.8, '#a0a0a0', 30],
	[.4, 0.8, 'grey', 40],
	[.4, 0.8, 'black', 50],
	[.3, 0.4, RED, 40],
	[.3, 0.4, 'black', 50],
	[.2, 0.3, RED, 40],
	[.2, 0.3, 'black', 50],
	[.1, 0.2, RED, 40],
	[.1, 0.2, 'black', 50],
	[0, 0.1, RED, 40],
	[0, 0.1, 'black', 50],
	];
	
	segments.reverse();
	
var sx = 0;
var sy = 0;
var influence = 0;

var bubbles = [];
function update() {

    const rect = s.getBoundingClientRect();
    cc.width  = rect.width;
    cc.height = rect.height + 120;

	// cc.width = Math.min(innerWidth,600);
	// cc.height = 400;


	g.lineCap = "round";
	g.lineJoin = "round";
	
	
	var now = new Date().getTime()/500;
	 
	g.translate(0, 10*Math.sin(now/5));
		s.style.transform = "translateY("+(30+10*Math.sin(now/5))+"px)";

	 var allPts1 = [];
	 	var a1 = {x:cc.width/2+80, y:cc.height/2};
		var b1 = {x:cc.width*2/3, y:cc.height/3};
		var c1= {x:cc.width*(0.8+0.1*Math.cos(now/2)), 
					 y:cc.height*(0.8+0.1*Math.sin(now/2.1))};
		var d1 = {x:cc.width*(0.7+0.15*Math.cos(now/2.2)), 
					 y:cc.height*(0.7+0.15*Math.sin(now/2.4))};
		
					 
		sx = 0.9*sx+0.1*mx;
		sy = 0.9*sy+0.1*my;
		var rawInfluence = 0;
		for(var i=0;i<activeFrames.length;i++) {
			if(activeFrames[i]) rawInfluence++;
		}
		
		rawInfluence/=(activeFrames.length||1);
		influence = 0.9*influence+0.1*rawInfluence;
		var inv = 1-influence;
	
		d1.x = (influence*sx+40)+inv*d1.x;
		d1.y = influence*sy+inv*d1.y;
	
	for(var p = 0;p<=1;p+=0.009) {
		var o = qerp(a1,b1,c1,d1, p);
		allPts1.push(o);
	}
	

	var now = new Date().getTime()/500;
	 
	 
	 var allPts2 = [];
	 	var a = {x:cc.width/2-80, y:cc.height/2};
		var b = {x:cc.width*1/3, y:cc.height/3};
		var c = {x:cc.width*(0.2+0.1*Math.cos(now/2.5)), 
					 y:cc.height*(0.8+0.1*Math.sin(now/2.5))};
		var d = {x:cc.width*(0.3+0.15*Math.cos(now/2.7)), 
					 y:cc.height*(0.7+0.15*Math.sin(now/2.8))};
		d.x = (influence*sx-40)+inv*d.x;
		d.y = influence*sy+inv*d.y;


	for(var p = 0;p<=1;p+=0.009) {
		var o = qerp(a,b,c,d, p);
		allPts2.push(o);
	}

	if(d1.x<cc.width/2) {
		
		allPts = allPts2;
		for(var i =0;i< segments.length;i++) {
			drawSegment.apply(this,segments[i]);
		}
			allPts = allPts1;
		for(var i =0;i< segments.length;i++) {
			drawSegment.apply(this,segments[i]);
		}
	} else {
			allPts = allPts1;
		for(var i =0;i< segments.length;i++) {
			drawSegment.apply(this,segments[i]);
		}
		allPts = allPts2;
		for(var i =0;i< segments.length;i++) {
			drawSegment.apply(this,segments[i]);
		}
	
}

	activeFrames.push(didMove);
	
	
	didMove = false;
	while(activeFrames.length>FRAMES_TOTAL) activeFrames.shift();
	
		if(Math.random()>0.5) {
			blowBubble(d1);
		} else {
			blowBubble(d);
		}
	g.globalCompositeOperation = "lighter";
	
	g.strokeStyle = "rgba(100,180,255,0.2)";
	g.lineWidth = 2
	for(var i =0;i<bubbles.length;i++) {
		if(!updateBubble(bubbles[i])) {
			bubbles.splice(i,1);
		}
	}
g.globalAlpha = 1;
	g.globalCompositeOperation = "source-over";
	requestAnimationFrame(update);
}
function updateBubble(b) {
	b[0]+=Math.random()-.5;
	b[1]-=2;
	b[2]*=1.01;
	g.globalAlpha = Math.max(0,Math.min(1, (b[1]-10)/90));
	g.beginPath();
	g.arc(b[0],b[1],b[2], 0,7);
	g.stroke();
	if(b[1]<10) { 
		return false;
	}
	return true;
}

function blowBubble(pt) {
	var bubble = [pt.x+(Math.random()-0.5)*30, pt.y+(Math.random()-0.5)*30,5+Math.random()*5];
	bubbles.push(bubble);
}

document.body.addEventListener('mousemove', onMouseMove);
document.body.addEventListener('touchmove', onTouchMove);


var mx = 0;
var my = 0;
var lastMouseMoved = 0;
var didMove = false;
var activeFrames = [];
var FRAMES_TOTAL = 90;

function onMouseMove(evt) {
	lastMouseMoved = new Date().getTime()/500;
	mx = Math.max(90, Math.min(evt.clientX-cc.offsetLeft, cc.offsetWidth-90));
	my = Math.max(0, Math.min(evt.clientY-cc.offsetTop, cc.offsetHeight-50));
	didMove = true;
}

function onTouchMove(evt) {
	lastMouseMoved = new Date().getTime()/500;
	mx = Math.max(0, Math.min(evt.touches[0].clientX-cc.offsetLeft, cc.offsetWidth));
	my = evt.touches[0].clientY;

}


update();

function drawSegment(start, end, color, width) {
	g.strokeStyle = color;
	g.lineWidth = width;
	g.beginPath();

	var i = start*allPts.length;
	do {
		var o = allPts[Math.floor(i)];
		if(o)  g.lineTo(o.x,o.y);
	} while(i++,i< end*allPts.length );
	g.stroke();
}


function qerp(a,b,c,d,p) {
	var o = {};
	var q = 1-p;
	for(var prop in a) {
		if(a.hasOwnProperty(prop)) {
			o[prop] = 1 * a[prop]*q*q*q + 
							3 * b[prop]*q*q*p + 
							3 * c[prop]*q*p*p + 
							1 * d[prop]*p*p*p ;
		}
	}
	return o;
}
