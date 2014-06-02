module.exports = function simpleBarrier() {

   var requiredCallbacks = 0,
       doneCallbacks = 0,
       startTime = Date.now(),
       results = [];

   function defaultCallback(err, data) {
      return data;
   }
   
   var instance = {
      
      waitOn:function(callback){

         var callbackIndex = requiredCallbacks; 
         callback = callback || defaultCallback;
         
         requiredCallbacks++;

         return function(){
            var result = callback.apply(this,arguments);
            
            results[callbackIndex] = result;
            
            doneCallbacks++;

            if( requiredCallbacks === doneCallbacks ) {
               instance.duration = Date.now() - startTime;
               instance.finally(results);
            }
         }
      },
      
      finally: function(fn) {
         instance.finally = fn;
      }
   };

   return instance;
};
