'use strict';

// OAuth1認証用インスタンス
var twitter = TwitterWebService.getInstance(
  '***CONSUMER_KEY***',
  '***CONSUMER_SECRET***'
);

// 認証を行う（必須）
function authorize() {
  twitter.authorize();
}

// 認証をリセット
function reset() {
  twitter.reset();
}

// 認証後のコールバック（必須）
function authCallback(request) {
  return twitter.authCallback(request);
}

function favorite_oppai_tweet(){
  var service  = twitter.getService();
  var payload_0 = "?screen_name=username"//ユーザー名をいれるとフィルタがかかる
  var response_0 = service.fetch('https://api.twitter.com/1.1/users/show.json'+payload_0);
  var response_0_json = JSON.parse(response_0);
  var own_id_str = response_0_json.id_str;
  var count_oppai=0;
  
  var t_max_id = "-1";
  for(var i=0;i<2;++i){
    var service  = twitter.getService();
    var payload="";
    if(t_max_id=="-1"){
      payload = "?count=200&include_rts=false";
    }else{
      payload = "?count=200&max_id="+t_max_id+"&include_rts=false";
    }
    var response = service.fetch('https://api.twitter.com/1.1/statuses/home_timeline.json');
    var response_json = JSON.parse(response);
    for(var tweet_one_of in response_json){
      if(own_id_str!=response_json[tweet_one_of].user.id_str&&true==oppai_is_alive(response_json[tweet_one_of].text)){
        ++count_oppai;
        var response2 = service.fetch('https://api.twitter.com/1.1/favorites/create.json', {
          method: 'post',
          payload: { id: response_json[tweet_one_of].id_str }
        }); 
      }
    }
    if(response_json.length<200){
       break;
    }else{
       t_max_id =response_json[response_json.length-1].id_str;
    }
  }
  Logger.log(count_oppai);
}

function oppai_is_alive(str){
  if(str === void 0){
    return false;
  }
  var temp_str = str;
  temp_str = temp_str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });
  temp_str = hira2kana(temp_str);
  temp_str = hankana2zenkana(temp_str);
  temp_str = zenkana2hepburn_romanization(temp_str);
  rep = temp_str.match(/oxtsupai/i);
  if(null==rep){
    rep = temp_str.match(/oppai/i);
    if(null==rep){
      return false;
    }
  }
  return true;
}

var hira2kana = function (str, opt) {
    str = str
            .replace(/[ぁ-ゔ]/g, function (s) {
                return String.fromCharCode(s.charCodeAt(0) + 0x60);
            })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜')
            .replace(/(ウ゛)/g, 'ヴ')
            .replace(/(ワ゛)/g, 'ヷ')
            .replace(/(ヰ゛)/g, 'ヸ')
            .replace(/(ヱ゛)/g, 'ヹ')
            .replace(/(ヲ゛)/g, 'ヺ')
            .replace(/(ゝ゛)/g, 'ヾ')
            .replace(/ゝ/g, 'ヽ')
            .replace(/ゞ/g, 'ヾ');
    if (opt !== false) {
        str = str.replace(/ゕ/g, 'ヵ').replace(/ゖ/g, 'ヶ');
    }
    return str;
};

var hankana2zenkana = function (str) {
    var kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
    };

    var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    return str
            .replace(reg, function (match) {
                return kanaMap[match];
            })
            .replace(/ﾞ/g, '゛')
            .replace(/ﾟ/g, '゜');
};

var zenkana2hepburn_romanization = function(str){
  var romanMap = {
        'ガ': 'ga', 'ギ': 'gi', 'グ': 'gu', 'ゲ': 'ge', 'ゴ': 'go',
        'ザ': 'za', 'ジ': 'ji', 'ズ': 'zu', 'ゼ': 'ze', 'ゾ': 'zo',
        'ダ': 'da', 'ヂ': 'ji', 'ヅ': 'zu', 'デ': 'de', 'ド': 'do',
        'バ': 'ba', 'ビ': 'bi', 'ブ': 'bu', 'ベ': 'be', 'ボ': 'bo',
        'パ': 'pa', 'ピ': 'pi', 'プ': 'pu', 'ペ': 'pe', 'ポ': 'po',
        'ヴ': 'bu', 'ヷ': 'va', 'ヺ': 'vo',
        'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
        'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
        'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
        'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
        'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
        'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
        'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
        'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
        'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
        'ワ': 'wa', 'ヲ': 'o', 'ン': 'n',
        'ァ': 'xa', 'ィ': 'xi', 'ゥ': 'xu', 'ェ': 'xe', 'ォ': 'xo',
        'ッ': 'xtsu', 'ャ': 'xya', 'ュ': 'xyu', 'ョ': 'xyo',
  };
  var reg = new RegExp('(' + Object.keys(romanMap).join('|') + ')', 'g');
  return str
          .replace(reg, function (match) {
            return romanMap[match];
          })
};
