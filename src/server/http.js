import axios from 'axios'
axios.defaults.baseURL = config.baseUrl;
axios.defaults.timeout = 2000
const CancelToken = axios.CancelToken; //请求token

const Success = 1,notAuth = 6,notice = 4//业务请求正确code,无权限code,需要向下传递的错误代码

// 请求队列       当次标识   
var pending = [],cancelKey;

//请求过滤
let removePending = (config, fn) => {
    let flagUrl = config.url.replace(config.baseURL, '') + '&' + config.method
    if (pending.indexOf(flagUrl) !== -1) {
        if (fn) {
            fn('requset repeat')
        } else {
            pending.splice(pending.indexOf(flagUrl), 1)
        }
    } else {
        if (fn) {
            cancelKey = flagUrl;
            pending.push(flagUrl)
        }
    }
}
let errAlert = errMessage => {
    console.log(errMessage)
    // Vm.$Modal.error({
    //     title:'温馨提示',
    //     content: `<p>${errMessage}</p>`
    // });
}

// requst interceptor
axios.interceptors.request.use(req => {
    for(let key in config.heards){
        req.headers[key] = config.heards[key];
    }
    req.cancelToken = new CancelToken((fn) => {
        removePending(req, fn)
    });
    return req
}, error => {
    errAlert(error);
    return new Promise(() => {});
})

// response interceptor
axios.interceptors.response.use(response => {
    removePending(response.config);
    let result = response.data
    if (result.code === Success) { //正确请求      
        return result.data;
    }else if(result.code === notAuth && 'logonUrl' in config){
        window.location.href = config.logonUrl+window.location.href;
    }else if(result.code === notice){
        throw result.msg
    }
    errAlert(result.msg);        
    return new Promise(() => {});
}, error => {
    let showError;
    if (error && error.response) { //浏览器错误
        if (error.response.data.message) error.message = error.response.data.message
        removePending(error.response.config);
        showError = true;
    } else { //重复请求会被reject 但不需要被提示 直接过滤掉
        pending = [];
        showError = !(error && error.message && error.message === 'requset repeat');
        error && error.messgae ? '' : error.messgae = '请求错误,请刷新重试!' //无response的error对象容错处理
    }
    showError ? errAlert(error.message) : '';
    return new Promise(() => {});
})


export const get = (url, params) => {
    return axios({
        method: 'get',
        url,
        params: params
    })
}

export const post = (url, data) => {
    return axios({
        method: 'POST',
        url,
        data: data   
    })
}

export const jsop = function(url, callbackName) {
    if (!url) return new Error("url is jsonp request required")
    callbackName = callbackName || "callback_" + Date.now()
    url = url.indexOf("?") > 0 ? `${url}&callback=${callbackName}` : `${url}?callback=${callbackName}`
    return new Promise((resolve, reject) => {
        let script = document.createElement("script")
        script.type = "text\/javascript"
        script.onerror = function(err) {
            errAlert(err.message)
        }
        script.onload = function() {
            console.log('发出')
        }
        document.head.appendChild(script)
        window[callbackName] = function(data) {
            delete window[callbackName]
            document.head.removeChild(script)
            resolve(data)

        }
        script.src = url;
    })
}
