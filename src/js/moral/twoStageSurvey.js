(function (exports) {
    "use strict";
    var Data = {
        individualJudgment: "",
        groupJudgment: "",
        individualConfident: "",
        groupConfident: "",
        comment: ""
    },

    initialize = function () {
        $("#group").hide();
        $("#judgmentResult").hide();
        $("#confidentResult").hide();

        Data.individualJudgment = "";
        Data.groupJudgment = "";
        Data.individualConfident = "";
        Data.groupConfident = "";
        Data.comment = "";

        console.log(Data);
        console.log("twoStageSurvey initialized");
    },
    setIndividualJudgment = function (ans) {
        Data.individualJudgment = ans;
        $("#individual .judgment .invalid-feedback").hide();
    },
    setIndividualConfident = function (ans) {
        Data.individualConfident = ans;
        $("#individual .confident .invalid-feedback").hide();
    },
    finalizeJudgment = function () {
        if (Data.individualJudgment != "" && Data.individualConfident != "") {
            $("#individual .judgment input").prop('disabled', true);
            $("#individual .confident input").prop('disabled', true);

            if (Data.individualJudgment == "YA") {
                $("#NA").show();
                $("#YA").hide();
            } else {
                $("#YA").show();
                $("#NA").hide();
            }

            $("#finalize").hide();
            $("#group").show();
        } else if (Data.individualJudgment == "") {
            $("#individual .judgment .invalid-feedback").show();
        }
        else if (Data.individualConfident == "") {
            $("#individual .confident .invalid-feedback").show();
        }
    },
    setGroupJudgment = function (ans) {
        Data.groupJudgment = ans;
        $("#group .judgment .invalid-feedback").hide();
        $("#judgmentResult").show();
        if (Data.individualJudgment == ans) {
            $("#judgmentSame").show();
            $("#judgmentChange_NA").hide();
            $("#judgmentChange_YA").hide();
        } else {
            $("#judgmentSame").hide();
            if (ans == "YA") {
                $("#judgmentChange_YA").show();
                $("#judgmentChange_NA").hide();
            } else {
                $("#judgmentChange_NA").show();
                $("#judgmentChange_YA").hide();
            }
        }
    },
    setGroupConfident = function (ans) {
        Data.groupConfident = ans;
        $("#group .confident .invalid-feedback").hide();
        $("#confidentResult").show();
        if (Data.individualConfident == ans) {
            $("#confidentSame").show();
            $("#confidentChange").hide();
        } else {
            $("#confidentSame").hide();
            $("#confidentChange").show();
            $("#confidentChange #prev-confident").text($.i18n("moral-question-confidence-" + Data.individualConfident));
        }
    },
    tryNext = function (isTraing, id) {
        Data.comment = $("#comment").val();
        if (Data.groupJudgment != "" && Data.groupConfident != "") {
            let result = {
                questionId: id,
                individualAnswer: {
                    isAsshole: Data.individualJudgment == "YA",
                    rating: Number(Data.individualConfident)
                },
                groupAnswer: {
                    isAsshole: Data.groupJudgment == "YA",
                    rating: Number(Data.groupConfident)
                },
                comment: Data.comment
            };
            if (!isTraing) {
                LITW.utils.saveResultData(result);
            }
            // console.log(result);
            nextPage();
        }
        else if (Data.groupJudgment == "") {
            $("#group .judgment .invalid-feedback").show();
        }
        else if (Data.groupConfident == "") {
            $("#group .confident .invalid-feedback").show();
        }
    };

    exports.twoStageSurvey = {};
    exports.twoStageSurvey.initialize = initialize;
    exports.twoStageSurvey.setIndividualJudgment = setIndividualJudgment;
    exports.twoStageSurvey.setIndividualConfident = setIndividualConfident;
    exports.twoStageSurvey.finalizeJudgment = finalizeJudgment;
    exports.twoStageSurvey.setGroupJudgment = setGroupJudgment;
    exports.twoStageSurvey.setGroupConfident = setGroupConfident;
    exports.twoStageSurvey.tryNext = tryNext;

})(window.MORAL = window.MORAL || {});