var xplprowl = require("./lib/xpl-prowl");

var wt = new xplprowl(null, {
	//xplSource: 'bnz-prowl.wiseflat'
});

wt.init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
        
        // Load config file into hash
        wt.readConfig();
        
        // Send every minutes an xPL status message 
        setInterval(function(){
                wt.sendConfig();
        }, 60 * 1000);
        
        xpl.on("xpl:prowl.request", function(evt) {
                if(evt.headerName == 'xpl-cmnd') wt.sendConfig();
        });
        
        xpl.on("xpl:prowl.basic", function(evt) {
		console.log("Receive message ", evt);
                if(evt.headerName == 'xpl-cmnd' && wt.validBasicSchema(evt.body)) wt.push(evt.body);
        }); 
        
        /*xpl.on("xpl:prowl.config", function(evt) {
		console.log("Receive message ", evt);
                if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.writeConfig(evt.body);
        }); */
});

