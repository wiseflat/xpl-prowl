var Xpl = require('xpl-api');
var Prowl = require('node-prowl');
var fs = require('fs');

function wt(device, options) {
	options = options || {};
	this._options = options;
	this.hash = [];

	options.xplSource = options.xplSource || "bnz-prowl.wiseflat";

	this.xpl = new Xpl(options);
        this.client = new Prowl(options.prowlapi);
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
        
        _push: function(evt){
            var self = this;
            self.client.push(evt.body.description, evt.body.application, function( error, sms ){
                    //if( error ) throw error;
                    //console.log( 'I have ' + sms + ' calls to the api during current hour. BOOM!' );
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
        
        _config: function(evt) {
                var self = this;
                fs.writeFile("/tmp/test", "ahahah", function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("The file was saved!");
                        }
                }); 
        }
	
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
