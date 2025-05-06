(function (exports) {
    "use strict";

    var Data = {
        choose: "",
    },

    initialize = function () {
        LITW.data.attentionCheckPassedCounter = 0
        Data.choose = ""

        console.log("attentionCheckPassedCounter: "+LITW.data.attentionCheckPassedCounter);
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
        if (expextedList.split(",").includes(Data.choose))
            LITW.data.passOneAttentionCheck()
        console.log(LITW.data.attentionCheckPassedCounter);
        nextPage();
    };

    exports.attention = {};
    exports.attention.initialize = initialize;
    exports.attention.attentionChoose = attentionChoose;
    exports.attention.checkAttention = checkAttention;

})(window.MORAL = window.MORAL || {});
