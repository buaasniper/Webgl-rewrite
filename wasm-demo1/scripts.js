let squarer;

window.addEventListener('message',function(event) {  
  console.log('receive')
  console.log(event);

  //cal part
  loadWebAssembly('test_version1.wasm')
  .then(instance => {
    squarer = instance.exports._Z7squareri;
    console.log('Finished compiling! Ready when you are...');
    console.log('11111');
    console.log(squarer(5));
    console.log(squarer(10));
    console.log(squarer(15));

  }); 


  //send back
  event.source.postMessage('holla back youngin!',event.origin);
},false);  


function loadWebAssembly(fileName) {
  return fetch(fileName)
    .then(response => response.arrayBuffer())
    .then(buffer => WebAssembly.compile(buffer))
    .then(module => {return new WebAssembly.Instance(module) });
};
  
