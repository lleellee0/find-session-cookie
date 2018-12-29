let argvUrl = process.argv[2];
let argvCookie = process.argv[3];

if(process.argv.length !== 4) {
    console.log("'node app.js {url} '{cookie}'");
    console.log("node app.js https://www.naver.com/ 'cookie1=value1; cookie2=value2'");
    return 1;
}
const cookie = require('cookie');

const k_combinations = (set, k) => {
	let i, j, combs, head, tailcombs;

	if (k > set.length || k <= 0) {
		return [];
	}
	
	if (k == set.length) {
		return [set];
	}

	if (k == 1) {
		combs = [];
		for (i = 0; i < set.length; i++) {
			combs.push([set[i]]);
		}
		return combs;
	}
	combs = [];
	for (i = 0; i < set.length - k + 1; i++) {
		head = set.slice(i, i + 1);
		tailcombs = k_combinations(set.slice(i + 1), k - 1);
		for (j = 0; j < tailcombs.length; j++) {
			combs.push(head.concat(tailcombs[j]));
		}
	}
	return combs;
}

const combinations = (set) => {
	var k, i, combs, k_combs;
	combs = [];
	
	// Calculate all non-empty k-combinations
	for (k = 1; k <= set.length; k++) {
		k_combs = k_combinations(set, k);
		for (i = 0; i < k_combs.length; i++) {
			combs.push(k_combs[i]);
		}
	}
	return combs;
}

const delay = (milliseconds) => {
    return new Promise(_resolve => setTimeout(_resolve, milliseconds));
}

let cookies_1 = cookie.parse(argvCookie);
// console.log(cookies_1);

// console.log(cookieCombKeyArr);
// [ [ 'SID' ],
//   [ 'HSID' ],
//   [ 'SSID' ],
//   [ '_gcl_au' ],
//   [ 'PREF' ],
//   [ 'VISITOR_INFO1_LIVE' ],
//   [ 'enabledapps.uploader' ],
//   [ 'SL_GWPT_Show_Hide_tmp' ],
//   [ 'SL_wptGlobTipTmp' ],
//   [ 'YSC' ],
//   [ 'APISID' ],
//   [ 'SAPISID' ],
//   [ 'LOGIN_INFO' ],
//   [ 'SID', 'HSID' ],
//   [ 'SID', 'SSID' ],
//   [ 'SID', '_gcl_au' ],
//   [ 'SID', 'PREF' ],
//   [ 'SID', 'VISITOR_INFO1_LIVE' ],
//   [ 'SID', 'enabledapps.uploader' ],
//   [ 'SID', 'SL_GWPT_Show_Hide_tmp' ],
//   [ 'SID', 'SL_wptGlobTipTmp' ],
//   [ 'SID', 'YSC' ],
//   [ 'SID', 'APISID' ], ... ]

const request = require('request');

let jar = request.jar();
const url = argvUrl;
let countArr = new Array();
const requestCookieComb = async () => {
    
    // requestCookieArr[0] = request.cookie(`${cookieCombKeyArr[0][0]}=${cookies[cookieCombKeyArr[0][0]]}`);
    // requestCookieArr[1] = request.cookie(`${cookieCombKeyArr[1][0]}=${cookies[cookieCombKeyArr[1][0]]}`);
    // requestCookieArr[2] = request.cookie(`${cookieCombKeyArr[2][0]}=${cookies[cookieCombKeyArr[2][0]]}`);
    
    // console.log(requestCookieArr);
    // for(let i = 7; i < 10; i++) {
    //     j.setCookie(`${cookieCombKeyArr[i][0]}=${cookies[cookieCombKeyArr[i][0]]};domain=youtube.com`, 'http://www.youtube.com');
    // }
    // j.setCookie(requestCookieArr[0]);
    // j.setCookie(requestCookieArr[1]);
    // j.setCookie(requestCookieArr[2]);
    // console.log(jar);

    let cookieCombKeyArr = combinations(Object.keys(cookies_1));

    for(let i = 0; i < cookieCombKeyArr.length; i++) {
        
        jar = request.jar();
        const requestCookieArr = new Array();
        // console.log('**');
        for(let j = 0; j < cookieCombKeyArr[i].length; j++) {
            // console.log(`${cookieCombKeyArr[i][j]}=${cookies_1[cookieCombKeyArr[i][j]]};domain=${argvUrl.split(".")[1]}.${argvUrl.split(".")[2]}`, argvUrl);
            jar.setCookie(`${cookieCombKeyArr[i][j]}=${cookies_1[cookieCombKeyArr[i][j]]};domain=${argvUrl.split(".")[1]}.${argvUrl.split(".")[2]}`, argvUrl);
        }
        // console.log('**');
        await request({url: url, jar: jar, i: i}, (err, res, body) => {
            const cookies = jar.getCookies(url);
            // console.log(cookies);
            // [{key: 'key1', value: 'value1', domain: "www.google.com", ...}, ...]
            // console.log('');
            // console.log(i);
            // console.log(cookies);
            let arr = new Array();
            let count = 0;
            for(let j = 0; j < cookies.length; j++) {
                // console.log((cookies[j]+"".split('Cookie=')[0]).split('=')[0]);
                arr[j] = (cookies[j]+"".split('Cookie=')[0]).split('=')[0];
                // console.log(cookies[j]);
            }
            for(let j = 0; j < arr.length; j++) {
                if(arr[j].includes(cookieCombKeyArr[i][j]))
                    count++;
            }
            if(count === cookieCombKeyArr[i].length) {
                // console.log('다포함');
                // console.log(i, cookieCombKeyArr[i]);
                for(let j = 0, k = 0; j < cookieCombKeyArr[i].length;j++) {
                    for(k = 0; k < countArr.length; k++) {
                        // console.log(cookieCombKeyArr[i][j], "===???" ,countArr[k].cookie)
                        if(cookieCombKeyArr[i][j] === countArr[k].cookie) {
                            countArr[k].count++;
                            k = countArr.length;
                        }
                    }
                    // console.log(k, "===??", countArr.length);
                    if(k === countArr.length) {
                        countArr[countArr.length] = {cookie:cookieCombKeyArr[i][j], count: 1}
                        // console.log(countArr[countArr.length], "=", {cookie:cookieCombKeyArr[j], count: 1});
                    }
                }
                console.log(i, countArr);
            }
            
          });
        
        await delay(1000);
    }

    return new Promise(_resolve => {});
}

(async () => {
    // 첫 요청으로 해당 사이트의 기본 쿠키를 확인 후 제거.
    await request({url: url, jar: jar}, (err, res, body) => {
        const cookie_string = jar.getCookieString(url); // "key1=value1; key2=value2; ..."
        const cookies_2 = jar.getCookies(url);
        // console.log(cookies_2[0]);
        // [{key: 'key1', value: 'value1', domain: "www.google.com", ...}, ...]
        for(let i = 0; i < cookies_2.length; i++)
            delete cookies_1[`${((cookies_2[i]+"").split('Cookie=')[0]).split('=')[0]}`]
        // console.log(cookies_1);
      });
      await delay(5000);
    await requestCookieComb();
})();

    // 1. 처음 요청했을때 부터 존재하는 쿠키들은 제외시킨다.
    // 2. 나머지 쿠키들을 집어넣었을 때 변하지 않는 것이 세션일 가능성 높높