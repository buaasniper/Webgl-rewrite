// Generated by CoffeeScript 1.10.0
(function() {

  var Loader, createCopyButton, mobileAndTabletCheck, root;

  root = typeof exports !== "undefined" && exports !== null ? exports : this;

  root.createCopyButton = createCopyButton = function(text, home) {
    var clipboard;
    clipboard = new Clipboard('.btn');
    clipboard.on('success', function(e) {
      var trigger;
      e.clearSelection();
      trigger = $(e.trigger);
      if (trigger.attr('data-toggle') === 'tooltip') {
        trigger.attr('data-original-title', "Coppied").tooltip('fixTitle').tooltip('show');
        return setTimeout(function() {
          return trigger.tooltip('hide');
        }, 1000);
      }
    });
    clipboard.on('error', function(e) {
      var trigger;
      trigger = $(e.trigger);
      if (trigger.attr('data-toggle') === 'tooltip') {
        trigger.attr('data-original-title', "Press Cmd+C to copy").tooltip('fixTitle').tooltip('show');
        return setTimeout(function() {
          return trigger.tooltip('hide');
        }, 3000);
      }
    });
    return $("<button type='button' class='btn btn-default' data-clipboard-action='copy' data-clipboard-text='" + text + "' data-toggle='tooltip' data-trigger='manual' data-placement='auto' data-html='true' >Copy</button>").tooltip().appendTo($(home));
  };

  root.mobileAndTabletCheck = mobileAndTabletCheck = function() {
    return (function(a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
        return true;
      } else {
        return false;
      }
    })(navigator.userAgent || navigator.vendor || window.opera);
  };

  Loader = (function() {
    function Loader() {
      var colorName, colorName1, simpleName, susanName;
      this.parseURL();
      //this.checkID();
      this.numberOfAssets = 0;
      this.numLoaded = 0;
      susanName = './assets/Susan.json';
      simpleName = './assets/simple.json';
      colorName = './assets/color.png';
      colorName1 = './assets/color2.png';
      this.loadJSONResource(susanName, (function(_this) {
        return function(err, susanModel) {
          _this.susanModel = susanModel;
          if (err) {
            alert('error getting susan model');
            console.log(err);
          } else {
            _this.assetLoaded();
          }
          return true;
        };
      })(this));
      this.loadJSONResource(simpleName, (function(_this) {
        return function(err, simpleModel) {
          _this.simpleModel = simpleModel;
          if (err) {
            alert('error getting simpleModel');
            console.log(err);
          } else {
            _this.assetLoaded();
          }
          return true;
        };
      })(this));
      this.loadImage(colorName, (function(_this) {
        return function(err, texture) {
          _this.texture = texture;
          if (err) {
            alert('error getting color.png');
            console.log(err);
          } else {
            _this.assetLoaded();
          }
          return true;
        };
      })(this));
      this.loadImage(colorName1, (function(_this) {
        return function(err, texture1) {
          _this.texture1 = texture1;
          if (err) {
            alert('error getting colors.png');
            console.log(err);
          } else {
            _this.assetLoaded();
          }
          return true;
        };
      })(this));
    }

    Loader.prototype.parseURL = function() {
      var c, j, len, ref, seq;
      this.url = document.URL;
      this.parser = document.createElement('a');
      this.parser.href = this.url;
      this.commands = this.parser.search;
      this.requests = {};
      if (this.commands) {
        ref = this.commands.slice(1).split('&');
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          seq = c.split('=');
          this.requests[seq[0]] = seq[1];
        }
      }
      return root.requests = this.requests;
    };

    Loader.prototype.assetLoaded = function() {
      this.numLoaded++;
      if (this.numLoaded === this.numberOfAssets) {
        return this.beginTests();
      }
    };

    Loader.prototype.loadTextResource = function(url, callback) {
      var request;
      ++this.numberOfAssets;
      request = new XMLHttpRequest();
      request.open('GET', url + "?please-dont-cache=" + (Math.random()), true);
      request.onload = function() {
        if (request.status < 200 || request.status > 299) {
          return callback("Error: HTTP Status " + request.status + " on resource " + url);
        } else {
          return callback(null, request.responseText);
        }
      };
      request.send();
      return true;
    };

    Loader.prototype.loadImage = function(url, callback) {
      var image;
      ++this.numberOfAssets;
      image = new Image();
      image.onload = function() {
        return callback(null, image);
      };
      image.src = url;
      return true;
    };

    Loader.prototype.loadJSONResource = function(url, callback) {
      this.loadTextResource(url, function(err, result) {
        var e, error;
        if (err) {
          return callback(err);
        } else {
          try {
            return callback(null, JSON.parse(result));
          } catch (error) {
            e = error;
            return callback(e);
          }
        }
      });
      return true;
    };

    Loader.prototype.beginTests = function() {
      var Tester, canvasContainer, d, i, index, j, k, l, len, maxFirst, postProgress, ref, ref1, ref2, ref3, ref4, ref5, sender, test, vert;
      this.susanVertices = this.susanModel.meshes[0].vertices;
      this.susanIndices = [].concat.apply([], this.susanModel.meshes[0].faces);
      this.susanTexCoords = this.susanModel.meshes[0].texturecoords[0];
      this.susanNormals = this.susanModel.meshes[0].normals;
      this.simpleVertices = (function() {
        var j, len, ref, results;
        ref = this.simpleModel.meshes[0].vertices;
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          vert = ref[j];
          results.push(vert / 20.0);
        }
        return results;
      }).call(this);
      this.simpleIndices = [].concat.apply([], this.simpleModel.meshes[0].faces);
      this.simpleTexCoords = this.simpleModel.meshes[0].texturecoords[0];
      this.simpleNormals = this.simpleModel.meshes[0].normals;
      this.combinedVertices = new Array(this.simpleIndices.length + this.susanIndices.length);
      for (i = j = 0, ref = this.susanVertices.length; j < ref; i = j += 3) {
        this.combinedVertices[i + 0] = this.susanVertices[i + 0];
        this.combinedVertices[i + 1] = this.susanVertices[i + 1] + 1.3;
        this.combinedVertices[i + 2] = this.susanVertices[i + 2];
      }
      for (i = k = 0, ref1 = this.simpleVertices.length; k < ref1; i = k += 3) {
        this.combinedVertices[i + 0 + this.susanVertices.length] = this.simpleVertices[i + 0];
        this.combinedVertices[i + 1 + this.susanVertices.length] = this.simpleVertices[i + 1] - 1.3;
        this.combinedVertices[i + 2 + this.susanVertices.length] = this.simpleVertices[i + 2];
      }
      this.combinedIndices = new Array(this.simpleIndices.length + this.susanIndices.length);
      [].splice.apply(this.combinedIndices, [0, this.susanIndices.length - 0].concat(ref2 = this.susanIndices)), ref2;
      maxFirst = this.susanIndices.reduce(function(a, b) {
        return Math.max(a, b);
      });
      [].splice.apply(this.combinedIndices, [(ref3 = this.susanIndices.length), this.combinedIndices.length - ref3].concat(ref4 = (function() {
        var l, len, ref5, results;
        ref5 = this.simpleIndices;
        results = [];
        for (l = 0, len = ref5.length; l < len; l++) {
          index = ref5[l];
          results.push(index + 1 + maxFirst);
        }
        return results;
      }).call(this))), ref4;
      this.combinedTexCoords = this.susanTexCoords.concat(this.simpleTexCoords);
      this.combinedNormals = this.susanNormals.concat(this.simpleNormals);
      this.testList = [];
      root.sender = sender = new Sender();
      
      //this.testList.push(new CubeTest('normal'));
      //this.testList.push(new CubeTest('aa'));
      //this.testList.push(new CameraTest());     
      //this.testList.push(new LineTest('normal'));
      
      //this.testList.push(new LineTest('aa'));
      this.testList.push(new TextureTest(this.susanVertices, this.susanIndices, this.susanTexCoords, this.texture));
      this.testList.push(new TextureTest(this.combinedVertices, this.combinedIndices, this.combinedTexCoords, this.texture));
      
      /* this.testList.push(new SimpleLightTest(this.susanVertices, this.susanIndices, this.susanTexCoords, this.susanNormals, this.texture));
      this.testList.push(new SimpleLightTest(this.combinedVertices, this.combinedIndices, this.combinedTexCoords, this.combinedNormals, this.texture));
      this.testList.push(new MoreLightTest(this.combinedVertices, this.combinedIndices, this.combinedTexCoords, this.combinedNormals, this.texture));
      this.testList.push(new TwoTexturesMoreLightTest(this.combinedVertices, this.combinedIndices, this.combinedTexCoords, this.combinedNormals, this.texture, this.texture1));
      this.testList.push(new TransparentTest(this.combinedVertices, this.combinedIndices, this.combinedTexCoords, this.combinedNormals, this.texture));
      this.testList.push(new LightingTest());
      this.testList.push(new ClippingTest());
      this.testList.push(new BubbleTest());
      this.testList.push(new CompressedTextureTest());
      this.testList.push(new ShadowTest());*/
      
      this.asyncTests = [];
      //language detection is done by another js file
      //this.asyncTests.push(new LanguageDector());
      sender.finalized = true;
      this.numberOfTests = this.testList.length + this.asyncTests.length;
      this.numComplete = 0;
      postProgress = (function(_this) {
        return function() {
          progress(++_this.numComplete / _this.numberOfTests * 90.0);
          if (_this.numComplete === _this.numberOfTests) {
            if (_this.requests['demo'] === "True") {
              $('body canvas').remove();
            }
            return sender.sendData();
          }
        };
      })(this);
      d = 256;
      Tester = (function() {
        function Tester(testList, dest) {
          var testDone;
          this.testList = testList;
          this.canvas = $("<canvas width='" + d + "' height='" + d + "'/>").appendTo(dest)[0];
          this.numTestsComplete = 0;
          testDone = (function(_this) {
            return function() {
              _this.numTestsComplete++;
              postProgress();
              if (_this.numTestsComplete < _this.testList.length) {
                return _this.testList[_this.numTestsComplete].begin(_this.canvas, testDone);
              }
            };
          })(this);
          this.testList[0].begin(this.canvas, testDone);
        }

        return Tester;

      })();
      canvasContainer = this.requests['demo'] === "True" ? $('body') : $('#test_canvases');
      $("<canvas id='can_aa' width='" + d + "' height='" + d + "'/>").appendTo(canvasContainer);
      new Tester(this.testList, canvasContainer);
      ref5 = this.asyncTests;
      for (l = 0, len = ref5.length; l < len; l++) {
        test = ref5[l];
        test.begin(postProgress);
      }
      return true;
    };

    return Loader;

  })();

  $(function() {
    var loader;
    return loader = new Loader();
  });

}).call(this);
