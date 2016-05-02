//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('identifyUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
	
	$scope.authors = [];
	$scope.results = false;
	$scope.loading = false;
	$scope.addNewAuthor = false;
	$scope.currentAuthorIndex;
	
	$scope.uploadAuthors = false;
	$scope.uploadGenericSet = false;

	$scope.selectUploadAuthors = function () {
		$scope.uploadGenericSet = false;
		$scope.uploadAuthors = true;
	}
	$scope.addAuthor = function () {
		$scope.addNewAuthor = true;
	}
	
	$scope.submitNewAuthor = function() {
		var author = {};
		author.Name = $scope.addNewAuthorName;
		$scope.authors.push(author);
		$scope.addNewAuthor = false;
		$scope.addNewAuthorName = "";
		$scope.currentAuthor = author;
		for (var key in $scope.authors) {
			$scope.authors[key].Selected = "authorNotSelected";
		}
		author.Selected = "authorSelected";
	}
	$scope.selectAuthor = function(index) {
		if (angular.isDefined($scope.currentAuthorIndex)) {
			$scope.authors[index].Class = "Inactive";
		}
		$scope.authors[index].Class = "selectedAuthor";

		$scope.currentAuthor = $scope.authors[index];
		
		for (var key in $scope.authors) {
			$scope.authors[key].Selected = "authorNotSelected";
		}
		$scope.currentAuthor.Selected = "authorSelected";
	}
	
	$scope.clearNewAuthor = function() {
		$scope.addNewAuthor = false;
    	$scope.addNewAuthorName = "";
	}
	
	$scope.checkIfEnterKeyWasPressed = function($event) {
	    var keyCode = $event.which || $event.keyCode;
	    if (keyCode === 13) {
	    	$scope.submitNewAuthor()
	    } else if (keyCode === 27) {
	    	$scope.clearNewAuthor();
	    }
	}
	
	$scope.removeOtherAuthorsDoc = function(file) {
		var index = $scope.currentAuthor.Files.indexOf(file);
		$scope.currentAuthor.Files.splice(index, 1);
	}
	
	$scope.setFile = function() {
		if (angular.isUndefined($scope.currentAuthor.Files)) {
			$scope.currentAuthor.Files = [];
		}
		if (!angular.isUndefined($scope.currentAuthor.UploadFile) && $scope.currentAuthor.UploadFile !== null) {
			if ($scope.currentAuthor.UploadFile.length > 1) {
				for (var i = 0; i < $scope.currentAuthor.UploadFile.length; i++) {
					// A "Fake" empty File appear in $scope.currentAuthor.UploadFile for reasons
					// I'm not entirely sure of, but it seems safe enough for not to ignore it
					// and just add the actual files to the files list. These fake entries are
					// not actually File objects and therefore don't have a name variable, so
					// we can detect them by checking if a given entry has a name or not.
					if ($scope.currentAuthor.UploadFile[i].name != null) {
						$scope.currentAuthor.Files.push($scope.currentAuthor.UploadFile[i]);
					}
				}
			} else {
				$scope.currentAuthor.Files.push($scope.currentAuthor.UploadFile[0]);
			}	
		}
		$scope.currentAuthor.UploadFile = {};
	}

	$scope.removeAllAuthors = function() {
		$scope.currentAuthor = null;
		$scope.authors = [];
	}
	
	$scope.removeAuthor = function(index) {
		if ($scope.currentAuthor.Name == $scope.authors[index].Name) {
			$scope.currentAuthor = null;
		}
		$scope.authors.splice(index, 1);
	}
	$scope.processResults = function (data) {
		
		var infoGainFeatures = $scope.results.InfoGain;
		var featureTestDocCounts = $scope.results.FeatureTestDocCounts;
		var featureOtherDocsAverageCounts = $scope.results.FeatureOtherDocsAverageCounts;
		var featureOtherAuthorsAverageCounts = $scope.results.FeatureOtherAuthorsAverageCounts;
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

		createEmptyCard('misspelled-words', 'Misspelled Words', "Individuals may misspell certain words frequenly enough to risk being identified by their use.");
		createEmptyCard('words-and-word-combinations', 'Words and Short Phrases', "Certain words and short phrases tend to be reused by individuals as a part of their writing style.");
		createEmptyCard('function-words', "Function Words", "Function words are the top 512 utility words used by Koppel et al. in <a class=\"purple-text\" style=\"text-decoration:underline\" href=\"http://link.springer.com/chapter/10.1007%2F11427995_17\">\"Automatically determining an anonymous author's native language\"</a>");
		createEmptyCard('punctuation', "Punctuation", "Individuals may use punctuation marks an abnormal number of times, enough to put them at risk (e.g., you end sentences with '?' frequently).");
		createEmptyCard('unique-character', 'Unique Characters', "Individuals may use certain characters like parenthesis an abnormal number of times, enough to put them at risk.");
		createEmptyCard('word-lengths', "Word Lengths", "Individuals sometimes tend towards longer or shorter words depending on their style, frequently enough to be at risk.");
		createEmptyCard('letters-and-letter-combinations', "Letters", "Certain letters tend to be favored by individuals as part of their writing style (e.g. using 'ing' frequently)");
		//createEmptyCard('number', 'Numbers');
		
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

			var featureTestDocCount = featureTestDocCounts[feature];
			var featureOtherDocsAverageCount = featureOtherDocsAverageCounts[feature];
			var featureOtherAuthorsAverageCount = featureOtherAuthorsAverageCounts[feature];

			if (featureName == "Special-Characters") {
				uniqueCharactersCount++;
				if (uniqueCharactersCount > 12) {
					continue;
				}
				var feature = featureStyles.substring(0, featureStyles.length - 1);
				var featureToDisplay = feature;
				if (feature === '=') {
					featureToDisplay = "Equals signs (=)";
				}
				addPremadeFeatureToCard(featureToDisplay, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "unique-character");
			} else if (featureName == "Misspelled-Words") {
				misspelledWordsCount++;
				if (misspelledWordsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'misspelled-words');
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
				addPremadeFeatureToCard(featureToDisplay, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "punctuation");
			} else if (featureName == "Word-Lengths") {
				wordLengthsCount++;
				if (wordLengthsCount > 12) {
					continue;
				}
				featureStyles = featureStyles.substring(0, featureStyles.length - 1) + " letters long";
				addPremadeFeatureToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "word-lengths");
			} else if (featureName == "Letters" || featureName == "Top-Letter-bigrams" || featureName == "Top-Letter-trigrams") {
				lettersAndLetterCombinationsCount++;
				if (lettersAndLetterCombinationsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'letters-and-letter-combinations');
			} else if (featureName == "Function-Words") {
				functionWordsCount++;
				if (functionWordsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'function-words');
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
				addPremadeFeatureToCard(processedWords, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'words-and-word-combinations');
			}
		}
		
		$.bigfoot({
			actionOriginalFN: "hide",
		});
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

	function addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id) {
		var feature = featureStyles.substring(0, featureStyles.length - 1);
		if (document.getElementById(id+"-card") == null) {
			console.log("Card with id '" + id + "'' not found in DOM");
		} else {
			addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id);
		}
	}
	
	function addPremadeFeatureToCard(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id) {
		if (document.getElementById(id+"-card") == null) {
			console.log("Card with id '" + id + "'' not found in DOM");
		} else {
			addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id);
		}
	}
	
	function addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id) {
		var featureString = feature.trim();
		if (featureOtherAuthorsAverageCount > featureTestDocCount) {
			featureString = "<div class=\"feature-thing feature-green\">+</div> " + featureString;
		} else {
			featureString = "<div class=\"feature-thing feature-red\">-</div> " + featureString;
		}
		$("#"+id+"-list").append('<li data-hint=\"Your test document: '+featureTestDocCount+' occurrences&#xa;Your average: '+featureOtherDocsAverageCount+' occurrences&#xa;Random peer\'s average: '+featureOtherAuthorsAverageCount+' occurrences\" class=\"hint--top hint--bounce hint--rounded\">' + featureString + '</li>');
	}

	function createEmptyCard(id, title, description) {
		$("#suggestions").append('<div class="col s12 m6 l4" id="'+id+'-card">'
								 + '<div class="card">'
								  + '<div class="card-content">'
								   + '<span class="card-title purple-text">'
									+ title
									+ '<sup id="fnref:'+id+'">'
									 + '<a href="#fn:'+id+'" rel="footnote">1</a>'
									+ '</sup>'
								   + '</span>'
								   + '<div class="card-wrapper">'
									+ '<ul id="'+id+'-list">'
									+ '</ul>'
									+ '<br />'
								   + '</div'
								  + '</div>'
								 + '</div>');
		$("#footnotes-list").append('<li class="footnote" id="fn:'+id+'">'
									+ '<p>'+description+'<a href="#fnref:'+id+'"> RETURN</a></p>'
								  + '</li>')
	}
	
	function removeAllEmptyCards() {
		$("#suggestions").children().each(function () {
			var card = $(this).children(0);
			card.children().each(function() {
				var cardContent = $(this).children(0);
				cardContent.children().each(function() {
					if ($(this).is("ul")) {
						var listId = $(this).attr('id');
						// If the list is empty, there's no reason to have the card still, remove it.
						if ($(this).children(0).size() == 0) {
							// Remove the card
							card.parent().remove();
							
							// Remove the card's description "footnote" (otherwise it appears
							// at the bottom of the page instead, Ick.
							var id = listId.substring(0, listId.indexOf('-list'));
							$("#fn:"+id).remove();
						}
					}
				});
			});
		});
	}
	
	$scope.setSuspectedAuthor = function() {
		var currentHighest = 0.00;
		var currentSuspect = "";
		angular.forEach($scope.results.experimentContents[0].probabilityMap, function(value, key) {
			var tmpValue = parseFloat(value.Probability);
			if (tmpValue > currentHighest) {
				currentSuspect = value.Author;
				currentHighest = tmpValue;
			}
		});
		
		if (currentSuspect !== "userAuthor" && currentSuspect !== "testAuthor") {
			$scope.verdict = "Worden did not identify you as the author of"
			$scope.response = "Your writing style features below are similar enough to the other writers that Worden incorrectly guessed the author of " + $scope.results.experimentContents[0].title;
			$scope.responseInstructions = "To further";
			$scope.responseAlignment = "left";
		} else {
			$scope.verdict = "You've been identified as the author of"
			$scope.response = "Your writing style features below are unique enough when compared to the other provided works that Worden can correctly guess you as the true author of " + $scope.results.experimentContents[0].title;
			$scope.responseInstructions = "To";
			$scope.responseAlignment = "left";
		}
	};
	
	$scope.startUpload = function() {
		$scope.loading = true;
		Upload.upload({
			url: '/Worden/StartIdentifyProcess',
			data: {
				test: $scope.testFile,
				type: $scope.type,
				authors: $scope.authors
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
		}, function (evt) {});
	};
}]);