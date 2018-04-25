// Generated by CoffeeScript 1.10.0

/*
Compressed Texture Test
This test use two different formats of compressed textures to test how
the GPU decompress the textures (and which formats it supports).  Compressed
textures differ from normal textures as webgl cannot decompress them and
thus the raw byte values are sent directly to the GPU for decompression
This makes use of a variety of different webgl compressed texture extensions
 */

(function() {
  var CompressedTextureTest, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.CompressedTextureTest = CompressedTextureTest = (function() {
    var DDSTest, PVRTest, delta, geometry, startX, startY, textureRoot, xStop;

    textureRoot = 'three/textures/compressed';

    geometry = new THREE.BoxGeometry(150, 150, 150);

    startX = -400;

    xStop = Math.abs(startX);

    startY = -200;

    delta = 250;

    DDSTest = (function() {
      function DDSTest(id) {
        var cubemap1, cubemap2, cubemap3, i, len, loader, map1, map2, map3, map4, map5, map6, mat, mesh, ref, x, y;
        this.id = id;
        this.camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
        this.camera.position.z = 1000;
        this.scene = new THREE.Scene();

        /*
        This is how compressed textures are supposed to be used:
        
        DXT1 - RGB - opaque textures
        DXT3 - RGBA - transparent textures with sharp alpha transitions
        DXT5 - RGBA - transparent textures with full alpha range
         */
        this.materials = [];
        loader = new THREE.DDSLoader();
        map1 = loader.load(textureRoot + "/disturb_dxt1_nomip.dds");
        map1.minFilter = map1.magFilter = THREE.LinearFilter;
        map1.anisotropy = 4;
        map2 = loader.load(textureRoot + "/disturb_dxt1_mip.dds");
        map2.anisotropy = 4;
        map3 = loader.load(textureRoot + "/hepatica_dxt3_mip.dds");
        map3.anisotropy = 4;
        map4 = loader.load(textureRoot + "/explosion_dxt5_mip.dds");
        map4.anisotropy = 4;
        map5 = loader.load(textureRoot + "/disturb_argb_nomip.dds");
        map5.minFilter = map5.magFilter = THREE.LinearFilter;
        map5.anisotropy = 4;
        map6 = loader.load(textureRoot + "/disturb_argb_mip.dds");
        map6.anisotropy = 4;
        cubemap1 = loader.load(textureRoot + "/Mountains.dds", (function(_this) {
          return function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            return _this.materials[0].needsUpdate = true;
          };
        })(this));
        cubemap2 = loader.load(textureRoot + "/Mountains_argb_mip.dds", (function(_this) {
          return function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            return _this.materials[1].needsUpdate = true;
          };
        })(this));
        cubemap3 = loader.load(textureRoot + "/Mountains_argb_nomip.dds", (function(_this) {
          return function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            return _this.materials[2].needsUpdate = true;
          };
        })(this));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map1,
          envMap: cubemap1
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          envMap: cubemap2
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          envMap: cubemap3
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map2
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map3,
          alphaTest: 0.5,
          side: THREE.DoubleSide
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map4,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map5
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: map6
        }));
        this.meshes = [];
        x = startX;
        y = startY;
        ref = this.materials;
        for (i = 0, len = ref.length; i < len; i++) {
          mat = ref[i];
          mesh = new THREE.Mesh(geometry, mat);
          mesh.position.x = x;
          mesh.position.y = y;
          this.scene.add(mesh);
          this.meshes.push(mesh);
          x += delta;
          if (x > xStop) {
            y += delta;
            x = startX;
          }
        }
      }

      DDSTest.prototype.begin = function(canvas, cb) {
        var animate;
        this.cb = cb;
        this.renderer = new THREE.WebGLRenderer({
          context: getGL(canvas),
          canvas: canvas
        }, false);
        this.renderer.setClearColor('#050505');
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(canvas.width, canvas.height);
        this.counter = 0;
        animate = (function(_this) {
          return function() {
            var frame, i, len, mesh, ref, time;
            frame = raf(animate);
            time = _this.counter++ * 0.01;
            ref = _this.meshes;
            for (i = 0, len = ref.length; i < len; i++) {
              mesh = ref[i];
              mesh.rotation.x = time;
              mesh.rotation.y = time;
            }
            _this.renderer.render(_this.scene, _this.camera);
            if (_this.counter === 10) {
              caf(frame);
              sender.getData(canvas, _this.id);
              return _this.cb();
            }
          };
        })(this);
        return raf(animate);
      };

      return DDSTest;

    })();

    PVRTest = (function() {
      function PVRTest(id) {
        var disturb_2bpp_rgb, disturb_4bpp_rgb, disturb_4bpp_rgb_mips, disturb_4bpp_rgb_v3, flare_2bpp_rgba, flare_4bpp_rgba, i, len, loader, mat, mesh, park3_cube_mip_2bpp_rgb_v3, park3_cube_nomip_4bpp_rgb, ref, x, y;
        this.id = id;
        this.camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
        this.camera.position.z = 1500;
        this.scene = new THREE.Scene();
        this.materials = [];
        loader = new THREE.PVRLoader();
        disturb_4bpp_rgb = loader.load(textureRoot + "/disturb_4bpp_rgb.pvr");
        disturb_4bpp_rgb_v3 = loader.load(textureRoot + "/disturb_4bpp_rgb_v3.pvr");
        disturb_4bpp_rgb_mips = loader.load(textureRoot + "/disturb_4bpp_rgb_mips.pvr");
        disturb_2bpp_rgb = loader.load(textureRoot + "/disturb_2bpp_rgb.pvr");
        flare_4bpp_rgba = loader.load(textureRoot + "/flare_4bpp_rgba.pvr");
        flare_2bpp_rgba = loader.load(textureRoot + "/flare_2bpp_rgba.pvr");
        park3_cube_nomip_4bpp_rgb = loader.load(textureRoot + "/park3_cube_nomip_4bpp_rgb.pvr", (function(_this) {
          return function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            return _this.meshes[0].needsUpdate = true;
          };
        })(this));
        park3_cube_mip_2bpp_rgb_v3 = loader.load(textureRoot + "/park3_cube_mip_2bpp_rgb_v3.pvr", (function(_this) {
          return function(texture) {
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            texture.mapping = THREE.CubeReflectionMapping;
            return _this.meshes[1].needsUpdate = true;
          };
        })(this));
        disturb_2bpp_rgb.minFilter = disturb_2bpp_rgb.magFilter = flare_4bpp_rgba.minFilter = flare_4bpp_rgba.magFilter = disturb_4bpp_rgb.minFilter = disturb_4bpp_rgb.magFilter = disturb_4bpp_rgb_v3.minFilter = disturb_4bpp_rgb_v3.magFilter = flare_2bpp_rgba.minFilter = flare_2bpp_rgba.magFilter = THREE.LinearFilter;
        this.materials.push(new THREE.MeshBasicMaterial({
          envMap: park3_cube_nomip_4bpp_rgb
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          envMap: park3_cube_mip_2bpp_rgb_v3
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: disturb_4bpp_rgb
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: disturb_4bpp_rgb_mips
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: disturb_2bpp_rgb
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: flare_4bpp_rgba,
          side: THREE.DoubleSide,
          depthTest: false,
          transparent: true
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: flare_2bpp_rgba,
          side: THREE.DoubleSide,
          depthTest: false,
          transparent: true
        }));
        this.materials.push(new THREE.MeshBasicMaterial({
          map: disturb_4bpp_rgb_v3
        }));
        this.meshes = [];
        x = startX;
        y = startY;
        ref = this.materials;
        for (i = 0, len = ref.length; i < len; i++) {
          mat = ref[i];
          mesh = new THREE.Mesh(geometry, mat);
          mesh.position.x = x;
          mesh.position.y = y;
          this.scene.add(mesh);
          this.meshes.push(mesh);
          x += delta;
          if (x > xStop) {
            y += delta;
            x = startX;
          }
        }
      }

      PVRTest.prototype.begin = function(canvas, cb) {
        var animate;
        this.cb = cb;
        this.renderer = new THREE.WebGLRenderer({
          context: getGL(canvas),
          canvas: canvas
        }, false);
        this.renderer.setClearColor('#050505');
        this.renderer.setPixelRatio(1);
        this.renderer.setSize(canvas.width, canvas.height);
        this.counter = 0;
        animate = (function(_this) {
          return function() {
            var frame, i, len, mesh, ref, time;
            frame = raf(animate);
            time = _this.counter++ * 0.001;
            ref = _this.meshes;
            for (i = 0, len = ref.length; i < len; i++) {
              mesh = ref[i];
              mesh.rotation.x = time;
              mesh.rotation.y = time;
            }
            _this.renderer.render(_this.scene, _this.camera);
            if (_this.counter === 10) {
              caf(frame);
              sender.getData(canvas, _this.id);
              return _this.cb();
            }
          };
        })(this);
        return raf(animate);
      };

      return PVRTest;

    })();

    function CompressedTextureTest() {
      if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
      }
      this.tests = [];
      this.tests.push(new DDSTest(sender.getID()));
      this.tests.push(new PVRTest(sender.getID()));
    }

    CompressedTextureTest.prototype.begin = function(canvas1, cb) {
      var tester;
      this.canvas = canvas1;
      this.cb = cb;
      this.index = 0;
      tester = (function(_this) {
        return function() {
          if (_this.index === _this.tests.length) {
            return _this.cb();
          } else {
            return _this.tests[_this.index++].begin(_this.canvas, tester);
          }
        };
      })(this);
      return tester();
    };

    return CompressedTextureTest;

  })();

}).call(this);
