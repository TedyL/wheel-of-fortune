# wheel-of-fortune
JQuery Plugin to setup wof.

A powerful WOF jquery plugin which support server control as well !

---



##  Default Options

```javascript
$("#spinneratlas").spinit({  
    clockwise: true, //wheel turn
    startDegree: 0,  
	turn: 7, // Default wheel board turn times  
	radius: 20, // To avoid flapper too near on the line
	duration: 6000, // Define animation timing in mileseconds  
	transition: 'cubic-bezier(.25,0,.17,1)', // Default transition  
    installUrl: null,  
    luckyUrl: null,  
    keyUrl: null,  
});
```

## How to use ?

Setup DOM element
```html
<div class="spinit" id="spinneratlas" style="background-image: url('./img/gameboard.png')">
	<div class="" data-spinit-id="a1" data-spinit-start="0" data-spinit-end="45"></div>			
	<div class="" data-spinit-id="b2" data-spinit-start="45" data-spinit-end="90"></div>
	<div class="" data-spinit-id="c3" data-spinit-start="90" data-spinit-end="135"></div>
	<div class="" data-spinit-id="d4" data-spinit-start="135" data-spinit-end="180"></div>
	<div class="" data-spinit-id="e5" data-spinit-start="180" data-spinit-end="225"></div>
	<div class="" data-spinit-id="f6" data-spinit-start="225" data-spinit-end="270"></div>
	<div class="" data-spinit-id="g7" data-spinit-start="270" data-spinit-end="315"></div>
	<div class="" data-spinit-id="h8" data-spinit-start="315" data-spinit-end="360"></div>
</div>
```

Include required JS and CSS.

**CSS Parts**
```stylesheets
<link href="./lib/css/spinit.css" rel="stylesheet" type="text/css"/>
```

**Javascript Parts**  
Load all the javascript below the dom node
```javascript  
<script src="./lib/js/jquery.js"></script>  
<script src="./lib/js/transit.js"></script>  
<script src="./lib/js/spinit.js"></script>  
```
Then call the WOF. That's all ! 
```javascript
$("#spinneratlas").spinit({});  
```



## API

**To Normal Spin without server**
```javascript
$("#spinneratlas").spinit("spin", "SPECIFIC THE data-spinit-id HERE", function(){
    alert('CALLBACK AFTER SPIN');
});
```

**For server spin, please specific installURL, luckyURL, and encrypt key url before use serverSpin**

```javascript
$(document).ready(function(){
    var min = $("#spinneratlas").spinit({
		startDegree: -7,
		clockwise: true,
		installUrl: "app/lucky-draw/", // return result as json
		luckyUrl: "app/lucky-spin/", // spin lucky draw
		keyUrl: "app/lucky-key", // encryption key url
	});
	
	$(document).on("click", "#spinneratlas", function(){
		$("#spinneratlas").spinit("serverSpin", function(){
			alert('CALLBACK AFTER SPIN');
		});
	})
});
```

### **lucky draw json pattern that server need to follow**

```json
[  
  {"EncrptionCode":"67746356AD279378","Start":"0","End":"45"},   
  {"EncrptionCode":"5215198ZS4911F85","Start":"45","End":"90"},  
  {"EncrptionCode":"6FGY525262421851","Start":"90","End":"135"},  
  {"EncrptionCode":"72837411442#RT169","Start":"135","End":"180"},  
  {"EncrptionCode":"3351353#DT1924518","Start":"180","End":"225"},  
  {"EncrptionCode":"7M)2699439626718","Start":"225","End":"270"},  
  {"EncrptionCode":"46276668ZK684195","Start":"270","End":"315"},  
  {"EncrptionCode":"67J94945P@929994","Start":"315","End":"360"}
]
```
**Look at start and end point, you will need to define the board start angle, end angle, and also EncrptionCode**  
**Kindly remind : one circle only have 360 Angle**  

### **lucky spin json pattern that server need to follow**
serverSpin will POST the url that you defined in lucky url.
```json
{"id":"67746356AD279378"}
```

### **Advance API**
To avoid user csrf the api, this Jquery Plugin have offer keyUrl features.

You need to defined the keyURL.

### **lucky key json pattern that server need to follow**
```json
{"key":"2595724524292564"}
```

This key will use as encryption key, and POST to server when you calling **"serverSpin"** function.   
**Important !! It will recall the lucky key json again, so you may delete the key once used, and store it to session or cache**
