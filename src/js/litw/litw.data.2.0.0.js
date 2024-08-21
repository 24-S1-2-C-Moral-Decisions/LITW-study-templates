/*************************************************************
 * litw.data.2.0.0js
 *
 * Contains functions for writing LITW Study data operations
 * using the LITW REST API
 *
 * Dependencies: jQuery
 *
 * Author: LabintheWild DEV crew
 *
 * © Copyright 2023 LabintheWild
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

(function( exports ) {
    "use strict";

    var version = '2.0.0',
        params = {
            _isInitialized: false,
            prolificId: null,
            studyId: -1,
            ipCountry: "not_fetched_or_initialized",
            ipRegion: "not_fetched_or_initialized",
            ipCity: "not_fetched_or_initialized",
            userAgent: "not_fetched_or_initialized"
        },

        trainingData = [
            // placeholder for training data
            {},
            // controversy
            {
                _id: "../meat_con",
                title: "Am I the asshole for not buying meat for my 9 year old daughter?",
                selftext: "I’ve raised my daughter vegetarian from birth and a few years ago made" +
                " the switch the veganism. Me and her father are separated and a few months ago she "+
                " tried meat at his and liked it. He has her 2 nights a week so now she’s eating meat"+
                ", dairy and eggs at his. When she told me I said that was fine, it’s her body and she"+
                " gets to decide what goes into it, she then asked me if she could get some meat when "+
                "we went shopping but I said no. The smell and everything about meat kinda makes me feel"+
                " sick and I’d be the one having to prepare it for her. I let her have cheese and eggs "+
                "now at ours but she’s asked me again if she can get meat.",
                very_certain_YA: 35,
                not_very_certain_YA: 100 - 35,
                very_certain_NA: 35,
                not_very_certain_NA: 100 - 35,
                YA_percentage: 0.5,
                NA_percentage: 0.5,
            },
            // uncertainty
            {
                _id: "../meat",
                title: "Am I the asshole for not buying meat for my 9 year old daughter?",
                selftext: "I’ve raised my daughter vegetarian from birth and a few years ago made" +
                " the switch the veganism. Me and her father are separated and a few months ago she "+
                " tried meat at his and liked it. He has her 2 nights a week so now she’s eating meat"+
                ", dairy and eggs at his. When she told me I said that was fine, it’s her body and she"+
                " gets to decide what goes into it, she then asked me if she could get some meat when "+
                "we went shopping but I said no. The smell and everything about meat kinda makes me feel"+
                " sick and I’d be the one having to prepare it for her. I let her have cheese and eggs "+
                "now at ours but she’s asked me again if she can get meat.",
                very_certain_YA: 1,
                not_very_certain_YA: 100 - 1,
                very_certain_NA: 43,
                not_very_certain_NA: 100 - 43,
                YA_percentage: 0.5,
                NA_percentage: 0.5,
            },
            // controversy-uncertainty
            {},
            // relevant-reasonings
            {
                title: "Am I the asshole for not buying meat for my 9 year old daughter?",
                selftext: "I’ve raised my daughter vegetarian from birth and a few years ago made" +
                " the switch the veganism. Me and her father are separated and a few months ago she "+
                " tried meat at his and liked it. He has her 2 nights a week so now she’s eating meat"+
                ", dairy and eggs at his. When she told me I said that was fine, it’s her body and she"+
                " gets to decide what goes into it, she then asked me if she could get some meat when "+
                "we went shopping but I said no. The smell and everything about meat kinda makes me feel"+
                " sick and I’d be the one having to prepare it for her. I let her have cheese and eggs "+
                "now at ours but she’s asked me again if she can get meat.",
                original_post_NA_top_reasonings: [
                    "NA. I will admit to being pretty surprised by all of the YTAs here. You don’t mind her eating whatever at her dads and you’re making sure she’s getting her nutrients, so I don’t see you as the asshole just because you don’t personally want to buy and prepare meat",
                    "NA. Your daughter is nine, and from your replies she is clearly getting the nutrition she needs. She can eat what's at the dinner table while in your house.",
                    "NA Most of these responses are folks who just have a problem with vegans or think humans \"need\" meat, which is obviously silly. I don't see the big deal. Your house, your rules. There were plenty of foods growing up I wanted but my parents refused to make. You're not telling her she has to be vegan, just that certain food is only available outside the house. Sounds fine to me.",
                ],
                original_post_YA_top_reasonings: [
                    "YA - you've established that she has a say over her body, but you are denying her in practice. It's your job to help her exercise her agency until she's old enough to do it on her own. Start with pre-made foods like chicken nuggets that you can just prepare in the oven without handling the raw meat yourself. She's also getting old enough where you could start teaching her to cook. If her dad can teach her how to prepare meat, you wouldn't need to play a huge part in it.",
                    "YA, you're her parent so it's your right to choose what she eats while around you, but it's definitely an asshole move on your part to put your own needs above hers, especially if it's because you can't deal with \"the smell\" or whatever other bullshit excuse you've decided to use in order to rationalise your decision.",
                    "YA I support adult vegetarianism. Unfortunately many dietitations recommend meat as part of a regular diet for kids. While it is fully possible for an adult to get all of their nutrients on a vegetarian diet, children need more fat and protein for their developing bodies and brains. You could always buy her cold cuts of meat for sandwiches, then you won't have to smell it. There are work arounds but if all of your shared meal times are still vegetarian/vegan that's fine. She should eat what her parent is eating at meals.",
                ],
            },
            // irrelevant-reasonings
            {}
        ],

        attentionQuestions = [
            {
                question: "I have lunch on the moon every afternoon",
                options: [
                    "Strongly Disagree",
                    "Disagree",
                    "Neutral",
                    "Agree",
                    "Strongly Agree"
                ],
                expextedList: ["Strongly Disagree", "Disagree"]
            },
            {
                note: "Please remember, to verify that you are reading the survey questions attentively, when you encounter a question about your favorite season, you are to select 'Winter' regardless of your true preference.",
                question: "According to the above instruction, which season will you state as your favorite?",
                options: [
                    "Spring",
                    "Summer",
                    "Autumn",
                    "Winter"
                ],
                expextedList: ["Winter"]
            }
        ],

        getProlificId = function() {
            return params.prolificId;
        },
        getStudyId = function() {
            return params.studyId;
        },
        getCountry = function() {
            return params.ipCountry;
        },
        getCity = function() {
            return params.ipCity;
        },
        isInitialized = function() {
            return params._isInitialized;
        },
        getURLparams = function () {
            return params.url;
        },

        getTopic = function() {
            switch (params.studyId) {
                case '1':
                    return "controversy";
                case '2':
                    return "uncertainty";
                case '3':
                    return "controversy-uncertainty";
                case '4':
                    return "relevant-reasonings";
                case '5':
                    return "irrelevant-reasonings";
            
                default:
                    return "Unknown-Topic";
            }
        },

        getTrainingData = function() {
            return trainingData[params.studyId];
        },

        getQuestionData = function() {
            console.log("Data.questions: ", Data.questions);
            return Data.questions;
        },

        setQuestion = function(data) {
            Data.questions = data;
            Data.questions.img = JSON.stringify(Data.questions._id);
            Data.questions.YA_percentage = Math.round(Data.questions.YA_percentage * 100)
            Data.questions.NA_percentage = Math.round(Data.questions.NA_percentage * 100)
            Data.questions.very_certain_NA = Math.floor(Data.questions.very_certain_NA * 100).toString()
            Data.questions.not_very_certain_NA = 100 - Data.questions.very_certain_NA
            Data.questions.very_certain_YA = Math.floor(Data.questions.very_certain_YA * 100).toString()
            Data.questions.not_very_certain_YA = 100 - Data.questions.very_certain_YA
            Data.questions.YA_NA_percentage = Data.questions.YA_percentage.toString() + ":" + Data.questions.YA_percentage.toString()     
            console.log(LITW.data.questions);

            // sessionStorage.setItem('img', JSON.stringify(LITW.data.questions.img));
            console.log("Self Texts:", LITW.data.questions.selftext);
            console.log("Titles:", LITW.data.questions.title);
        },

        likertScaleQuestions = [
            {
                note: "The below 15 questions help us understand what your personality is. Your honest opinions are crucial for our research. When you finish all the questions in this page, click on the button '"+ $.i18n("moral-next") +"' to proceed.",
                questionBlockSize: 2,
                optionBlockSize: 10,
                dimensions: ["strongly disagree", "disagree", "somewhat disagree", "neither agree nor disagree", "somewhat agree", "agree", "strongly agree"],
                question: {
                    title: "I see myself as someone who ...",
                    items: [
                        "1. worries a lot",
                        "2. gets nervous easily",
                        "3. remains calm in tense situations",
                        "4. is talkative",
                        "5. is outgoing, sociable",
                        "6. is reserved",
                        "7. is original, comes up with new ideas",
                        "8. values artistic, aesthetic experiences",
                        "9. has an active imagination",
                        "10. is sometimes rude to others",
                        "11. has a forgiving nature",
                        "12. is considerate and kind to almost everyone",
                        "13. is sometimes shy, inhibited",
                        "14. tends to be lazy",
                        "15. does things efficiently",
                    ]
                }
            },
            {
                note: "We are interested in understanding how people differ in making decisions. Your honest opinions are crucial for our research. When you finish all the questions in this page, click on the button '"+ $.i18n("moral-next") +"' to proceed.",
                questionBlockSize: 5,
                optionBlockSize: 7,
                dimensions: ["strongly disagree", "disagree", "neither agree nor disagree", "agree", "strongly agree"],
                question: {
                    title: "Please indicate how you make decisions by ticking the response that best fits your usual style for each of the following 25 questions.",
                    items: [
                        "1. When I make decisions, I tend to rely on my intuition.",
                        "2. I rarely make important decisions without consulting other people.",
                        "3. When I make a decision, it is more important for me to feel the decision is right than to have a rational reason for it",
                        "4. I double-check my information sources to be sure I have the right facts before making decisions",
                        "5. I use the advice of other people in making my important decisions",
                        "6. I put off making decisions because thinking about them makes me uneasy",
                        "7. I make decisions in a logical and systematic way",
                        "8. When making decisions I do what I think first",
                        "9. I generally make snap decisions",
                        "10. I like to have someone steer me in the right direction when I am faced with important decisions",
                        "11. My decision-making requires careful thought",
                        "12. When making a decision, I trust my inner feelings and reactions",
                        "13. When making a decision, I consider various options in terms of a specified goal",
                        "14. I avoid making important decisions until the pressure is on",
                        "15. I often make impulsive decisions",
                        "16. When making decisions, I rely upon my instincts",
                        "17. I generally make decisions that feel right to me",
                        "18. I often need the assistance of other people when making important decisions",
                        "19. I postpone decision making whenever possible",
                        "20. I often make decisions on the spur of the moment",
                        "21. I often put off making important decisions",
                        "22. If I have the support of others, it is easier for me to make important decisions",
                        "23. I generally make important decisions only if I am obligated",
                        "24. I make quick decisions",
                        "25. I usually have a rational basis for making decisions"
                    ]
                }
            }
        ],

        getLikertScaleQuestions = function(index) {
            return likertScaleQuestions[index];
        },

        getRandomAttentionCheck = function() {
            let randomIndex = Math.floor(Math.random() * attentionQuestions.length);
            let res = attentionQuestions[randomIndex];
            attentionQuestions.splice(randomIndex, 1);
            return res;
        },

        initialize = function(baseUrl) {
            let litw_locale = LITW.locale.getLocale() || "";
            // TODO: This is not working because I did not figure how to get the client IP behind the NGINX yet!
            // let geoip_url = '/service/geoip';
            let geoip_url = 'https://api.labinthewild.org/service/geoip';

            if (!params._isInitialized) {
                params._isInitialized = true;
                LITW.utils.APIaseUrl = baseUrl || LITW.utils.APIBaseURL;
                params.url = LITW.utils.getRequestParams();
                params.prolificId = params.url["prolificId"];
                params.studyId = params.url["studyId"];
                params.userAgent = navigator.userAgent;

                console.log("prolificId: " + params.prolificId);
                if (params.prolificId == null) {
                    console.error("prolificId Not Found");
                    alert("Invalid URL, Prolific ID Not Found.\n The results will not be recorded. Please contact the researcher.")
                }
                
                return $.getJSON(geoip_url, function(data) {
                    params.ipCity = data.city;
                    params.ipRegion = data.region;
                    params.ipCountry = data.country;
                }).always(function() {
                    let data = {
                        contentLanguage: litw_locale,
                        geoLoc: {
                            city: params.ipCity,
                            region: params.ipRegion,
                            country: params.ipCountry,
                        },
                        userAgent: params.userAgent,
                        urlParams: params.url
                    };
                    // submitData(data,"litw:initialize");
                });
            }
        },

        uuidv4 = function() {
            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
            /[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
        },
        _submit = function(obj_data, finalAttempt) {
            fetch(window.LITW.utils.APIBaseURL + 'survey/answer', {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj_data)
            }).then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch((error) => {
                    if (finalAttempt) {
                        console.error('Error:', error);
                    } else {
                        _submit(obj_data, true);
                    }
                });
        },
        submitStudyData = function() {
            let timeElapsed = jsPsych.totalTime()/1000/60;
            let comments = $('#floatingTextarea5').val();

            let result = {
                prolificId: getProlificId(),
                studyId: getStudyId(),
                answer: Data.result,
                time: timeElapsed,
                comments: comments,
            };
            console.log(result);
            _submit(result, false);
            nextPage();
        },
        submitConsent = function(accepted) {
            Data.consentAccepted = accepted;
        };

    /**** PUBLIC METHODS ****/
    var Data = {
        consentAccepted: false,
        surveyStartTime: null,
        skipTraining: false,
            questions: {},
    };
    exports.data = Data;
    exports.data.submitStudyData = submitStudyData;
    exports.data.submitConsent = submitConsent;
    exports.data.initialize = initialize;
    exports.data.getProlificId = getProlificId;
    exports.data.getStudyId = getStudyId;
    exports.data.getCountry = getCountry;
    exports.data.getCity = getCity;
    exports.data.getURLparams = getURLparams;
    exports.data.isInitialized = isInitialized;
    exports.data.getTopic = getTopic;
    exports.data.getTrainingData = getTrainingData;
    exports.data.getRandomAttentionCheck = getRandomAttentionCheck;
    exports.data.getQuestionData = getQuestionData;
    exports.data.setQuestion = setQuestion;
    exports.data.getLikertScaleQuestions = getLikertScaleQuestions;

})( window.LITW = window.LITW || {} );
