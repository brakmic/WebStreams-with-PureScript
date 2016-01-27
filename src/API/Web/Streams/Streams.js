
// module API.Web.Streams

//********************************************************************************************
//This is an `old-style` ECMAScript 5 script file describing the needed
//`foreign import` interfaces for PureScript.
//There's no need for any more powerful stuff as this is just a simple demo. A
//Currently, don't need any extra machinery like Babel or WebPack plugins to transpile it.
//********************************************************************************************

//Function: log raw data to console
//Helper function to log all object regardless of type.
//Useful for quick debugging when working with PureScript.
var logRaw = function(str) {
  return function() {
    console.log(str);
    return {};
  };
};

//Function        : read data from web-stream
//Param, url      : resource to read from
//Param, callback : a PureScript-function to be called for each stream chunk
var read = function(url){
  return function(callback){
    return function(decoder){
      return function(){
        var _fetch = fetch(url).then(function(response){
          var reader = response.body.getReader();
          var bytesReceived = 0;
          var complete = null;
          //if there's no valid decoder a Default-Decoder will be created
          var decoder = decoder ? decoder : getDecoder('utf8')({ fatal: true })();
          //Unlike the original demo from https://jakearchibald.com/2016/streams-ftw/
          //we `return` the Promise which will be later resolved within a wrapper function.
          //This is important as we play between JavaScript & PureScript worlds which handle
          //functions completely differently. One of the most important things is that there
          //are no functions with multiple arguments in PureScript. All functions are curried.
          //That's why we have to `convert` them into nested `one-argument` JS-functions.
          return reader.read().then(function processResult(result){
                  var current = null;
                  if(result.done){
                    console.log('Fetch completed reading of ' + bytesReceived + ' bytes.');
                    return complete;
                  }
                  bytesReceived += result.value.length;
                  //current = decodeToText(result.value)();
                  current = decoder.decode(result.value, { stream : true});
                  complete += current;
                  callback(current)();  //we need extra () when calling from PS
                  return reader.read().then(processResult);
                });

        }).catch(function(err){
          console.log('Error while fetching data from ' + url + ', message: ' + err);
        });
        wrapper(_fetch)();  //Execute wrapper by giving it the `fetch` function.
                            //Also, notice the additional pair of (). This is because we have to
                            //execute the wrapper + the Promise itself. PureScript knows nothing about
                            //multi-parameter functions. All PS-functions are curried.
        return {};
      };
    };
  };
};

//Function: decode-text wrapper
//This is a PureScript-acceptable way of calling functions
//Currently not used directly on PureScript's side.
var decodeToText = function(data){
  return function(){
    try {
      var decoder = new TextDecoder();
      return decoder.decode(data, { stream : true });
    } catch(e) {
      return function(e){
        console.log('Error in decodeToText: ' + e);
      }
    }
  };
};
//Create a new decoder
//more info: https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder
var getDecoder = function(utfLabel){
  return function(options){
    return function(){
        var decoder = null;
        if(utfLabel &&
          utfLabel.constructor &&
          utfLabel.constructor.name != 'Nothing'){
            if(options &&
              options.constructor &&
              options.constructor.name != 'Nothing'){
            decoder = new TextDecoder(utfLabel.value0, options.value0);
          }else{
            decoder = new TextDecoder(utfLabel.value0);
          }
        }else{
          decoder = new TextDecoder('utf8', { fatal : true });
        }
        return decoder;
    };
  };
};

//For decoding of byte chunks. If there's no valid decoder supplied
//a new one will be created with settings: 'utf8' & {fatal:true})
var decode = function(data){
  if(!data ||
    (data.constructor &&
      data.constructor.name == 'Nothing')){
      return null;
  }
  return function(decoder){
    return function(){
      if(decoder &&
        decoder.constructor &&
        decoder.constructor.name != 'Nothing'){
        return decoder.value0.decode(data.value0, { stream : true });
      }else{
        decoder = getDecoder('utf8')({ fatal : true })();
        return decoder.decode(data.value0, { stream : true });
      }
    };
  };
};

//Function: Wrapper
var wrapper = function(val){
  return function(){
    val.then(function(v){
      //do nothing, for now...
    }).catch(function(err){
      console.error(err);
    });
    return {};
  };
};
//foreign imports are just simple CommonJS exports
module.exports = {
  read       : read,
  getDecoder : getDecoder,
  decode     : decode,
  logRaw     : logRaw
};