//节流
export const throttle = (fun, delay)=> {
    let last, deferTimer
    return function () {
      let that = this
      let _args = arguments
      let now = +new Date()
      if (last && now < last + delay) {
        clearTimeout(deferTimer)
        deferTimer = setTimeout(function () {
          last = now
          fun.apply(that, _args)
        }, delay)
      } else {
        last = now
        fun.apply(that, _args)
      }
    }
}
//防抖
export const debounce = (fun, delay)=> {
    return function (args) {
      let that = this
      let _args = args
      clearTimeout(fun.id)
      fun.id = setTimeout(function () {
        fun.call(that, _args)
      }, delay)
    }
}

export const validator = {
    //必填
    isRequired(str){
        return str.replace(/\s+/g, "").replace(/<\/?.+?>/g,"").replace(/[\r\n]/g, "").length > 0;
    },
    isUrl(str){
      var urlReg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
        return urlReg.test(str);
    },
    //邮箱
    isEmail(str){
        var emailReg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        return emailReg.test(str);
    },
    //手机号
    isMobile(str){
        var mobileReg = /^(1[0-9])\d{9}$/;
        return mobileReg.test(str);
    },
    //座机
    isTelephone(str){
        var phoneReg = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/;
        return phoneReg.test(str);
    },
    //身份证
    isIdCard(str){
        var ID = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[X|x])$/;
        return ID.test(str);
    }
}
/**
 * 过滤emoji字符
 * @param str
 */
export const removeEmoji = str =>{
    if(typeof str === 'string' && str.length>0) {
        str = str.replace(/([\uD800-\uDBFF][\uDC00-\uDFFF])/g, '');
    }
    return str;
}