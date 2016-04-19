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

	$scope.selectUploadAuthors = function (){
		$scope.uploadGenericSet = false;
		$scope.uploadAuthors = true;
	}
	$scope.addAuthor = function (){
		$scope.addNewAuthor = true;
	}
	
	$scope.submitNewAuthor = function(){
		var author = {};
		author.Name = $scope.addNewAuthorName;
		$scope.authors.push(author);
		$scope.addNewAuthor = false;
		$scope.addNewAuthorName = "";
		
	}
	$scope.selectAuthor = function(index){
		if(angular.isDefined($scope.currentAuthorIndex)){
			$scope.authors[index].Class = "Inactive";
		}
		$scope.authors[index].Class = "selectedAuthor";
		$scope.currentAuthor = $scope.authors[index];
	}
	
	$scope.setFile = function(){
		if(angular.isUndefined($scope.currentAuthor.Files)){
			$scope.currentAuthor.Files = [];
		}
		$scope.currentAuthor.Files.push($scope.currentAuthor.UploadFile);
		$scope.currentAuthor.UploadFile = {};
	}
	$scope.selectUploadGenericSet = function (){
		$scope.uploadAuthors = false;
		$scope.uploadGenericSet = true;
	}
	
	
	$scope.processResults = function (data){
		
			var infoGainFeatures = $scope.results.InfoGain;
			var featureLine = infoGainFeatures.split('\n');

			var FEATURE_INDEX = 1;
			var WEIGHT_INDEX = 2;
			var STYLE_TOKENS_REGEX = /\(([)]+)\)/;
			var numbersFontWeight = 900;
			var uniqueCharactersFontWeight = 900;
			var misspelledWordsFontWeight = 900;
			var punctuationFontWeight = 900;
			var wordLengthsFontWeight = 900;
			var wordsAndWordCombinationsFontWeight = 900;
			var lettersAndLetterCombinations = 900;
			var functionWordsFontWeight = 900;
			var numbersCount = 0;
			var uniqueCharactersCount = 0;
			var misspelledWordsCount = 0;
			var punctuationCount = 0;
			var wordLengthsCount = 0;
			var wordsAndWordCombinationsCount = 0;
			var lettersAndLetterCombinationsCount = 0;
			var functionWordsCount = 0;

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
					if (numbersCount > 10) {
						return;
					}
					createCard(featureStyles, 'number', 'Numbers', numbersFontWeight, 'You seem to use the following numbers at a frequency distinct from your peers, the topmost ones being the most unique to you. Try adding numbers, or removing them by generalizing them away, referring to them by pronouns, or converting them to/from their written form in a manner more consistent with other potential suspects:');
					if (numbersFontWeight > 300) {
						numbersFontWeight-=100;
					}
				} else if (featureName == "Special-Characters") {
					uniqueCharactersCount++;
					if (uniqueCharactersCount > 10) {
						return;
					}
					createCard(featureStyles, 'unique-character', 'Unique Characters', uniqueCharactersFontWeight, 'You seem to use the following special characters at a frequency distinct from your peers, the topmost ones being the most unique to you. Try removing characters that are unique to your document or adding more special characters that the other suspects\' documents use in the document you want to anonymize:');
					if (uniqueCharactersFontWeight > 300) {
						uniqueCharactersFontWeight-=100;
					}
				} else if (featureName == "Misspelled-Words") {
					misspelledWordsCount++;
					if (misspelledWordsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'misspelled-words', 'Misspelled Words', misspelledWordsFontWeight, 'You seem to misspell the follow at a frequency distinct from your peers, the topmost ones being the most unique to you. Try finding these misspellings and fixing them or adding more mispellings intentionally in the document you want to anonymize:');
					if (misspelledWordsFontWeight > 300) {
						misspelledWordsFontWeight-=100;
					}
				} else if (featureName == "Punctuation") {
					punctuationCount++;
					if (punctuationCount > 10) {
						continue;
					}
					createCard(featureStyles, 'punctuation', "Punctuation", punctuationFontWeight, 'You use the following punctuation at a frequency distinct from your peers, the topmost ones being the most unique to you. Try substituting these punctuation marks with others, removing them entirely, or utilizing them in your document to anonymize:');
					if (punctuationFontWeight > 300) {
						punctuationFontWeight-=100;
					}
				} else if (featureName == "Word-Lengths") {
					wordLengthsCount++;
					if (wordLengthsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'word-lengths', "Word Lengths", wordLengthsFontWeight, 'You seem to use words of the following lengths at a frequency distinct from your peers, the topmost ones being the most unique to you. Try finding words of these lengths in the document you want to anonymize and replacing them with longer or shorter synonyms or converting other words to this length, as appropriate:');
					if (wordLengthsFontWeight > 300) {
						wordLengthsFontWeight-=100;
					}
				} else if (featureName == "Letters" || featureName == "Top-Letter-bigrams" || featureName == "Top-Letter-trigrams") {
					lettersAndLetterCombinationsCount++;
					if (lettersAndLetterCombinationsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'letters-and-letter-combinations', "Letters and Letter Combinations", lettersAndLetterCombinations, 'You seem to use the following letters and letter combinations at a frequency distinct from your peers, the topmost ones being the most unique to you. Try modifying your document to anonymize by removing them or adding them where possible:');
					if (lettersAndLetterCombinations > 300) {
						lettersAndLetterCombinations-=100;
					}
				} else if (featureName == "Function-Words") {
					functionWordsCount++;
					if (functionWordsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'function-words', "Function Words", functionWordsFontWeight, 'You seem to use the following word combinations at a frequency distinct from your peers, the topmost ones being the most unique to you. Try rewording these phrases, avoiding them entirely, or adding them in appropriate places in the document you want to anonymize:');
					if (functionWordsFontWeight > 300) {
						functionWordsFontWeight-=100;
					}
				} else if (featureName == "Words" || featureName == "Word-Bigrams" || featureName == "Word-Trigrams") {
					wordsAndWordCombinationsCount++;
					if (wordsAndWordCombinationsCount > 10) {
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

					if (document.getElementById("words-and-word-combinations-card") == null) {
						$("#suggestions").append('<div class="col s12 m6 l4" id="words-and-word-combinations-card">'
												 + '<div class="card">'
												  + '<div class="card-content">'
												   + '<span class="card-title purple-text">Words and Word Combinations</span>'
												   + '<p>You seem to use the following word combinations at a frequency distinct from your peers, the topmost ones being the most unique to you. Try rewording these phrases, avoiding them, or adding them in appropriate places in the document you want to anonymize:</p>'
												   + '<ul id="words-and-word-combinations-list">'
													+ '<li style="font-weight:'+wordsAndWordCombinationsFontWeight+';">' + processedWords + '</li>'
												   + '</ul>'
												  + '</div>'
												 + '</div>');
					} else {
						$("#words-and-word-combinations-list").append('<li style="font-weight:'+wordsAndWordCombinationsFontWeight+';">' + processedWords + '</li>');
					}

					if (wordsAndWordCombinationsFontWeight > 300) {
						wordsAndWordCombinationsFontWeight-=100;
					}
				}
			}
		
		
		client.send();

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

	function createCard(featureStyles, id, title, fontWeight, description) {
		var feature = featureStyles.substring(0, featureStyles.length - 1);
		if (document.getElementById(id+"-card") == null) {
			$("#suggestions").append('<div class="col s12 m6 l4" id="'+id+'-card">'
									 + '<div class="card">'
									  + '<div class="card-content">'
									   + '<span class="card-title purple-text">'+title+'</span>'
									   + '<p>'+description+'</p>'
									   + '<ul id="'+id+'-list">'
										+ '<li style="font-weight:'+fontWeight+';">' + feature + '</li>'
									   + '</ul>'
									  + '</div>'
									 + '</div>');
		} else {
			$("#"+id+"-list").append('<li style="font-weight:'+fontWeight+';">' + feature + '</li>');
		}
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
			$scope.suspected = "you are not";
		} else {
			$scope.suspected = "you are";
		}
	};
	
	$scope.startUpload = function(){
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