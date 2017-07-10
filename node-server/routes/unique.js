exports.idGenerator = function(callback) {
    console.log("here");
		 this.length = 8;
		 this.timestamp = +new Date;
		 var _getRandomInt = function( min, max ) {
             console.log("atleataas");
			return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
		 }

			 var ts = this.timestamp.toString();
			 var parts = ts.split( "" ).reverse();
			 var id = "";
             console.log("bjdsd");
			 for( var i = 0; i < this.length; ++i ) {
                 console.log(i);
				var index = _getRandomInt( 0, parts.length - 1 );
				id += parts[index];
                if(i==this.length-1){
                    console.log("inside teh if");
                    console.log(id);
                    callback(id);
                }
			 }


}
