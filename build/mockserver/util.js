const cookies = (req, cookieName) => {
    var strCookie = req.headers.cookie;
    if (!strCookie) return '';
    var arrCookie = strCookie.split("; ");
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (cookieName == arr[0]) {
            return arr[1];
        }
    }
    return "";
}
const success = (res, data, msg = null) =>{
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(JSON.stringify({ code: 1, data: data, msg: msg }))
    res.end()
}
const failure = (res, error)=> {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(JSON.stringify({ code: 2, data: null, msg: error.toString() }))
    res.end()
}
const forbidden = (res, error)=> {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(JSON.stringify({ code: 3, data: null, msg: error.toString() }))
    res.end()
}
const notAuth = res => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.write(JSON.stringify({ code: 6, data: null, msg:'无权限'}))
    res.end()    
}
module.exports ={
    cookies,
    success,
    failure,
    forbidden,
    notAuth
}