var Xpl = require('xpl-api');
var Prowl = require('node-prowl');
var fs = require('fs');
var os = require('os');

function wt(device, options) {
	options = options || {};
	this._options = options;

        this.configFile = "./prowl.config.json";
        this.configHash = []; 
        
        this.server;
        this.config = 0;

        options.xplSource = options.xplSource || "bnz-prowl."+os.hostname();

	this.xpl = new Xpl(options);
};

module.exports = wt;

var proto = {
    
        init: function(callback) {
                var self = this;

                self.xpl.bind(function(error) {
                        if (error) {
                                return callback(error);
                        }

                        console.log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function() {
		if (!this._configuration.xplLog) {
			return;
		}
                
		console.log.apply(console, arguments);
	},
        
        _sendXplStat: function(body, schema) {
                var self = this;                
                self.xpl.sendXplStat(
                        body,
                        schema
                );
        },    
        
        /*
         *  Config xPL message
         */
        
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) console.log("file "+self.configFile+" is empty ...");
                        else {
                            self.configHash = JSON.parse(body);
                        }
                });
        },

        sendConfig: function(callback) {
                var self = this;
                self._sendXplStat(self.configHash, 'prowl.config');
        },
        
        writeConfig: function(body) {
                var self = this;
                self.configHash.enable = body.enable;
                self.configHash.apikey = body.apikey;
                fs.writeFile(self.configFile, JSON.stringify(self.configHash), function(err) {
                        if (err) console.log("file "+self.configFile+" was not saved to disk ...");
                });
        },
        
        /*
         *  Plugin specifics functions
         */
                
        push: function(body){
            var self = this;
            var client = new Prowl(self.configHash.apikey);
            client.push(body.description, body.application, function( err, sms ){
                    //self.sendXplStatus(error, sms);
                    if (err) console.log("Prowl sms was not send to the API ..." + err);
            });
        },
        
        validBasicSchema: function(body) {
                var self = this;
                if (typeof(body.application) !== "string" && !body.application.match(/^[a-zA-Z0-9]{1,100}$/i) ) {
                        //console.log("application invalid :"+body.application);
                        return false;
                }
                if (typeof(body.description) !== "string") {
                        //console.log("description invalid :"+body.description);
                        return false;
                }
                return true;
        },
        
        validConfigSchema: function(body) {
                var self = this;
                if (typeof(body.enable) !== "string" ) {
                        return false;
                }
                if (typeof(body.apikey) !== "string") {
                        return false;
                }
                return true;
        }
	
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
