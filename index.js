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
        
        xpl.on("xpl:prowl.basic", function(message) {
		console.log("Receive message ", message);
                wt._push(message, 'wiseflat');
        });        
});

