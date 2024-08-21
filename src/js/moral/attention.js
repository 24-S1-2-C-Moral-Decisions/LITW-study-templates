(function (exports) {
    "use strict";

    var Data = {
        choose: "",
    },

    initialize = function () {
        LITW.data.attentionCheckPassed = false
        Data.choose = ""

        console.log("attentionCheckPassed: "+LITW.data.attentionCheckPassed);
        console.log(Data);
        console.log("attention initialized");
    },
    attentionChoose = function (ans) {
        Data.choose = ans;
        $(".attention .invalid-feedback").hide();
    },
    checkAttention = function (expextedList) {
        if(Data.choose == ""){
            $(".attention .invalid-feedback").show();
            return;
        }
        LITW.data.attentionCheckPassed = expextedList.split(",").includes(Data.choose);
        console.log(LITW.data.attentionCheckPassed);
        nextPage();
    };

    exports.attention = {};
    exports.attention.initialize = initialize;
    exports.attention.attentionChoose = attentionChoose;
    exports.attention.checkAttention = checkAttention;

})(window.MORAL = window.MORAL || {});
