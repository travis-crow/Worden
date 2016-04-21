//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('fileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
	
	$scope.authors = [];
	$scope.results = false;
	$scope.loading = false;
	$scope.currentAuthorIndex;
	$scope.uploadFiles = function (files) {
		$scope.files = files;
	};
	
	$scope.uploadAuthors = false;
	$scope.uploadGenericSet = false;

	$scope.selectUploadAuthors = function () {
		$scope.uploadGenericSet = false;
		$scope.uploadAuthors = true;
	}
	$scope.addAuthor = function (){
		$scope.addNewAuthor = true;
	}
	
	$scope.submitNewAuthor = function() {
		var author = {};
		author.Name = $scope.addNewAuthorName;
		$scope.authors.push(author);
		$scope.addNewAuthor = false;
		$scope.addNewAuthorName = "";
		
	}
	$scope.selectAuthor = function(index) {
		if(angular.isDefined($scope.currentAuthorIndex)){
			$scope.authors[index].Class = "Inactive";
		}
		$scope.authors[index].Class = "selectedAuthor";
		$scope.currentAuthor = $scope.authors[index];
	}
	
	$scope.setFile = function() {
		if(angular.isUndefined($scope.currentAuthor.Files)){
			$scope.currentAuthor.Files = [];
		}
		$scope.currentAuthor.Files.push($scope.currentAuthor.UploadFile);
		$scope.currentAuthor.UploadFile = {};
	}
	$scope.selectUploadGenericSet = function () {
		$scope.uploadAuthors = false;
		$scope.uploadGenericSet = true;
	}
	
	
	$scope.processResults = function (data) {
		
		var infoGainFeatures = $scope.results.InfoGain;
		var featureLine = infoGainFeatures.split('\n');

		var FEATURE_INDEX = 1;
		var WEIGHT_INDEX = 2;
		var STYLE_TOKENS_REGEX = /\(([)]+)\)/;
		var numbersCount = 0;
		var uniqueCharactersCount = 0;
		var misspelledWordsCount = 0;
		var punctuationCount = 0;
		var wordLengthsCount = 0;
		var wordsAndWordCombinationsCount = 0;
		var lettersAndLetterCombinationsCount = 0;
		var functionWordsCount = 0;

		createEmptyCard('misspelled-words', 'Misspelled Words');
		createEmptyCard('words-and-word-combinations', 'Short Phrases');
		createEmptyCard('function-words', "Common Words");
		createEmptyCard('punctuation', "Punctuation");
		createEmptyCard('unique-character', 'Unique Characters');
		createEmptyCard('word-lengths', "Word Lengths");
		createEmptyCard('number', 'Numbers');
		createEmptyCard('letters-and-letter-combinations', "Letters");
		
		for (var i = 0; i < featureLine.length; i++) {
			if (featureLine[i] === ">-----InfoGain information: " || featureLine[i] === "") {
				continue;
			}

			var tokens = featureLine[i].split(/\s+/g);
			if (tokens.length > 3) {
				continue; // "Simple" feature, passing for now...
			}
			var feature = tokens[FEATURE_INDEX];
			var weight = tokens[WEIGHT_INDEX];
			
			var featureTokens = feature.split('{');
			var featureName = featureTokens[0];
			var featureStyles = featureTokens[1];

			if (featureName == "Digits" || featureName == "Two-Digit-Numbers" || featureName == "Three-Digit-Numbers") {
				numbersCount++;
				if (numbersCount > 12) {
					continue;
				}
				createCard(featureStyles, 'number', 'Numbers', 'You seem to use the following numbers a lot in your writing, the topmost ones being the most revealing. Try removing as many of them as you can by generalizing them away, referring to them by pronouns, or converting them to their written form where possible in the document you want to anonymize:');
			} else if (featureName == "Special-Characters") {
				uniqueCharactersCount++;
				if (uniqueCharactersCount > 12) {
					continue;
				}
				createCard(featureStyles, 'unique-character', 'Unique Characters', 'You seem to use the following special characters a lot in your writing, the topmost ones being the most revealing. Try avoiding them or removing extraneous uses where possible in the document you want to anonymize:');
			} else if (featureName == "Misspelled-Words") {
				misspelledWordsCount++;
				if (misspelledWordsCount > 12) {
					continue;
				}
				createCard(featureStyles, 'misspelled-words', 'Misspelled Words', 'You seem to misspell the following words frequently in your writing, the topmost ones being the most revealing. Try finding these misspellings and fixing them in the document you want to anonymize:');
			} else if (featureName == "Punctuation") {
				punctuationCount++;
				if (punctuationCount > 12) {
					continue;
				}
				var feature = featureStyles.substring(0, featureStyles.length - 1);
				var featureToDisplay = feature;
				if (feature === '.') {
					featureToDisplay = 'Periods (.)';
				} else if (feature === ',') {
					featureToDisplay = "Commas (,)";
				} else if (feature === "'") {
					featureToDisplay = "Apostrophes (')";
				} else if (feature === ";") {
					featureToDisplay = "Semicolons (;)";
				} else if (feature === ":") {
					featureToDisplay = "Colons (:)";
				} else if (feature === '"') {
					featureToDisplay = 'Quotes (")';
				} else if (feature === '?') {
					featureToDisplay = "Question marks (?)";
				} else if (feature === '!') {
					featureToDisplay = "Exclamation marks (!)";
				}
				
				if (document.getElementById("punctuation-card") == null) {
					createEmptyCard("punctuation", "Punctuation");
				} else {
					$("#punctuation-list").append('<li>' + featureToDisplay + '</li>');
				}
			} else if (featureName == "Word-Lengths") {
				wordLengthsCount++;
				if (wordLengthsCount > 12) {
					continue;
				}
				createCard(featureStyles, 'word-lengths', "Word Lengths", 'You seem to use words of the following lengths frequently in your writing, the topmost ones being the most revealing. Try finding words of these lengths in the document you want to anonymize and replacing them with longer or shorter synonyms:');
			} else if (featureName == "Letters" || featureName == "Top-Letter-bigrams" || featureName == "Top-Letter-trigrams") {
				lettersAndLetterCombinationsCount++;
				if (lettersAndLetterCombinationsCount > 12) {
					continue;
				}
				createCard(featureStyles, 'letters-and-letter-combinations', "Letters", 'You seem to use the following letters and letter combinations frequently in your writing, the topmost ones being the most revealing. Try searching your document to anonymize for occurrences and removing them where possible:');
			} else if (featureName == "Function-Words") {
				functionWordsCount++;
				if (functionWordsCount > 12) {
					continue;
				}
				createCard(featureStyles, 'function-words', "Common Words", 'You seem to use the following word combinations frequently in your writing, the topmost ones being the most revealing. Try rewording these phrases or avoiding them entirely in the document you want to anonymize:');
			} else if (featureName == "Words" || featureName == "Word-Bigrams" || featureName == "Word-Trigrams") {
				wordsAndWordCombinationsCount++;
				if (wordsAndWordCombinationsCount > 12) {
					continue;
				}

				var words = featureStyles.substring(0, featureStyles.length - 1);
				var processedWords = "";
				if (featureName == "Words") {
					processedWords = words;
				} else {
					var wordTokens = words.split(")-(");
					wordTokens[0] = wordTokens[0].substring(1, wordTokens[0].length);
					wordTokens[wordTokens.length-1] = wordTokens[wordTokens.length-1].substring(0, wordTokens[wordTokens.length-1].length-1);
					for (var w = 0; w < wordTokens.length; w++) {
						processedWords = processedWords + wordTokens[w] + " ";
					}
				}

				$("#words-and-word-combinations-list").append('<li>' + processedWords + '</li>');
			}
		}
		
		removeAllEmptyCards();

		// $("ul.tabs").tabs();
		$('ul.tabs').tabs({
			changeListener: function (content) {
				console.log(content);
			}
		});

		$('.distribution-trigger').leanModal();
	};
	
	
	function sortAuthorPercentages(percentageAuthor1, percentageAuthor2) {
		return (percentageAuthor2[0] - percentageAuthor1[0]);
	}

	function createCard(featureStyles, id, title, description) {
		var feature = featureStyles.substring(0, featureStyles.length - 1);
		if (document.getElementById(id+"-card") == null) {
			createEmptyCard(id, title);
		} else {
			$("#"+id+"-list").append('<li>' + feature + '</li>');
		}
	}

	function createEmptyCard(id, title) {
		$("#suggestions").append('<div class="col s12 m6 l4" id="'+id+'-card">'
								 + '<div class="card">'
								  + '<div class="card-content">'
								   + '<span class="card-title purple-text">'+title+'</span>'
								   // + '<p>'+description+'</p>'
								   + '<div class="card-wrapper">'
								    + '<ul id="'+id+'-list">'
								    + '</ul>'
								    + '<br />'
								   + '</div'
								  + '</div>'
								 + '</div>');
	}
	
	function removeAllEmptyCards() {
		$("#suggestions").children().each(function () {
			var card = $(this).children(0);
			card.children().each(function() {
				var cardContent = $(this).children(0);
				cardContent.children().each(function() {
					if ($(this).is("ul")) {
						// If the list is empty, there's no reason to have the card still, remove it.
						if ($(this).children(0).size() == 0) {
							card.parent().remove();
						}
					}
				});
			});
		});
	}
	
	$scope.setSuspectedAuthor = function(){
		var currentHighest = 0.00;
		var currentSuspect = "";
		angular.forEach($scope.results.experimentContents[0].probabilityMap, function(value, key) {
			var tmpValue = parseFloat(value[Object.keys(value)[0]]);
			if (tmpValue > currentHighest){
				console.log(Object.keys(value)[0]);
				currentSuspect = Object.keys(value)[0];
				currentHighest = tmpValue;
			}
		});
		
		if (currentSuspect !== "userAuthor" && currentSuspect !== "testAuthor") {
			$scope.verdict = "You remained anonymous for"
			$scope.suspected = "you are not";
			$scope.response = "Your features below are similar enough to the other writers that Worden cannot decide whether or not you're the true author. Congratulations!";
		} else {
			$scope.verdict = "You've been identified for"
			$scope.suspected = "you are";
			$scope.response = "Try adding more occurrences of the features below that are infrequently used and removing occurrences of features that appear frequently to make your document similar to the other suspects' documents, then process your document again.";
			//$scope.response = "You use the following features a unique number of times compared to the other writers. Try adding more occurrences of ones that appear infrequently and removing occurrences of ones that appear frequently to become more consistent with the other suspects then try processing your document again.";
		}
	};
	
	$scope.startUpload = function() {
		$scope.loading = true;
		 if ($scope.files && $scope.files.length) {
			 Upload.upload({
				 url: '/Worden/StartProcess',
				 data: {
					 files: $scope.files,
					 test: $scope.testFile,
					 type: $scope.type
				 }
			 }).then(function (response) {
				 $timeout(function () {
				$scope.results	= angular.copy(response.data);
					 $scope.processResults();
					 $scope.setSuspectedAuthor();
					 $scope.loading = false;
					 
				 });
			 }, function (response) {
				 if (response.status > 0) {
					 $scope.errorMsg = response.status + ': ' + response.data;
				 }
			 }, function (evt) {
			   
			 });
		 }
	};
}]);