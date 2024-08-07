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

let result = {
    studyId: "1",
    answers: {
        questionId:  null,
        individualAnswer: {
            isAsshole: null,
            rating: null
        },
        groupAnswer: {
            isAsshole: null,
            rating: null
        },
        comments: null
    },
    comments: null,
    time: null
};

window.onbeforeunload = function() {
    sessionStorage.removeItem('img');
};
// 保存指定页面的相对路径
// const specifiedPageUrl = 'http://localhost:8080/';
