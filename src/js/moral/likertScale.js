(function (exports) {
    "use strict";

    var Data = {
    },
    
    tryNext = function() {
        let dimensions = $(".likert-scale-item");
        let answer = []
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
        Data["answer"] = answer;
        console.log(Data);
        nextPage();
    };

    exports.likertScale = {};
    exports.likertScale.tryNext = tryNext;

})(window.MORAL = window.MORAL || {});
