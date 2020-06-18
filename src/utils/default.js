import { isValidElement, cloneElement } from 'react';
console.warn = console.log = console.group = () => { }
FormData.prototype.appendObject = function (obj, except) {
  except = except || []
  for (var key in obj) {
    if (!except.Contains(key))
      this.append(key, obj[key])
  }
}
Array.generateEmpty = function (length, empty) {
  return Array.from(new Array(length), function (a, i) { return empty ? '' : i })
}
Array.prototype.rMap = function (callback) {
  return this.map(function (data, key) {
    let cb = callback(data, key)
    if (isValidElement(cb)) {
      cb = cloneElement(cb, { key })
    }
    return cb
  })
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
Number.prototype.format = function (n, x) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
}
String.prototype.validURL = function () {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(this);
}
String.prototype.generateInitial = function () {
  var name = this.split(' ');
  if (this.length == 3) {
    return this.toUpperCase()
  }
  if (name.length > 1) {
    return name[0][0].toUpperCase() + name[1][0].toUpperCase()
  }
  return name[0][0].toUpperCase() + name[0][1]
}
String.prototype.ucfirst = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.lcfirst = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
}
String.prototype.ucwords = function () {
  return this.toLowerCase().replace(/\b[a-z]/g, function (letter) {
    return letter.toUpperCase();
  });
}
String.prototype.isBool = function () {
  return this.length < 4 && this.Contains("true");
}
String.prototype.Contains = Array.prototype.Contains = function (element) {
  return this.indexOf(element) > -1;
}
String.prototype.convertRupiah = Number.prototype.convertRupiah = function () {
  return "Rp. " + parseInt(this).format(0, 3)
}
String.prototype.extractNumber = Number.prototype.extractNumber = function () {
  var str = this.toString()
  try {
    var matches = str.match(/(-?|-\s+?)\d+/g);
    if (matches.length > 0)
      return matches.join('').replace(/\s/g, '').toInt()
  } catch (e) {
    return 0
  }
  return 0
}
String.prototype.getRawUrl = function () {
  var str = decodeURI(this)
  var url = str.split("?")[0]
  return url;
}
String.prototype.toInt = function () {
  return Number(this)
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