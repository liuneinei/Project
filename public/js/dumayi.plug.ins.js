
!(function () {
    // 异步请求处理
    var xmlrequest;
    // 完成XMLHttpRequest初始化  
    creatXMLHttpRequest();

    var _a = document.createElement('a');
    //为标签添加样式
    _a_css(_a);

    // 添加事件
    addHandler(_a, 'click', handler);
    // 事件 回调
    function handler() {
        // 用户中心Id
        var centerid = getCookie('kefu:centerid');

        //连接服务器  
        createHttp('GET', 'http://wxnnn.wang:8087/member/' + centerid, back)

        //定义处理响应的回调函数  
        function back(res) {
            if (res.IsOk) {
                window.location = "http://wxnnn.wang:8087/member.html?centerid=" + centerid;
            } else {
                console.log(res.message);
            }
        }
    }



    document.body.appendChild(_a);

    //为标签添加样式
    function _a_css(_a) {
        _a.style = "background-image: url('http://wxnnn.wang:8087/images/kefu001.jpg'); background-repeat:no-repeat; width: 8rem; height: 8rem; background-size: 8rem; display: block; position: fixed;  right: 2rem;  z-index: 555;  bottom: 10rem;";
    }

    //绑定事件
    function addHandler(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }

    //完成XMLHttpRequest初始化  
    function creatXMLHttpRequest() {
        if (window.XMLHttpRequest) { //判定兼容性  
            xmlrequest = new XMLHttpRequest(); //Dom2浏览器  
        }
        else if (window.ActiveXObject) {  //IE浏览器  
            try {
                xmlrequest = new ActiveXObject("msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlrequest = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) { }
            }
        }
    }

    //Http请求
    function createHttp(method, url, fn) {
        xmlrequest.open(method, url, true);//连接服务器  
        //xmlrequest.setRequestHeader("content-Type", "applicaion/x-www-form-urlencoded");
        //设置请求头编码方式  
        xmlrequest.onreadystatechange = processResponse;
        xmlrequest.send(null);  //发送请求  

        //定义处理响应的回调函数  
        function processResponse() {
            if (xmlrequest.readyState == 4) {
                if (xmlrequest.status == 200) {  //请求成功  
                    try {
                        result = JSON.parse(xmlrequest.response);
                        typeof fn === 'function' && fn({ IsOk: true, row: result.row }); return;
                        
                    } catch (e) {
                        typeof fn === 'function' && fn({ IsOk: false, message: e.message }); return;
                    }
                }
                else {
                    typeof fn === 'function' && fn({ IsOk: false, message: '请求异常' }); return;
                }
            }
        }
    }

    // 获取Cookie
    function getCookie(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    }

})();