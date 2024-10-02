(function (exports) {
    "use strict";

    var Data = {
    },
    
    tryNext = function() {
        let dimensions = $(".likert-scale-item");
        let answer = []
        let likertOptions = $(dimensions[0]).find(".likert-scale-option");
        console.log(likertOptions.length)
        for (let index = 0; index < dimensions.length; index++) {
            let item = $(dimensions[index]);
            let res = item.find("input:checked").val();
            if (res === undefined) {
                item.addClass("bg-warning-subtle");
                item.find(".invalid-feedback").show();
                $("#invalid-feedback").show();
                return;
            }
            item.removeClass("bg-warning-subtle");
            item.find(".invalid-feedback").hide();
            $("#invalid-feedback").hide();
            answer.push(res);
        }
        if (likertOptions.length == 5) {
            Data["decisionMaking"] = answer;
        } else {
            Data["personalityChoice"] = answer;
        }

        Data["answer"] = answer;
        console.log(Data);
        nextPage();
    };
    exports.DataChoice = Data; 
    exports.likertScale = {};
    exports.likertScale.tryNext = tryNext;

})(window.MORAL = window.MORAL || {});
