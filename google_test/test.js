
rewrite = function(gl){
    var flag1 = 0;
    var flag2 = 0;
    gl.my_bindBuffer = gl.__proto__.bindBuffer;
    gl.bindBuffer = function (bufferType, bufferName){
        // console.log(flag1++,bufferType,bufferName);
        gl.my_bindBuffer(bufferType, bufferName);
    }

    gl.my_glbufferData = gl.__proto__.bufferData;
    gl.bufferData = function (a, bufferData, c){
        console.log(flag2++, a, bufferData, c);
        gl.my_glbufferData(a, bufferData, c);
    } 


    gl.my_shaderSource = gl.__proto__.shaderSource;
    gl.shaderSource = function(a, b){
        console.log(b);
        gl.my_shaderSource(a,b);
    }

    gl.my_drawElements = gl.__proto__.drawElements;
    gl.drawElements = function(mode, count, type, offset){
        var t0 = performance.now();
        var j = Math.random()*3;
        while (performance.now() - t0 < j);

        gl.my_drawElements(mode, count, type, offset);
    }



    return gl;
}
