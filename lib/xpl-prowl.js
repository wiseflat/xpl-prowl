var Xpl = require('xpl-api');
var Prowl = require('node-prowl');

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
        
        _push: function(message){
            var self = this;
            self.client.push(message.body.description, message.body.application, function( error, remaining ){
                    if( error ) throw error;
                    console.log( 'I have ' + remaining + ' calls to the api during current hour. BOOM!' );
                });
        }
}

for ( var m in proto) {
	wt.prototype[m] = proto[m];
}
