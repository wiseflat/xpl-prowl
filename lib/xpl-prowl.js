var Xpl = require('xpl-api');
var Prowl = require('node-prowl');
var fs = require('fs');

function wt(device, options) {
	options = options || {};
	this._options = options;
	this.hash = [];

	options.xplSource = options.xplSource || "bnz-prowl.wiseflat";

	this.xpl = new Xpl(options);
};

module.exports = wt;

var proto = {
    
        _init: function(callback) {
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
        
        _push: function(body){
            var self = this;
            var client = new Prowl(body.apikey);
            client.push(body.description, body.application, function( error, sms ){
                    self._xplStatus(error, sms);
            });
        },
        
        _xplStatus: function(error, sms) {
                var self = this;
                self.xpl.sendXplStat({
                        currentsms: sms,
                        confirmation: error
                }, 'prowl.basic');
        },
        
        _config: function(body) {
                var self = this;
                fs.writeFile("/tmp/prowl.config", JSON.stringify(body), function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                }); 
        },
        
        _schema_prowl_basic: function(body) {
                var self = this;
                //if(!body.apikey || !body.apikey.match(/^[a-zA-Z0-9]{1,100}$/) ) {
                if (typeof body.apikey !== "undefined" && !body.apikey.match(/^[a-zA-Z0-9]{1,100}$/i) ) {
                        console.log("apikey invalid :"+body.apikey);
                        return false;
                }
                //if(!body.application || !body.application.match(/^[a-zA-Z0-9]{1,100}$/i) ) {
                if (typeof body.application !== "undefined" && !body.application.match(/^[a-zA-Z0-9]{1,100}$/i) ) {
                        console.log("application invalid :"+body.application);
                        return false;
                }
                if (typeof body.description == "undefined") {
                        console.log("description invalid :"+body.description);
                        return false;
                }
                return true;
        },
        
        _schema_prowl_config: function(body) {
                var self = this;
                //if(body.enable && !body.enable.match(/^[01]{1}$/i) ) {
                if (typeof body.enable !== "undefined" && !body.enable.match(/^[01]{1}$/i) ) {
                        console.log("enable invalid :"+body.enable);
                        return false;
                }
                return true;
        }
	
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
