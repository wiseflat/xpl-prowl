var Xpl = require('xpl-api');
var Prowl = require('node-prowl');
var fs = require('fs');
var os = require('os');
var pjson = require('../package.json');

function wt(device, options) {
	options = options || {};
	this._options = options;

        this.configFile = "/etc/wiseflat/prowl.config.json";
        this.configHash = []; 
        
        this.server;
        this.config = 0;

	this.version = pjson.version;
	
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

                        self._log("XPL is ready");
                        callback(null,  self.xpl);
                });
                
        },

	_log: function(log) {
		/*if (!this._configuration.xplLog) {
			return;
		}*/
                
		console.log('xpl-prowl -', log);
	},
        
        _sendXplStat: function(body, schema, target) {
                var self = this;                
                self.xpl.sendXplStat(
                        body,
                        schema,
			target
                );
        },
	
        /*
         *  Config xPL message
         */
        
        readConfig: function(callback) {
                var self = this;
                fs.readFile(self.configFile, { encoding: "utf-8"}, function (err, body) {
                        if (err) self._log("file "+self.configFile+" is empty ...");
                        else {
                            self.configHash = JSON.parse(body);
                        }
                });
        },

        sendConfig: function(callback) {
                var self = this;
                self._sendXplStat(self.configHash, 'prowl.config', '*');
        },
        
        writeConfig: function(evt) {
                var self = this;
		self.configHash.version = self.version;
                self.configHash.enable = evt.body.enable;
                self.configHash.apikey = evt.body.apikey;
                fs.writeFile(self.configFile, JSON.stringify(self.configHash), function(err) {
                        if (err) self._log("file "+self.configFile+" was not saved to disk ...");
			else self._sendXplStat(self.configHash, 'prowl.config', evt.header.source);
                });
        },
        
        /*
         *  Plugin specifics functions
         */
                
        push: function(evt){
		var self = this;
		var client = new Prowl(self.configHash.apikey);
		client.push(evt.body.description, evt.body.application, function( err, sms ){
			if (err) self._log("Prowl sms was not send to the API ..." + JSON.stringify(err));
			else self._sendXplStat(evt.body, 'prowl.basic', evt.header.source);
		});
        }	
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
