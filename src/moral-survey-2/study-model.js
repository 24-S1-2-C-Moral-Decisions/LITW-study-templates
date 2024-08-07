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
var moralAnnouncementTemplate = require("../templates/moralAnnounce.html");
// var demographicsTemplate = require("../templates/demographics.html");
var loadingTemplate = require("../templates/loading.html");
var resultsTemplate = require("../templates/results.html");
var resultsFooter = require("../templates/results-footer.html");
var commentsTemplate = require("../templates/comments.html");
var informationTemplate = require("../templates/information.html")
var leaveTemplate = require("../templates/leave.html")
require("../js/litw/jspsych-display-info");
require("../js/litw/jspsych-display-slide");

// load survey templates
var motivationSurvey = require("./content/motivationSurvey.html");
var mock_survey = require("./content/mocksurvey.html");
var attention_t = require("./content/attention.html");
var real_survey1 = require("./content/realsurvey1.html");

module.exports = (function(exports) {
	var timeline = [],
	params = {
		study_id: "TO_BE_ADDED_IF_USING_LITW_INFRA",
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
			INFORMED_CONSENT: {
				name: "informed_consent",
				type: "display-slide",
				template: moralAnnouncementTemplate,
				display_element: $("#moral-announcement"),
				display_next_button: false,
			},
			// DEMOGRAPHICS: {
			// 	type: "display-slide",
			// 	template: demographicsTemplate,
			// 	display_element: $("#demographics"),
			// 	name: "demographics",
			// 	finish: function(){
			// 		var dem_data = $('#demographicsForm').alpaca().getValue();
			// 		LITW.data.submitDemographics(dem_data);
			// 	}
			// },
			SURVEY1:{
				name: "motivationsurvey",
				type: "display-slide",
				template: motivationSurvey,
				display_element: $("#motivationsurvey"),
				display_next_button: false,
			},
			MOCK_SURVEY: {
				name: "mock-survey",
				type: "display-slide",
				template: mock_survey,
				display_element: $("#mock-survey"),
				display_next_button: false,
			},
			ATTENTION: {
				name: "attention",
				type: "display-slide",
				template: attention_t,
				display_element: $("#attention"),
				display_next_button: false,
			},
			REAL_SURVEY1: {
				name: "real-survey1",
				type: "display-slide",
				template: real_survey1,
				display_element: $("#real-survey1"),
				display_next_button: false,
				// finish: function(){
				// 	const q1_individual_jud = $('input[name="options"]:checked').val();
				// 	const q1_individual_conf = $('input[name="decision"]:checked').val();
				// 	const q1_group_YA_jud = $('input[name="YA-options"]:checked').val();
				// 	const q1_group_YA_conf = $('input[name="YA-decision"]:checked').val();
				// 	const q1_group_NA_jud = $('input[name="NA-options"]:checked').val();
				// 	const q1_group_NA_conf = $('input[name="NA-decision"]:checked').val();
				// 	LITW.data.setSurvey({
				// 		question_no:1,
				// 		type:"individual_group",
				// 		ind_judge:q1_individual_jud,
				// 		ind_confidence:q1_individual_conf,
				// 		ind_YA_judge:q1_YA_individual_jud,
				// 		ind_YA_confidence:q1_YA_individual_conf,
				// 		ind_NA_judge:q1_NA_individual_jud,
				// 		ind_NA_confidence:q1_NA_individual_conf,
				// 	})
				// }
			},
			COMMENTS: {
				type: "display-slide",
				template: commentsTemplate,
				display_element: $("#comments"),
				name: "comments",
				display_next_button: false,
				// finish: function(){
				// 	var comments = $('#commentsForm').alpaca().getValue();
				// 	if (Object.keys(comments).length > 0) {
				// 		LITW.data.submitComments({
				// 			comments: comments
				// 		});
				// 	}
				// }
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

	function configureStudy() {
		timeline.push(params.slides.INTRODUCTION);
		timeline.push(params.slides.INFORMED_CONSENT);
		timeline.push(params.slides.INFORMATION);
		timeline.push(params.slides.SURVEY1);
		timeline.push(params.slides.ATTENTION);
		timeline.push({
			timeline: [
				params.slides.REAL_SURVEY1,
				params.slides.COMMENTS,
			],
			conditional_function: function(){
				// console.log("Attention:", attention);
				return attention;
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

	var selftexts = [];
	var titles = [];
	var img = [];
	var NA_percentage;
	var YA_percentage;
	var very_certain_YA;
	var very_certain_NA;
	function startStudy() {
		// generate unique participant id and geolocate participant
		LITW.data.initialize();
		// save URL params
		params.URL = LITW.utils.getParamsURL();
		if( Object.keys(params.URL).length > 0 ) {
			LITW.data.submitData(params.URL,'litw:paramsURL');
		}
		// populate study recommendation
		LITW.engage.getStudiesRecommendation(2, (studies_list) => {
			params.study_recommendation = studies_list;
		});
		// initiate pages timeline
		jsPsych.init({
		  timeline: timeline
		});
	}

	const APIBaseURL = API_URL;
	function startExperiment(){
		//TODO These methods should be something like act1().then.act2().then...
		//... it is close enough to that... maybe the translation need to be encapsulated next.
		// get initial data from database (maybe needed for the results page!?)
		//readSummaryData();

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

		const prolificId = new URLSearchParams(window.location.search).get('prolificId');
		console.log("prolificId: " + prolificId);
		if (prolificId == null) {
			console.error("prolificId Not Found");
			alert("Invalid URL, Prolific ID Not Found.\n The results will not be recorded. Please contact the researcher.")
		}
		else 
			result.prolificId = prolificId;

		// console.log(APIBaseURL)
		fetch(APIBaseURL + 'survey/question?studyId=1', {
			method: 'GET',
			headers: {
				'Accept': '*/*'
			},
		})
		.then(response => {
			if (!response.ok) {
				throw new Error(response);
			}
			return response.json();
		})
		.then(data => {
			console.log(data);
			img = data._id;
			selftexts = data.selftext;
			titles = data.title;
			NA_percentage = data.NA_percentage
			YA_percentage = data.YA_percentage
			very_certain_YA = data.very_certain_YA
			very_certain_NA = data.very_certain_NA
			sessionStorage.setItem('img', JSON.stringify(img));
			console.log("Self Texts:", selftexts);
			console.log("Titles:", titles);

			return fetch('./i18n/en.json', {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			});
		})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(json => {
			YA = Math.round(YA_percentage * 100)
			NA = Math.round(NA_percentage * 100)
			certain_NA = Math.floor(very_certain_NA * 100)
			certain_YA = Math.floor(very_certain_YA * 100)
			YA_NA_percentage = YA.toString() + ":" + NA.toString()
			YA_percentage = YA.toString()
			NA_percentage = NA.toString()
			very_certain_NA = certain_NA.toString()
			very_certain_YA = certain_YA.toString()
			json["moral-situation-1-title"] = titles;
			json["moral-situation-1-text"] = selftexts;
			json["moral-sur2-body-YA-percent"] = YA_NA_percentage;
			json["moral-sur2-body-YA-num"] = YA_percentage + "%";
			json["moral-sur2-body-YA-num2"] = NA_percentage + "%";
			json["moral-real-group-NA-certain"] = very_certain_NA;
			json["moral-real-group-YA-certain"] = very_certain_YA
			// json["moral-situation-2-title"] = titles[1];
			// json["moral-situation-2-text"] = selftexts[1];
			// json["moral-situation-3-title"] = titles[2];
			// json["moral-situation-3-text"] = selftexts[2];

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
							msg: $.i18n("litw-template-loading"),
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
