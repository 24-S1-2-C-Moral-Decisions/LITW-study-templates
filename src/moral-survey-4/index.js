
// observer for the two-stage-surveys
new MutationObserver(() => {
    if ($("#two-stage-survey").children().length > 0) {
        MORAL.twoStageSurvey.initialize();
    }
}).observe($("#two-stage-survey")[0], { childList: true, subtree: false });

// observer for the attention
new MutationObserver(() => {
    if ($("#attention").children().length > 0) {
        MORAL.attention.initialize();
    }
}).observe($("#attention")[0], { childList: true, subtree: false });

function nextPage(){
	$("#btn-next-page").click();
}

function passedValidation(id=".invalid-feedback") {
    // stlye display none
    $(id).hide();
}

function failedValidation(id=".invalid-feedback") {
    // do not add was-validated here
    $(id).show();
}

var attention = false;

// let result = {
//     studyId: "1",
//     answer: {
//         questionId:  null,
//         individualAnswer: {
//             isAsshole: null,
//             rating: null
//         },
//         groupAnswer: {
//             isAsshole: null,
//             rating: null
//         },
//         comments: null
//     },
//     comments: null,
//     time: null
// };

window.onbeforeunload = function() {
    sessionStorage.removeItem('img');
};
// 保存指定页面的相对路径
// const specifiedPageUrl = 'http://localhost:8080/';
