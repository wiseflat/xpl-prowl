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
		console.log("Receive message ", evt);
                if(evt.headerName == 'xpl-cmnd' && wt.validBasicSchema(evt.body)) wt.push(evt.body);
        }); 
        
        xpl.on("xpl:prowl.config", function(evt) {
		console.log("Receive message ", evt);
                if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.writeConfig(evt.body);
        }); 

        xpl.on("xpl:prowl.request", function(evt) {
		console.log("Receive message ", evt);
                if(evt.headerName == 'xpl-cmnd') wt.readConfig();
        });
});

