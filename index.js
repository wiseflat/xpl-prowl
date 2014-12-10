var xplprowl = require("./lib/xpl-prowl");

var wt = new xplprowl(null, {
	xplSource: 'bnz-prowl.wiseflat',
        prowlapi: 'MY-API-KEY'
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
        
        xpl.on("xpl:prowl.basic", function(evt) {
		console.log("Receive message ", evt);
                wt._push(evt);
        }); 
        
        xpl.on("xpl:prowl.config", function(evt) {
		console.log("Receive message ", evt);
                wt._config(evt);
        }); 
});

