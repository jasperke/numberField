/*
需 https://jasperke@github.com/jasperke/caret.git
   (folk from https://github.com/accursoft/caret.git)

僅允許輸入 -12.00 或 +1.12 或 123 之類, 開頭可有可無正負號, 可含小數點, 之數字資料
用法 $('input.number').numberField();
*/
(function ($) {
  'use strict';

  $.fn.numberField = function (options) {
    if (!this.length) {
      return this;
    }

    var shiftHeld=false;
    this.each(function () {
      $(this).on('keydown',function(e){
        var elm=$(e.target),
          pos=elm.caret();

        if(e.which==16){shiftHeld=true;}
        /*
        0-9: 48,49,50,51,52,53,54,55,56,57
        +/=: 187 (firefox 61) (須判斷有無按shift)
        -: 189 (firefox 173)
        .: 190
        back: 8
        shift: 16

        右側
        0-9: 96,97,98,99,100,101,102,103,104,105
        +: 107
        -: 109
        .: 110
        home: 36
        end: 35
        左右: 37, 39
        delete: 46
        */
        if($.inArray(e.which,[8, 35,36,37,39,  46,   48,49,50,51,52,53,54,55,56,57, 61,187,189,173,190,    96,97,98,99,100,101,102,103,104,105,   107,109,110])==-1){
          e.preventDefault();
        }else{
          if(shiftHeld&&$.inArray(e.which,[187,61,36,35,37,39])==-1){ // 按shift時, 只接受配合 +=,home,end,左右 這幾個鍵(允許輸+和選取反白)
            e.preventDefault();
          }else if((e.which==187||e.which==61)&&!shiftHeld){ // +=鍵未按shift不接受
            e.preventDefault();
          }else{
            if(e.which==189||e.which==173||e.which==109){ // 負號
              if(pos>0||e.target.value.indexOf('-')!=-1||e.target.value.indexOf('+')!=-1){ // 不在開頭位置 或 已存在正負號, 不接受第2個
                e.preventDefault();
              }
            }else if(e.which==190||e.which==110){ // 小數點
              if(e.target.value.indexOf('.')!=-1){ // 已存在小數點
                e.preventDefault();
              }
            }else if(e.which==187||e.which==61||e.which==107){ // 加號
              if(pos>0||e.target.value.indexOf('+')!=-1||e.target.value.indexOf('-')!=-1){ // 不在開頭位置 或 已存在正負號
                e.preventDefault();
              }
            }
          }
        }
      }).on('keyup',function(e){
        var elm=$(e.target),
          pos=elm.caret(); // keyup後, 游標位置已右移一位

        if(e.which==16){
          shiftHeld=false;
        }else{
          if(!shiftHeld||$.inArray(e.which,[36,35,37,39])==-1){ // 選取反白時不必調回位置
            e.target.value=e.target.value.match(/^[+|-]?\d*\.?\d*/); // 避免輸入全型字
            elm.caret(pos);
          }
        }
      });
    });
    return this;
  };
})(jQuery);