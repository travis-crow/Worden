//inject angular file upload directives and services.
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('fileUploadController', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
	
	$scope.authors = [];
	$scope.results = false;
	$scope.loading = false;
	$scope.addNewAuthor = false;
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
	
	$scope.selectUploadGenericSet = function () {
		$scope.uploadAuthors = false;
		$scope.uploadGenericSet = true;
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
		var partOfSpeechCount = 0;
		var partOfSpeechId = 'part-of-speech1';
		var partOfSpeechTitle = "Part of Speech (Most Revealing)";
		
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

			if (featureName == "POS-Tags") {
				if (partOfSpeechCount > 3) {
					if (partOfSpeechId === "part-of-speech1") {
						partOfSpeechId = "part-of-speech2";
						partOfSpeechTitle = "Part of Speech (Fairly Revealing)";
						partOfSpeechCount = 0;
					} else {
						continue;
					}
				}
				var feature = featureStyles.substring(0, featureStyles.length - 1);
				var featureToDisplay = feature;
				if (feature === "CC") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.chompchomp.com/terms/coordinatingconjunction.htm">Coordinating Conjunctions</a><span class="extra-feature-text">And, but, for, nor, or, so, yet</span>';
				} else if (feature === "IN") {
					featureToDisplay = '<span class="two-column-feature"><a class="text-link" href="http://www.chompchomp.com/terms/preposition.htm">Prepositions</a> or <a class="text-link" href="http://englishplus.com/grammar/00000377.htm">subordinating conjunctions</a></span><span class="extra-feature-text">After, as, until, since, before, ...</span>';
				} else if (feature === "NN") {
					featureToDisplay = '<a class="text-link" href="https://en.wikipedia.org/wiki/Noun">Nouns (singular or mass)</a>';
				} else if (feature === "TO") {
					featureToDisplay = '<a class="text-link" href="http://partofspeech.org/what-part-of-speech-is-to/">The word "to" in all forms</a>';
				} else if (feature === "DT") {
					featureToDisplay = '<a class="text-link two-column-feature" href="https://learnenglish.britishcouncil.org/en/english-grammar/determiners-and-quantifiers">Determiners (first words in noun phrases)</a><span class="extra-feature-text">The, my, your, her, its, our, their, this, ...</span>';
				} else if (feature === "VB") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://grammar.about.com/od/ab/g/baseformterm.htm">Verbs (Base form)</a><span class="extra-feature-text">Verbs not ending with "s", "ing", or "ed"</span>';
				} else if (feature === "PRP") {
					featureToDisplay = '<a class="text-link two-column-feature" href="https://www.englishclub.com/grammar/pronouns-personal.htm">Personal pronouns</a><span class="extra-feature-text">I, we, us, you, it, they, ...</span>';
				} else if (feature === "VBZ") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.grammar.cl/Present/Verbs_Third_Person.htm">Verbs (3rd person, singular, present)</a><span class="extra-feature-text">Speaks, plays, gives, makes, ...</span>';
				} else if (feature === "PRP$") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://englishplus.com/grammar/00000023.htm">Possessive pronouns</a><span class="extra-feature-text">Mine, my, her, hers, their, ...</span>';
				} else if (feature === "VBG") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.edufind.com/english-grammar/ing-forms/">Verbs (Gerund or present participle)</a><span class="extra-feature-text">Verbs ending in "-ing"</span>';
				} else if (feature === "RP") {
					featureToDisplay = '<a class="text-link two-column-feature" href="https://en.wikipedia.org/wiki/Grammatical_particle#Modern_meaning">Particles</a><span class="extra-feature-text">Um, well, but, ...</span>';
				} else if (feature === "MD") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://esl.fis.edu/grammar/rules/modal.htm">Modal versb</a><span class="extra-feature-text">Can, must, may, might, will, would, should</span>';
				} else if (feature === "JJ") { // Abrams
					featureToDisplay = '<a class="text-link" href="http://www.ccc.commnet.edu/grammar/adjectives.htm">Adjectives</a>';
				} else if (feature === "RB") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://grammar.ccc.commnet.edu/grammar/adverbs.htm">Adverbs</a><span class="extra-feature-text">Words that modify ("He drove slowly")</span>';
				} else if (feature === "NNS") {
					featureToDisplay = '<a class="text-link" href="http://grammar.ccc.commnet.edu/grammar/plurals.htm">Nouns (Plural)</a>';
				} else if (feature === "NNPS") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.chompchomp.com/terms/propernoun.htm">Proper nouns (Plural)</a><span class="extra-feature-text">Oreos, the Jones, General Motors, ...</span>';
				} else if (feature === "VBN") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.myenglishteacher.net/irregular_verbs.html">Verbs (Past participle)</a><span class="extra-feature-text">Arisen, blown, caught, dealt, ...</span>';
				} else if (feature === "NNP") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.chompchomp.com/terms/propernoun.htm">Proper nouns (Singular)</a><span class="extra-feature-text">Oreo, Dr. Jones, America, ...</span>';
				} else if (feature === "JJR") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.edufind.com/english-grammar/comparative-and-superlative/">Adjectives (Comparative)</a><span class="extra-feature-text">Larger, smaller, faster, higher, ...</span>';
				} else if (feature === "CD") {
					featureToDisplay = '<a class="text-link two-column-feature" href="https://www.mathsisfun.com/numbers/cardinal-ordinal-nominal.html">Cardinal numbers</a><span class="extra-feature-text">"Cardinal for counting", answers "How many?"</span>';
				} else if (feature === "VBD") {
					featureToDisplay = '<a class="text-link two-column-feature" href="http://www.yourdictionary.com/index.php/pdf/articles/116.regularverblist.pdf">Verbs (Past tense)</a><span class="extra-feature-text">Accepted, baked, carried, damaged, ...</span>';
				} else if (feature === "UH") {
					featureToDisplay = '<a class="text-link two-column-feature" href="https://en.wikipedia.org/wiki/Interjection">Interjections</a><span class="extra-feature-text">Hi!, Bye!, Oh!, ugh, ...</span>';
				}
				
				if (feature != featureToDisplay) {
					partOfSpeechCount++;
					console.log("ADDING TO THING");
					addPremadeFeatureToCard(featureToDisplay, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, partOfSpeechId, partOfSpeechTitle, "Adjectives, verbs, everything in-between, and their various combinations are a core part of writing style and can be very revealing.", "");
				}
			} else if (featureName == "Special-Characters") {
				uniqueCharactersCount++;
				if (uniqueCharactersCount > 12) {
					continue;
				}
				var feature = featureStyles.substring(0, featureStyles.length - 1);
				var featureToDisplay = feature;
				if (feature === '=') {
					featureToDisplay = "Equals signs (=)";
				} else if (feature === "+") {
					featureToDisplay = "Plus signs (+)";
				} else if (feature === ">") {
					featureToDisplay = "Greater than (>)";
				} else if (feature === "<") {
					featureToDisplay = "Less than (>)";
				} else if (feature === "-") {
					featureToDisplay = "Minus signs (-)";
				} else if (feature === "$") {
					featureToDisplay = "Dollar signs ($)";
				}
				
				addPremadeFeatureToCard(featureToDisplay, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "unique-character", 'Unique Characters', "Individuals may use certain characters like parenthesis an abnormal number of times, enough to put them at risk.", "two-columns");
			} else if (featureName == "Misspelled-Words") {
				misspelledWordsCount++;
				if (misspelledWordsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'misspelled-words', 'Misspelled Words', "Individuals may misspell certain words frequenly enough to risk being identified by their use.", "two-columns");
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
					featureToDisplay = "Questions (?)";
				} else if (feature === '!') {
					featureToDisplay = "Exclamations (!)";
				}
				addPremadeFeatureToCard(featureToDisplay, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "punctuation", "Punctuation", "Individuals may use punctuation marks an abnormal number of times, enough to put them at risk (e.g., you end sentences with '?' frequently).", "two-columns");
			} else if (featureName == "Word-Lengths") {
				wordLengthsCount++;
				if (wordLengthsCount > 12) {
					continue;
				}
				featureStyles = featureStyles.substring(0, featureStyles.length - 1) + " letters long";
				addPremadeFeatureToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, "word-lengths", "Word Lengths", "Individuals sometimes tend towards longer or shorter words depending on their style, frequently enough to be at risk.", "two-columns");
			} else if (featureName == "Letters" || featureName == "Top-Letter-bigrams" || featureName == "Top-Letter-trigrams") {
				lettersAndLetterCombinationsCount++;
				if (lettersAndLetterCombinationsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'letters-and-letter-combinations', "Letters", "Certain letters tend to be favored by individuals as part of their writing style (e.g. using 'ing' frequently)", "two-columns");
			} else if (featureName == "Function-Words") {
				functionWordsCount++;
				if (functionWordsCount > 12) {
					continue;
				}
				addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'function-words', "Function Words", "Function words are the top 512 utility words used by Koppel et al. in <a class=\"purple-text\" style=\"text-decoration:underline\" href=\"http://link.springer.com/chapter/10.1007%2F11427995_17\">\"Automatically determining an anonymous author's native language\"</a>", "two-columns");
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
				addPremadeFeatureToCard(processedWords, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, 'words-and-word-combinations', 'Words and Short Phrases', "Certain words and short phrases tend to be reused by individuals as a part of their writing style.", "two-columns");
			}
		}
		
		$.bigfoot({
			actionOriginalFN: "hide",
		});

		// $("ul.tabs").tabs();
		$('ul.tabs').tabs({
			changeListener: function (content) {
				console.log(content);
			}
		});

		$('.distribution-trigger').leanModal();
	};
	
	$scope.writeChart = function (data) {
		var authorProbabilities = $scope.results.experimentContents[0].probabilityMap;
		var data = [];
		for (var i = 0; i < authorProbabilities.length; i++) {
			var entry = authorProbabilities[i];
			var probability = entry.Probability * 100;
			// We're never *exactly* 100% certain. Worden's version of "Kills 99.99% of all germs" 
			if (probability >= 100) {
				probability = 99;
			}
			data.push([probability, entry.Author]);
		}
		data.sort(function (a, b) {
			if (a[0] > b[0]) {
				return -1;
			}
			if (a[0] < b[0]) {
				return 1;
			}
			return 0;
		});
		var authors = [];
		var probabilities = [];
		for (var i = 0; i < data.length; i++) {
			if (data[i][1] === "_Unknown_") {
				authors.push("You");
			} else {
				authors.push(data[i][1]);
			}
			probabilities.push(data[i][0].toFixed(2));
		}
		
		var barPercentage = 0.3; // default size, anything bigger looks ridiculous
		if (authors.length > 7 && authors.length < 12) {
			barPercentage = 0.2;
		} else if (authors.length >= 18) {
			barPercentage = 0.1;
		}
		
		var ctx = document.getElementById("suspectConfidenceChart").getContext("2d");
		var authorChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: authors,
				datasets: [{
					label: 'True author',
					data: probabilities,
					backgroundColor: 'rgb(154,80,199)',
					hoverBackgroundColor: 'rgb(202,159,222)'
				}]
			},
			options: {
				globals: {
					responsive: true,
					maintainAspectRatio: true,
					defaultColor: 'rgb(154,80,199)',
					defaultFontFamily: 'Roboto',
					defaultFontSize: 15,
					defaultFontColor: 'rgb(38,44,48)'
				},
				scaleLabel: function(label){return  ' $'},
				scaleBeginAtZero: true,
				legend: {
					display: false
				},
				scales: {
					xAxes: [{
						barPercentage: barPercentage,
						gridLines: {
							display: false
						},
						ticks: {
							beginAtZero: true
						}
					}],
					yAxes: [{
					   gridLines: {
						   color: 'rgb(244,245,246)',
						   zeroLineColor: 'rgb(209,209,209)'
					   },
					   ticks: {
							userCallback: function(value, index, values) {
								return value + "%";
							}
						}
					}]
				},
				rectangle: {
					borderWidth: 2,
					borderSkipped: 'bottom'
				},
				tooltips: {
					backgroundColor: 'rgb(244,245,246)',
					titleColor: 'rgb(95,108,118)',
					bodyColor: 'rgb(95,108,118)',
					callbacks: {
						label: function(tooltipItems, data) {
							//return data.datasets[0].label + ": " + tooltipItems.yLabel + '\% confidence';
							return tooltipItems.yLabel + '\% confidence';
						},
					}
				}
			}
		});
	}

	function sortAuthorPercentages(percentageAuthor1, percentageAuthor2) {
		return (percentageAuthor2[0] - percentageAuthor1[0]);
	}

	function addToCard(featureStyles, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id, title, description, twoColumns) {
		if (document.getElementById(id+"-card") == null) {
			createEmptyCard(id, title, description, twoColumns);
		}

		var feature = featureStyles.substring(0, featureStyles.length - 1);
		addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id);
	}
	
	function addPremadeFeatureToCard(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id, title, description, twoColumns) {
		if (document.getElementById(id+"-card") == null) {
			createEmptyCard(id, title, description, twoColumns);
		}
		
		addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id);
	}
	
	function addListItem(feature, featureTestDocCount, featureOtherDocsAverageCount, featureOtherAuthorsAverageCount, id) {
		var featureString = feature.trim();
		var twoColumnClass = ""
		if (featureString.indexOf("class=\"extra-feature-text\"") > -1) {
			twoColumnClass = "two-column-feature";
		}

		if (featureOtherAuthorsAverageCount > featureTestDocCount) {
			featureString = "<div class=\"feature-thing feature-green " + twoColumnClass + "\">+</div> " + featureString;
		} else {
			featureString = "<div class=\"feature-thing feature-red " + twoColumnClass + "\">-</div> " + featureString;
		}
		$("#"+id+"-list").append('<li data-hint=\"Your test document: '+featureTestDocCount+' occurrences&#xa;Your average: '+featureOtherDocsAverageCount+' occurrences&#xa;Random peer\'s average: '+featureOtherAuthorsAverageCount+' occurrences\" class=\"hint--top hint--bounce hint--rounded\">' + featureString + '</li>');
	}

	function createEmptyCard(id, title, description, twoColumns) {
		$("#suggestions").append('<div class="col s12 m6 l4" id="'+id+'-card">'
								 + '<div class="card">'
								  + '<div class="card-content">'
								   + '<span class="card-title purple-text">'
									+ title
									+ '<sup id="fnref:'+id+'">'
									 + '<a href="#fn:'+id+'" rel="footnote">1</a>'
									+ '</sup>'
								   + '</span>'
								   + '<div class="card-wrapper ' + twoColumns + '">'
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
		
		if (currentSuspect !== "testAuthor" && currentSuspect !== "_Unknown_") {
			$scope.verdict = "Worden did not identify you as the author of"
			$scope.response = "Your writing style features below are similar enough to the other writers that Worden incorrectly guessed the author of " + $scope.results.experimentContents[0].title;
			$scope.responseInstructions = "To further";
			$scope.responseAlignment = "left";
		} else {
			$scope.verdict = "You've been identified as the author of"
			$scope.response = "Your writing style features below are unique enough when compared to the other provided works that Worden can correctly guess you as the true author of " + $scope.results.experimentContents[0].title;
			$scope.responseInstructions = "To";
			$scope.responseAlignment = "left";
			//$scope.response = "You use the following features a unique number of times compared to the other writers. Try adding more occurrences of ones that appear infrequently and removing occurrences of ones that appear frequently to become more consistent with the other suspects then try processing your document again.";
		}
	};
	
	$scope.startUpload = function() {
		$scope.loading = true;
		 if ($scope.files && $scope.files.length) {
			 $scope.authorUpload = [];
			 angular.forEach($scope.authors,function(value,key){
				 var name = value.Name;
				 
				 var uploadObj = new Object;
				 var name = value.Name;
				 uploadObj[name] = value.Files;
				 
				 $scope.authorUpload.push(uploadObj);
			 });
			 Upload.upload({
				 url: '/Worden/StartProcess',
				 data: {
					 files: $scope.files,
					 test: $scope.testFile,
					 type: $scope.type,
					 authors: $scope.authorUpload
				 }
			 }).then(function (response) {
				 $timeout(function () {
				$scope.results	= angular.copy(response.data);
					 $scope.processResults();
					 $scope.setSuspectedAuthor();
					 $scope.loading = false;
					 $scope.writeChart();
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