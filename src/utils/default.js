console.log = console.group = () => { }
FormData.prototype.appendObject = function (obj, except) {
  except = except || []
  for (var key in obj) {
    if (!except.Contains(key))
      this.append(key, obj[key])
  }
}
Array.prototype.loopCallback = function (callback, reverse, index) {
  var arr = this;
  function retCallback(timeout) {
    timeout = timeout || 0;
    setTimeout(function () {
      arr.loopCallback(callback, reverse, index + 1);
    }, timeout);
  }
  function retCallbackReverse(timeout) {
    timeout = timeout || 0;
    setTimeout(function () {
      if (index > 0)
        arr.loopCallback(callback, reverse, index);
    }, timeout);
  }
  if (reverse) {
    index = index || arr.length;
    index--;
    callback(arr[index], index, retCallbackReverse);
  } else {
    index = index || 0;
    if (index < arr.length) {
      callback(arr[index], index, retCallback);
    }
  }
}
String.prototype.isBool = function () {
  return this.length < 4 && this.Contains("true");
}
String.prototype.Contains = Array.prototype.Contains = function (element) {
  return this.indexOf(element) > -1;
}
String.prototype.getRawUrl = function () {
  var str = decodeURI(this)
  var url = str.split("?")[0]
  return url;
}
String.prototype.getParamFromUrl = function () {
  var query = this
  query = query.substring(query.indexOf('?') + 1);

  var re = /([^&=]+)=?([^&]*)/g;
  var decodeRE = /\+/g;

  var decode = function (str) {
    return decodeURIComponent(str.replace(decodeRE, " "));
  };

  var params = {}, e;
  while (e = re.exec(query)) {
    var k = decode(e[1]), v = decode(e[2]);
    if (k.substring(k.length - 2) === '[]') {
      k = k.substring(0, k.length - 2);
      (params[k] || (params[k] = [])).push(v);
    }
    else params[k] = v;
  }

  var assign = function (obj, keyPath, value) {
    var lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
      var key = keyPath[i];
      if (!(key in obj))
        obj[key] = {}
      obj = obj[key];
    }
    obj[keyPath[lastKeyIndex]] = value;
  }

  for (var prop in params) {
    var structure = prop.split('[');
    if (structure.length > 1) {
      var levels = [];
      structure.forEach(function (item, i) {
        var key = item.replace(/[?[\]\\ ]/g, '');
        levels.push(key);
      });
      assign(params, levels, params[prop]);
      delete (params[prop]);
    }
  }
  return params;
}
Math.randomInt = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}