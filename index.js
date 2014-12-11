var xplprowl = require("./lib/xpl-prowl");

var wt = new xplprowl(null, {
	xplSource: 'bnz-prowl.wiseflat'
});

wt._init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
        
        xpl.on("xpl:prowl.basic", function(evt) {
		//console.log("Receive message ", evt);
                if(wt._schema_prowl_basic(evt.body)) wt._push(evt.body);
        }); 
        
        xpl.on("xpl:prowl.config", function(evt) {
		//console.log("Receive message ", evt);
                if(wt._schema_prowl_config(evt.body)) wt._config(evt.body);
        }); 
});

