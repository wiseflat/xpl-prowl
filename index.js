var xplprowl = require("./lib/xpl-prowl");
var schema_prowlbasic = require('/etc/wiseflat/schemas/prowl.basic.json');
var schema_prowlconfig = require('/etc/wiseflat/schemas/prowl.config.json');

var wt = new xplprowl(null, {
        xplLog: false,
        forceBodySchemaValidation: false
});

wt.init(function(error, xpl) {

	if (error) {
		console.error(error);
		return;
	}
        
	xpl.addBodySchema(schema_prowlbasic.id, schema_prowlbasic.definitions.body);
	xpl.addBodySchema(schema_prowlconfig.id, schema_prowlconfig.definitions.body);

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
                //if(evt.headerName == 'xpl-cmnd' && wt.validBasicSchema(evt.body)) wt.push(evt.body);
		if(evt.headerName == 'xpl-cmnd') wt.push(evt.body);
        }); 
        
        xpl.on("xpl:prowl.config", function(evt) {
		console.log("Receive message ", evt);
                //if(evt.headerName == 'xpl-cmnd' && wt.validConfigSchema(evt.body)) wt.writeConfig(evt.body);
		if(evt.headerName == 'xpl-cmnd') wt.writeConfig(evt.body);
        });
});

