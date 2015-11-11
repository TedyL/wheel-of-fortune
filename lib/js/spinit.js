/*
The MIT License (MIT)

Copyright (c) 2015 Tedy L

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function ($) {
	var self = this;
    //HELPER
   	// a function to get number in range.
	function randomIntFromInterval(min,max)
	{
	    return Math.floor(Math.random()*(max-min+1)+min);
	}


    var spint = {
    	instance: {}, // DOM Instance
    	angles: {},
        spinning: false,
        severSpinning: false,
    	defaults: {
    		clockwise: true,
			startDegree: 0,
			turn: 7, // Default spin board turn times
			radius: 20, // To avoid the flapper too near on the line
			duration: 6000, // Define animation timing in mileseconds
			transition: 'cubic-bezier(.25,0,.17,1)', // Default transition // Default Options // Default options
            installUrl: null,
            luckyUrl: null,
            keyUrl: null,
            encryptionKey: null,
    	},
    	options: { // After extend options
    	},
        setEncryptionKey: function() { // Function to set encryption key
            if (spint.options.keyUrl != null){
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    url: spint.options.keyUrl
                }).done(function(response){
                    spint.options.encryptionKey = response.key;
                });
            }
        },
        resetEncrptionKey: function(callback) {
            if (spint.options.keyUrl != null){
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    url: spint.options.keyUrl
                }).done(function(response){
                    spint.options.encryptionKey = response.key;
                    callback();
                });
            } // Function to reset encryption key
        },
    	setAngle: function(){ // Function to set all angles to angles object
            if (spint.options.installUrl != null){
                $.ajax({
                  method: 'POST',
                  dataType: 'json',
                  url: spint.options.installUrl,
                }).done(function(response) {
                    var data = response;
                    if (data.length > 0){
                        spint.setEncryptionKey();
                        $(data).each(function(index, value){
                            spint.angles[value["EncrptionCode"]] = {'start': value["Start"], 'end':  value["End"]};
                        });
                    }
                });
            }else{
                $(spint.instance).children("*").each(function(index,value){
                    if ((typeof $(value).data("spinit-start") != "undefined") && (typeof $(value).data("spinit-end") != "undefined") && (typeof $(value).data("spinit-id") != "undefined")){
                        spint.angles[$(value).data("spinit-id")] = {'start': $(value).data("spinit-start"), 'end': $(value).data("spinit-end")};
                    }
                });
            }
    	},
    	getAngle: function(angleID){
    		if (typeof spint.angles[String(angleID)] != "undefined" && spint.angles[String(angleID)] != null){
    			return spint.angles[String(angleID)];
    		}else{
    			return false
    		}
    	},
    	initLayout: function(){
    		// if (spint.options.clockwise){
    		// 	$(spint.instance).css({ rotate: '-=' + spint.options.startDegree });
    		// }else{
    		// 	$(spint.instance).css({ rotate: '+=' + spint.options.startDegree });
    		// }
    	},
    	algorithm: function(targetId){
    		var point = randomIntFromInterval((parseInt(spint.getAngle(targetId)['start']) + spint.options.radius), (parseInt(spint.getAngle(targetId)['end']) - spint.options.radius));
    		if (spint.options.clockwise){
    			var rotateDeg = (spint.options.turn * 360) - point - spint.options.startDegree;
    		}else{
    			var rotateDeg = -(spint.options.turn * 360) - point - spint.options.startDegree;
    		}
    		return rotateDeg;
    	},
    	//Below is callable function
    	spin: function(targetId, callback){
            if (spint.spinning == false){
                spint.spinning = true;
            }else{
                console.log('results still spinning. Please wait for it.');
                return false;
            }

    		function reset(){
				$(spint.instance).transition({
					rotate: '0deg'
				}, 0, 'ease');
			}
			reset();

			if (typeof spint.angles[String(targetId)] != "undefined" && spint.angles[String(targetId)] != null){
                $(spint.instance).transition({
					rotate: String(spint.algorithm(targetId)) + 'deg'
				}, spint.options.duration, spint.options.transition, function(){
                    console.log('finish spinning');
                    spint.spinning = false;
                    callback();
				});
			}else{
				console.log('Invalid room id detected');
			}
    	},
        serverSpin: function(serverCallback){
            if (spint.severSpinning == false){
                spint.severSpinning = true;
            }else{
                console.log('results still spinning. Please wait for it.');
                return false;
            }
            if (spint.options.luckyUrl != null){
                $.ajax({
                    method: 'POST',
                    dataType: 'json',
                    url: spint.options.luckyUrl,
                    data: {key: spint.options.encryptionKey},
                }).done(function(response){
                    if (response.success){
                        spint.spin(response.id, function(){
                            spint.resetEncrptionKey(function(){
                                spint.severSpinning = false;
                                serverCallback();
                            });
                        });
                        
                    }else{
                        console.log(response.message);
                    }
                });
            }else{
                console.log("Please define luckyUrl in options.");
            }
        },
    	init: function(options){
    		spint.instance = this;
    		spint.options = $.extend(spint.defaults, options);
    		spint.setAngle();
    		spint.initLayout();
    	}	
    }

	$.fn.spinit = function(methodOrOptions, callback) {
		if (spint[methodOrOptions]){
			return spint[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ), callback);
		} else if (typeof methodOrOptions == 'object' || ! methodOrOptions) {
			return spint.init.apply(this, arguments);
		} else {
			$.error('Method ' + methodOrOptions + ' doesn\'t exist on jQuery spintit');
		}
	}
})(jQuery);