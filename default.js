String.prototype.getNameFromUrl = function() {
  var name = this.split("/"),  name = name[name.length - 1],  name = decodeURI(name);
  return name;
}
String.prototype.getParamFromUrl = function() {
  let ret = {}
  let params = this.split('?')[1].split('&')
  params.map(item=>{
    let a = item.split('=')
    ret[a[0]] = a[1]
  })
  return ret
}