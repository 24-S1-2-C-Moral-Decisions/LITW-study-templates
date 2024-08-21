/*************************************************************
 * Main code, responsible for configuring the steps and their
 * actions.
 *
 * Author: LITW Team.
 *
 * © Copyright 2017-2023 LabintheWild.
 * For questions about this file and permission to use
 * the code, contact us at tech@labinthewild.org
 *************************************************************/

// load webpack modules
window.$ = window.jQuery = require("jquery");
require("bootstrap");
require("jquery-ui-bundle");
var _ = require('lodash');
var introTemplate = require("../templates/introduction.html");
var understandTemplate = require("../templates/understandTopic.html");
var twoStageSurveyTemplate = require("../templates/twoStageSurvey.html");
var loadingTemplate = require("../templates/loading.html");
var resultsTemplate = require("../templates/results.html");
var resultsFooter = require("../templates/results-footer.html");
var commentsTemplate = require("../templates/comments.html");
var informationTemplate = require("../templates/information.html")
var attentionTemplate = require("../templates/attention.html")

var likertScaleTemplate = require("../templates/LikertScale.html")

var leaveTemplate = require("../templates/leave.html")
require("../js/litw/jspsych-display-info");
require("../js/litw/jspsych-display-slide");
module.exports = (function(exports) {
	var timeline = [],
	params = {
		study_id: LITW.data.getStudyId(),
		study_recommendation: [],
		preLoad: ["../img/ajax-loader.gif"],
		slides: {
			INTRODUCTION: {
				name: "introduction",
				type: "display-slide",
				template: introTemplate,
				display_element: $("#intro"),
				display_next_button: false,
			},
			INFORMATION: {
				name: "information",
				type: "display-slide",
				template: informationTemplate,
				display_element: $("#infor"),
				display_next_button: false,
			},
			UNDERSTAND_TOPIC: {
				name: "understand-topic",
				type: "display-slide",
				template: understandTemplate,
				display_element: $("#understand-topic"),
				display_next_button: false,
			},
			TWO_STAGE_TRAINING: {
				name: "two-stage-survey",
				type: "display-slide",
				template: twoStageSurveyTemplate,
				display_element: $("#two-stage-survey"),
				display_next_button: false,
			},

			TWO_STAGE_SURVEY: {
				name: "two-stage-survey",
				type: "display-slide",
				template: twoStageSurveyTemplate,
				display_element: $("#two-stage-survey"),
				display_next_button: false,
			},

			ATTENTION_List: [
				{
					name: "attention",
					type: "display-slide",
					template: attentionTemplate,
					display_element: $("#attention"),
					display_next_button: false,
				},
				 {
					name: "attention",
					type: "display-slide",
					template: attentionTemplate,
					display_element: $("#attention"),
					display_next_button: false,
				}
			],

			LIKERT_SCALE_0: {
				name: "likert-scale",
				type: "display-slide",
				template: likertScaleTemplate,
				display_element: $("#likert-scale"),
				display_next_button: false,
			},
			LIKERT_SCALE_1: {
				name: "likert-scale",
				type: "display-slide",
				template: likertScaleTemplate,
				display_element: $("#likert-scale"),
				display_next_button: false,
			},

			COMMENTS: {
				type: "display-slide",
				template: commentsTemplate,
				display_element: $("#comments"),
				name: "comments",
				display_next_button: false,
			},
			RESULTS: {
				name: "results",
				type: "call-function",
				func: function(){
					calculateResults();
				}
			}
		}
	};

	function setUpSlideData() {
		isCon = false
		if(LITW.data.getTopic()== "controversy"){
			isCon = true
		}
		params.slides.UNDERSTAND_TOPIC.template_data = {
			topic: LITW.data.getTopic(),
			isCon,
		};
		params.slides.TWO_STAGE_TRAINING.template_data = {
			topic: LITW.data.getTopic(),
			isCon,
			isTraing: true,
			currentPage: 1,
			totalPage: 4,
			pageTitle: $.i18n("moral-training-header"),
			note: {
				desc: $.i18n("moral-training-note-desc"),
				items: [
					{
						title: $.i18n("moral-training-task1"),
						desc: [$.i18n("moral-training-task1-desc")]
					},
					{
						title: $.i18n("moral-training-task2-"+LITW.data.getTopic()),
						desc: [
							$.i18n("moral-training-task2-desc-"+LITW.data.getTopic()),
							$.i18n("moral-training-task2-desc")
						]
					}
				],
			},
			question: LITW.data.getTrainingData()
		};

		params.slides.TWO_STAGE_SURVEY.template_data = {
			topic: LITW.data.getTopic(),
			isCon,
			currentPage: 2,
			totalPage: 4,
			pageTitle: $.i18n("moral-survey-start"),
			note: {
				// desc: $.i18n("moral-survey-start"),
				items: [
					{
						title: $.i18n("moral-survey-note"),
						desc: [$.i18n("moral-survey-note-desc")]
					}
				],
			},
			question: LITW.data.getQuestionData(),
		};

		params.slides.LIKERT_SCALE_0.template_data = {
			currentPage: 3,
			totalPage: 4,
			...LITW.data.getLikertScaleQuestions(0),
		};

		params.slides.LIKERT_SCALE_1.template_data = {
			currentPage: 4,
			totalPage: 4,
			...LITW.data.getLikertScaleQuestions(1),
		};

		params.slides.ATTENTION_List.forEach((slide, index) => {
			slide.template_data = {
				...LITW.data.getRandomAttentionCheck(),
			};
		});
	}

	function configureStudy() {
		setUpSlideData();
		timeline.push(params.slides.INTRODUCTION);
		timeline.push({
			timeline: [
				params.slides.INFORMATION,
				params.slides.UNDERSTAND_TOPIC,
				{
					timeline: [
						params.slides.TWO_STAGE_TRAINING,
					],
					conditional_function: function(){
						console.log(LITW.data.skipTraining);
						return !LITW.data.skipTraining;
					}
				},
				params.slides.ATTENTION_List[0],
				{
					timeline: [
						params.slides.TWO_STAGE_SURVEY,
						params.slides.ATTENTION_List[1],
						{
							timeline: [
								params.slides.LIKERT_SCALE_0,
								params.slides.LIKERT_SCALE_1,
								params.slides.COMMENTS,
							],
							conditional_function: function(){
								return LITW.data.attentionCheckPassed;
								return true;
							}
						},
					],
					conditional_function: function(){
						return LITW.data.attentionCheckPassed;
						return true;
					}
				},
			],
			conditional_function: function(){
				// return LITW.data.consentAccepted;
				return true;
			}
		});
		timeline.push(params.slides.RESULTS);
	}

	function calculateResults() {
		//TODO: Nothing to calculate
		let results_data = {}
		showResults(results_data, true)
	}

	function showResults(results = {}, showFooter = false) {
		if('PID' in params.URL) {
			//REASON: Default behavior for returning a unique PID when collecting data from other platforms
			results.code = LITW.data.getParticipantId();
		}

		$("#results").html(
			resultsTemplate({
				data: results
			}));
		if(showFooter) {
			$("#results-footer").html(resultsFooter(
				{
					share_url: window.location.href,
					share_title: $.i18n('litw-irb-header'),
					share_text: $.i18n('litw-template-title'),
					more_litw_studies: params.study_recommendation
				}
			));
		}
		$("#results").i18n();
		LITW.utils.showSlide("results");
	}

	function readSummaryData() {
		$.getJSON( "summary.json", function( data ) {
			//TODO: 'data' contains the produced summary form DB data
			//      in case the study was loaded using 'index.php'
			//SAMPLE: The example code gets the cities of study partcipants.
			console.log(data);
		});
	}

	const APIBaseURL = API_URL;
	function startStudy() {
		// save URL params
		params.URL = LITW.utils.getRequestParams();
		// if( Object.keys(params.URL).length > 0 ) {
		// 	LITW.data.submitData(params.URL,'litw:paramsURL');
		// }
		// populate study recommendation
		// LITW.engage.getStudiesRecommendation(2, (studies_list) => {
		// 	params.study_recommendation = studies_list;
		// });
		// initiate pages timeline
		jsPsych.init({
		  timeline: timeline
		});
	}

	function startExperiment(){
		//TODO These methods should be something like act1().then.act2().then...
		//... it is close enough to that... maybe the translation need to be encapsulated next.
		// get initial data from database (maybe needed for the results page!?)
		//readSummaryData();

		// generate unique participant id and geolocate participant
		LITW.data.initialize(APIBaseURL);

		// determine and set the study language
		$.i18n().locale = LITW.locale.getLocale();
		var languages = {
			'en': './i18n/en.json?v=1.0',
			'pt': './i18n/pt-br.json?v=1.0',
		};
		//TODO needs to be a little smarter than this when serving specific language versions, like pt-BR!
		var language = LITW.locale.getLocale().substring(0,2);
		var toLoad = {};
		if(language in languages) {
			toLoad[language] = languages[language];
		} else {
			toLoad['en'] = languages['en'];
		}

		LITW.utils.fetchQuestions().then(data => {
			if (Object.keys(data).length > 0) {
				LITW.data.setQuestion(data);

				fetch('./i18n/en.json', {
					method: 'GET',
					headers: {
						'Accept': 'application/json'
					}
				})
				.then(response => {
					if (!response.ok) {
						throw new Error('Network response was not ok');
					}
					return response.json();
				})
				.then(json => {
					$.i18n().load({
						'en': json
					}).done(function () {
						$('head').i18n();
						$('body').i18n();
		
						LITW.utils.showSlide("img-loading");
		
						jsPsych.pluginAPI.preloadImages(params.preLoad,
							function () {
								configureStudy();
								startStudy();
							},
		
							function (numLoaded) {
								$("#img-loading").html(loadingTemplate({
									msg: $.i18n("moral-template-loading"),
									numLoaded: numLoaded,
									total: params.preLoad.length
								}));
							}
						);
					});
				})
				.catch(error => {
					console.error('error', error);
				});
			}
		});
	}

	// function startExperiment(){
	// 	//TODO These methods should be something like act1().then.act2().then...
	// 	//... it is close enough to that... maybe the translation need to be encapsulated next.
	// 	// get initial data from database (maybe needed for the results page!?)
	// 	//readSummaryData();
	//
	// 	// determine and set the study language
	// 	$.i18n().locale = LITW.locale.getLocale();
	// 	var languages = {
	// 		'en': './i18n/en.json?v=1.0',
	// 		'pt': './i18n/pt-br.json?v=1.0',
	// 	};
	// 	//TODO needs to be a little smarter than this when serving specific language versions, like pt-BR!
	// 	var language = LITW.locale.getLocale().substring(0,2);
	// 	var toLoad = {};
	// 	if(language in languages) {
	// 		toLoad[language] = languages[language];
	// 	} else {
	// 		toLoad['en'] = languages['en'];
	// 	}
	// 	$.i18n().load(toLoad).done(
	// 		function() {
	// 			$('head').i18n();
	// 			$('body').i18n();
	//
	// 			LITW.utils.showSlide("img-loading");
	// 			//start the study when resources are preloaded
	// 			jsPsych.pluginAPI.preloadImages(params.preLoad,
	// 				function () {
	// 					configureStudy();
	// 					startStudy();
	// 				},
	//
	// 				// update loading indicator
	// 				function (numLoaded) {
	// 					$("#img-loading").html(loadingTemplate({
	// 						msg: $.i18n("litw-template-loading"),
	// 						numLoaded: numLoaded,
	// 						total: params.preLoad.length
	// 					}));
	// 				}
	// 			);
	// 		});
	// }

	// when the page is loaded, start the study!
	$(document).ready(function() {
		startExperiment();
	});
	exports.study = {};
	exports.study.params = params
	exports.utils.APIBaseURL = APIBaseURL
})( window.LITW = window.LITW || {} );


// const situation_1_title = "AITA for not wanting my husband to go back to school";
// const situation_1_text = "Throwaway, husband uses reddit. \n\nBackstory first. I (27f) work full time as does my husband (26m). I do make more than my husband and the dicotomy is only going to increase as time goes due to my line of work. We have two kids, a 2 and a half year old  and a 10 month old. We both love our kids endlessly and share equally in all parental duties. \n\nnAll that said, I do work earlier than my husband and pick both of our children up from their respective daycares and am home with them for a couple hours before my husband gets home. When he gets home, he is more often than not in a, for lack of a better word, shitty mood. He does not like his job, and that stress follows him home. \n\nWe are not financially well off at the moment but in the future due to my job, we have spoken of the possibility of him being a stay at home dad. This is the future that I thought we were working towards. \n\nAbout a month ago, my husband informed me that he was in the process of applying for college. I was a little taken aback due to us both talking about our future with him at home. I am trying to be supportive of the idea, but, did mention that i had thought that he was looking forward to being a stay at home dad. \n\nThat is where I left the conversation. I did not tell him of my other concerns which are more responsible for my disagreement with him going back to school. I mentioned that he is in a shitty mood sometimes when he gets back home, and that attitude can sometimes be taken out on our kids. \n\nNow, I do want to stress that he is a great and loving father, but, on some days, seeing the way he interacts with our children can be heartbreaking. He can be short with them and often will shout at our oldest. Every interruption the kids can cause is likely to upset him and cause him to be angry. Most nights I will take over caring for the kids to give him a break as I can see that he is in a bad mood. \n\nThe financial aspect of college is also an issue I have. As I mentioned, we are not too financially well off and I do not know how well we could manage the prospect of student loans.";
// const situation_2_title = "AITA for complaining that I was not allowed in the pool as it was a ‘Women only’ session.";
// const situation_2_text = "Took my kids swimming. Toddler was happy in the baby pool, but the eldest wanted to go in the big pool. I went with her, but was told to get out as I am male. I think it was discrimination, the pool say they’re meeting a demand from the public and are being inclusive.";
// const situation_3_title = "AITA for calling my fat friend fat after she called me a twig?";
// const situation_3_text = "I am very self conscious about my weight. I am very skinny because of my fast metabolism and im very bony. It tears me apart when i hear people calling me a twig. I was eating lunch with some of my friends and the biggest one in the group said \"Eat\" when i was throwing out half of my sandwich. I said \"Im not hungry \" and she said \" You have to eat, your a twig\" they already know i have a fast metabolism because i told them before about it when they asked why i was so bony. I snapped back and said \" I'd rather be a twig then a whole tree\" and suddenly im the asshole. Everyone in my group of friends hate me and i want to know if its my fault.";
