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
    	 var jStyloResults = data;
    	 var RESULTS_DIVIDER = "\n~~~~\n";
			var resultPieces = jStyloResults.split(RESULTS_DIVIDER);
			var certainty = resultPieces[1];
			var certaintyLines = certainty.split('\n');
			var names = certaintyLines[0].split('|');
			var percentages = certaintyLines[2].split('|');
			var documentName = percentages[0].trim();
			var chosenAuthor = "";
			var certaintyPercentage = 0;
			var combinedLists = [];
			for (var p = 1; p < percentages.length; p++) {
				var tmpPercentage = Math.round(Number(parseInt(0.5 + (percentages[p].split(" ")[1] * 100))));
				var tmpAuthorName = names[p].trim();
				var tmpList = [tmpPercentage, tmpAuthorName];
				if (tmpAuthorName == "_Unknown_" || !tmpAuthorName) {
					continue;
				}
				if (percentages[p].indexOf('+') != -1) {
					certaintyPercentage	= tmpPercentage;
					chosenAuthor = tmpAuthorName;
				}
				combinedLists.push(tmpList);
			}
			combinedLists.sort(sortAuthorPercentages);
			for (var p = 0; p < combinedLists.length; p++) {
				$("#certaintyTable").append("<tr>"
											 +"<td>"+combinedLists[p][1]+"</td>"
											 +"<td>"+combinedLists[p][0]+"%</td>"
										   +"</tr>");
			}
			$("#suspectedAuthor").append(chosenAuthor);
			$(".documentName").append(documentName);
			$("#numberOfAuthors").append(percentages.length-4);

			var infoGainFeatures = resultPieces[0];
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
				if (featureLine[i] == ">-----InfoGain information: ") {
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
					createCard(featureStyles, 'number', 'Numbers', numbersFontWeight);
					if (numbersFontWeight > 300) {
						numbersFontWeight-=100;
					}
				} else if (featureName == "Special-Characters") {
					uniqueCharactersCount++;
					if (uniqueCharactersCount > 10) {
						return;
					}
					createCard(featureStyles, 'unique-character', 'Unique Characters', uniqueCharactersFontWeight);
					if (uniqueCharactersFontWeight > 300) {
						uniqueCharactersFontWeight-=100;
					}
				} else if (featureName == "Misspelled-Words") {
					misspelledWordsCount++;
					if (misspelledWordsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'misspelled-words', 'Misspelled Words', misspelledWordsFontWeight);
					if (misspelledWordsFontWeight > 300) {
						misspelledWordsFontWeight-=100;
					}
				} else if (featureName == "Punctuation") {
					punctuationCount++;
					if (punctuationCount > 10) {
						continue;
					}
					createCard(featureStyles, 'punctuation', "Punctuation", punctuationFontWeight);
					if (punctuationFontWeight > 300) {
						punctuationFontWeight-=100;
					}
				} else if (featureName == "Word-Lengths") {
					wordLengthsCount++;
					if (wordLengthsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'word-lengths', "Word Lengths", wordLengthsFontWeight);
					if (wordLengthsFontWeight > 300) {
						wordLengthsFontWeight-=100;
					}
				} else if (featureName == "Letters" || featureName == "Top-Letter-bigrams" || featureName == "Top-Letter-trigrams") {
					lettersAndLetterCombinationsCount++;
					if (lettersAndLetterCombinationsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'letters-and-letter-combinations', "Letters and Letter Combinations", lettersAndLetterCombinations);
					if (lettersAndLetterCombinations > 300) {
						lettersAndLetterCombinations-=100;
					}
				} else if (featureName == "Function-Words") {
					functionWordsCount++;
					if (functionWordsCount > 10) {
						continue;
					}
					createCard(featureStyles, 'function-words', "Function Words", functionWordsFontWeight);
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
							                       + '<p>You seem to use the following word combinations frequently in your writing, the topmost ones being the most revealing. Try rewording these phrases or avoiding them entirely in the document you want to anonymize:</p>'
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

	function createCard(featureStyles, id, title, fontWeight) {
		var feature = featureStyles.substring(0, featureStyles.length - 1);
		if (document.getElementById(id+"-card") == null) {
			$("#suggestions").append('<div class="col s12 m6 l4" id="'+id+'-card">'
				                     + '<div class="card">'
				                      + '<div class="card-content">'
				                       + '<span class="card-title purple-text">'+title+'</span>'
				                       + '<p>You seem to misspell the follow words frequently in your writing, the topmost ones being the most revealing. Try finding these misspellings and fixing them in the document you want to anonymize:</p>'
				                       + '<ul id="'+id+'-list">'
				                        + '<li style="font-weight:'+fontWeight+';">' + feature + '</li>'
				                       + '</ul>'
				                      + '</div>'
				                     + '</div>');
		} else {
			$("#"+id+"-list").append('<li style="font-weight:'+fontWeight+';">' + feature + '</li>');
		}
	}
    
    
    $scope.startUpload = function(){
    	$scope.loading = true;
    	 if ($scope.files && $scope.files.length) {
             Upload.upload({
                 url: '/Spring4MVCAngularJSExample/StartProcess',
                 data: {
                     files: $scope.files,
                     test: $scope.testFile,
                     type: $scope.type
                 }
             }).then(function (response) {
                 $timeout(function () {
                	 $scope.processResults(response.data);
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