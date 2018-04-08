/***
* This test uses a cube texture which is a different type of texture
* that uses 6 images to simulate a 3D texture.  This test also utilizes
* bubbles that are modeled using a Fersnel Shader
***/

var BubbleTest = function() {
  var ID = sender.getID();

  Math.seedrandom("Three.js bubble scene random seed");


  if (!Detector.webgl)
    Detector.addGetWebGLMessage();

  var camera, scene, renderer;

  var mesh, zmesh, lightMesh, geometry;
  var spheres = [];

  var directionalLight, pointLight;

  init();

  function init() {

    // texture 和 标准 摄像机
  __ColorFlag = 0;  
  __Mworld_flag = 1;
  __Mview_flag = 1;
  __Mpro_flag = 1;
  __Drawnumber = 1

    camera = new THREE.PerspectiveCamera(60, 256 / 256, 1, 100000);
    camera.position.z = 3200;

    //

    var path = "three/textures/cube/Park2/";
    var format = '.jpg';
    var urls = [
      path + 'posx' + format, path + 'negx' + format, path + 'posy' + format,
      path + 'negy' + format, path + 'posz' + format, path + 'negz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load(urls);
    textureCube.format = THREE.RGBFormat;

    scene = new THREE.Scene();
    scene.background = textureCube;

    //

    var geometry = new THREE.SphereGeometry(100, 32, 16);

    var shader = THREE.FresnelShader;
    var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    uniforms["tCube"].value = textureCube;

    var material = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : shader.vertexShader,
      fragmentShader : shader.fragmentShader
    });

    for (var i = 0; i < 100; i++) {

      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = Math.random() * 10000 - 5000;
      mesh.position.y = Math.random() * 10000 - 5000;
      mesh.position.z = Math.random() * 10000 - 5000;
      console.log (" mesh.position.x", mesh.position.x);
      console.log("mesh.position.y", mesh.position.y);
      console.log("mesh.position.z", mesh.position.z);
      mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

      scene.add(mesh);
      //console.log ("mesh", mesh);
      spheres.push(mesh);
    }
    console.log("point value", i * 3);

    scene.matrixAutoUpdate = false;
  }

  this.begin = function(canvas, cb, value) {
    renderer =
        new THREE.WebGLRenderer({context : getGL(canvas), canvas : canvas}, false);
    renderer.setPixelRatio(1);
    renderer.setSize(canvas.width, canvas.height);

    var freq = 5;
    var radius = 500;
    var count = 0;
    function render() {
      var frame = requestAnimationFrame(render);

      var timer = 0.005 * count++;
      var deltaX = (radius * Math.sin(freq * timer) - camera.position.x) * 0.5;
      var deltaY = (radius * Math.cos(freq * timer) - camera.position.y) * 0.5;
      if (!isNaN(deltaX) && !isNaN(deltaY)) {
        camera.position.x += deltaX;
        camera.position.y += deltaY;
      }

      camera.lookAt(scene.position);

      for (var i = 0, il = spheres.length; i < il; i++) {

        var sphere = spheres[i];

        sphere.position.x = 5000 * Math.cos(timer + i);
        sphere.position.y = 5000 * Math.sin(timer + i * 1.1);
        
      }
      console.log("spheres.length",spheres.length)
      renderer.render(scene, camera);

      if (count == 5) {
        cancelAnimationFrame(frame);
        sender.getData(renderer.getContext(), ID);
        cb(value);
      }
    }

    requestAnimationFrame(render);
  }
}
