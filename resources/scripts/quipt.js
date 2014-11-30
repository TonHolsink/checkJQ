/**
 * qUIpt - caching in the name of performance
 *
 * @author  Mario Heiderich <mario.heiderich@gmail.com>
 * @author  Will Huang <doggy.huang@gmail.com>
 * @license LGPL
 * 
 * $Date: 2011-04-19 15:37:12 $
 * $Rev: $
 */
(function quipt_init() {

    /**
     * the config object
     */
    var quipt_config = {
        
        /**
         * the method to call when loading is done 
         * 
         * example: 'starter' : 'my_init_function'
         *
         * hint: set it to false if not needed
         */
        'starter' : false, 
        
        /**
         * add files to load to this array
         * 
         * hint: you can add as many files as you wish - as long as they 
         *       come from the same domain. quipt also supports proxied 
         *       off-domain scripts.
         */
        'files'   : [
            '/scripts/global.js',
            '/scripts/builder.js',
            '/scripts/effects.js',
            '/scripts/dragdrop.js',
            '/scripts/controls.js',
            '/scripts/slider.js'
	 ],
        
        /**
         * don't touch this - private stuff! else!
         */
        'status' : 0
    };
    
    var quipt_code = [];

    /**
     * the loader method - it monitors the status of the ressource 
     * fetching and kick-starts the XHR method
     * 
     */
    var quipt_load = function() {
        quipt_request();
    };   
    
    /**
     * this method just fires XHR requests against the files given in the 
     * config literal until all ressources are fetched
     * 
     */
    var quipt_request = function() {
            var x = new XMLHttpRequest || function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            };
            x.open('GET', quipt_config.files[quipt_config.status], true);
            x.send(null);
            x.onreadystatechange = function() {
                if(x.readyState == 4 && x.status == 200) {
                    quipt_code.push(x.responseText);
                    quipt_config.status++;
                    self.name += x.responseText + ';\n';
                    if(quipt_config.status < quipt_config.files.length) {
                        quipt_request();
                    } else {
                    	quipt_eval();
                    }
                }
            };
        };   
            
        /**
         * the eval method - which is called if window.name contains 
         * the right data
         */
        var quipt_eval = function() {
            self.eval(self.name);
            if(quipt_config.starter) {
                var to = setTimeout(function(){    
				    self[quipt_config.starter]();
			    }, 125);
            }
        };
		
		/**
		 * the flush method - once called the cache is being emptied
		 */
		var quipt_flush = function() {
			self.name = '';
		};
        
        /**
         * some security checks to avoid arbitrary off-site
         * self.name poisoning
         */
        if(document.referrer == '' || document.referrer.match(/\w+:\/\/[^\/]+/)[0] 
            !== location.href.match(/\w+:\/\/[^\/]+/)[0]) {
            quipt_flush();
        }
		var links = document.getElementsByTagName('a')
		for (var i=0;i<links.length;i++) {
		    (links[i].target.match(/\W/))?quipt_flush():false;
		}; 		
        
        /**
         * let's start
         */
        if(!self.name.length) {
            quipt_load();
        } else {
            quipt_eval();
        }
    })();
