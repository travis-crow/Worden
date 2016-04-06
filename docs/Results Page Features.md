Worden Results Page Cards
=========================

1. [Numbers](#1)
2. [Unique Characters](#2)
3. [Words and Word Combinations](#3)
4. [Letters and Letter Combinations](#4)
5. [Word Lengths](#5)
6. [Misspelled Words](#6)
7. [Function Words](#7)
8. [Punctuation](#8)
9. [Part-Of-Speech Combinations](#9)

<a id="1"></a>Numbers
---------------------

Features: Digits, Two Digit Numbers, Three Digit Numbers

Sample result values:

	> Digits{7}                                            0.262047
	> Two-Digit-Numbers{85}                                0.306686
	> Three-Digit-Numbers{770}                             0.300095
	> Three-Digit-Numbers{349}                             0.269543
	> Two-Digit-Numbers{34}                                0.248905
	> Two-Digit-Numbers{71}                                0.232430
	> Three-Digit-Numbers{646}                             0.228189
	> Three-Digit-Numbers{140}                             0.227369
	> Two-Digit-Numbers{90}                                0.224807
	> Two-Digit-Numbers{38}                                0.222736
	> Two-Digit-Numbers{77}                                0.221470
	> Two-Digit-Numbers{64}                                0.221134
	> Three-Digit-Numbers{380}                             0.167875
	> Three-Digit-Numbers{562}                             0.160287
	> Two-Digit-Numbers{56}                                0.143559

	> Digits{1}                                            2.103143
	> Digits{9}                                            1.483795
	> Digits{2}                                            1.265634
	> Digits Percentage                                    1.130738
	> Digits{0}                                            0.860398
	> Two-Digit-Numbers{30}                                0.791433

-----------------

You seem to use `N` a lot in your writing, try removing as many of these as you can by generalizing and/or converting to their written form where possible in the document you want to anonymize.

You seem to use __`N1`__ and `N2` a lot in your writing, `N1` the most. Try removing as many of these as you can by generalizing them away, referring to them by pronouns, or converting them to their written form where possible in the document you want to anonymize.

You seem to use the following numbers a lot in your writing, the topmost ones being the most revealing. Try removing as many of them as you can by generalizing them away, referring to them by pronouns, or converting them to their written form where possible in the document you want to anonymize.

1. `N1`
2. `N2`
3. `N3`

Examples:

* "I have 7 apples." to "I have many apples."
* "I got 7 questions right" to "I got seven questions right"
* "I had 7 apples. 7 Apples is a lot!" to "I have 7 apples. That's a lot!"

-----------------

	<feature name="Digits" calc_hist="true">
		<description value="Frequency of digits in the document (0,1,...,9)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.RegexpEventDriver">
			<param name="regexp" value="\d"/>
		</event-driver>
		<canonicizers>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Two Digit Numbers" calc_hist="true">
		<description value="Frequencies of 2 digit numbers (e.g. 11, 99 etc.)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.RegexpEventDriver">
			<param name="regexp" value="\d\d"/>
		</event-driver>
		<canonicizers>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Three Digit Numbers" calc_hist="true">
		<description value="Frequencies of 3 digit numbers (e.g. 100, 209 etc.)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.RegexpEventDriver">
			<param name="regexp" value="\d\d\d"/>
		</event-driver>
		<canonicizers>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="2"></a>Unique Characters
-------------------------------

Features: Special Characters

Sample result values:

	> Special-Characters{>}                                0.163322

	> Special-Characters{-}                                0.785370

-----------------

You seem to use the special character `C` frequently in your writing. Try avoiding this or removing extrenous uses where possible in the document you want to anonymize.

You seem to use the special characters __`C1`__ and `C2` frequently in your writing, `C1` the most. Try avoiding these or removing extrenous uses where possible in the document you want to anonymize.

You seem to use the following special characters a lot in your writing, the topmost ones being the most revealing. Try avoiding them or removing extrenous uses of them where possible in the document you want to anonymize.

1. `C1`
2. `C2`
3. `C3`

-----------------

	<feature name="Special Characters" calc_hist="true">
		<description value="Frequencies of special characters, e.g. ~, @ etc."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.ListEventDriver">
			<param name="sort" value="false"/>
			<param name="whiteList" value="true"/>
			<param name="keepLexiconInMem" value="false"/>
			<param name="underlyingEvents" value="Words"/>
			<param name="filename" value="edu/drexel/psal/resources/writeprints_special_chars.txt"/>
		</event-driver>
		<canonicizers>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="3"></a>Words and Word Combinations
-----------------------------------------

Features: Words, Word Bigrams, Word Trigrams

Sample result values:

	> Word-Trigrams{(north)-(america)-(corp)}              0.273847
	> Word-Trigrams{(enron)-(north)-(america)}             0.272917
	> Word-Trigrams{(corp)-(1400)-(smith)}                 0.234549
	> Word-Trigrams{(america)-(corp)-(1400)}               0.233689
	> Word-Trigrams{(1400)-(smith)-(street)}               0.227369
	> Word-Trigrams{(smith)-(street)-(eb)}                 0.227369
	> Word-Trigrams{(houston)-(texas)-(77002)}             0.227369
	> Word-Trigrams{(sara)-(shackleton)-(enron)}           0.141441
	> Word-Trigrams{(shackleton)-(enron)-(north)}          0.141441
	> Word-Trigrams{(street)-(eb)-(3801a)}                 0.141441
	> Word-Trigrams{(eb)-(3801a)-(houston)}                0.141441
	> Word-Trigrams{(3801a)-(houston)-(texas)}             0.141441
	> Word-Trigrams{(sara)-(shackleton@enron)-(com)}       0.141441
	> Word-Bigrams{(enron)-(north)}                        0.273818
	> Word-Bigrams{(north)-(america)}                      0.272126
	> Word-Bigrams{(america)-(corp)}                       0.271477

	> Words{this}                                          1.786993
	> Words{the}                                           1.701123
	> Words{he}                                            1.676441
	> Words{his}                                           1.560639
	> Words{was}                                           1.349051
	> Words{i}                                             1.176220
	> Words{that}                                          1.132181
	> Words{but}                                           0.925501
	> Words{also}                                          0.909484
	> Words{of}                                            0.888588
	> Words{on}                                            0.860398
	> Words{more}                                          0.840518
	> Words{not}                                           0.819622
	> Words{we}                                            0.793592
	> Words{to}                                            0.780786
	> Words{in}                                            0.755640
	> Word-Bigrams{(out)-(of)}                             1.311954
	> Word-Bigrams{(i)-(am)}                               0.935621
	> Word-Bigrams{(to)-(be)}                              0.925501
	> Word-Bigrams{(in)-(his)}                             0.785370
	> Word-Bigrams{(that)-(the)}                           0.728361
	> Word-Trigrams{(top)-(of)-(the)}                      0.663197

-----------------

You seem to use the word combination "W1 W2" frequently in your writing. Try rewording this phrase or avoiding it entirely in the document you want to anonymize.

You seem to use the word combinations __"W1 W2"__ and "W9 W8 W7" frequently in your writing, "W1 W2" the most. Try rewording these phrases or avoiding them entirely in the document you want to anonymize.

You seem to use the following word combinations frequently in your writing, the topmost ones being the most revealing. Try rewording these phrases or avoiding them entirely in the document you want to anonymize.

1. "W1 W2"
2. "W9 W8 W7"
3. "W5 W6"

-----------------

	<feature name="Words" calc_hist="true">
		<description value="Frequencies of various words in the text, case insensitive and without punctuations."/>
		<event-driver class="com.jgaap.eventDrivers.NaiveWordEventDriver">
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Word Bigrams" calc_hist="true">
		<description value="Frequencies of various word bigrams in the text, case insensitive and without punctuations."/>
		<event-driver class="com.jgaap.eventDrivers.WordNGramEventDriver">
			<param name="N" value="2"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Word Trigrams" calc_hist="true">
		<description value="Frequencies of various word trigrams in the text, case insensitive and without punctuations."/>
		<event-driver class="com.jgaap.eventDrivers.WordNGramEventDriver">
			<param name="N" value="3"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="4"></a>Letters and Letter Combinations
---------------------------------------------

Features: Letters, Top Letter bigrams, Top Letter trigrams

Sample result values:

	> Letters{h}                                           2.460540
	> Letters{v}                                           2.214152
	> Letters{c}                                           2.067095
	> Letters{i}                                           1.987002
	> Letters{p}                                           1.816853
	> Letters{n}                                           1.789232
	> Letters{a}                                           1.725300
	> Letters{f}                                           1.580097
	> Letters{o}                                           1.560639
	> Letters{q}                                           1.516167
	> Letters{u}                                           1.500853
	> Letters{r}                                           1.445758
	> Letters{w}                                           1.445295
	> Letters{s}                                           1.341630
	> Letters{l}                                           1.126243
	> Letters{e}                                           1.073552
	> Letters{j}                                           0.909484
	> Letters{d}                                           0.791433
	> Letters{z}                                           0.728361
	> Top-Letter-bigrams{er}                               2.342310
	> Top-Letter-bigrams{on}                               2.324052
	> Top-Letter-bigrams{io}                               2.038173
	> Top-Letter-bigrams{en}                               2.024255
	> Top-Letter-bigrams{or}                               1.786993
	> Top-Letter-bigrams{ti}                               1.720166
	> Top-Letter-bigrams{ic}                               1.681922
	> Top-Letter-bigrams{ed}                               1.621275
	> Top-Letter-bigrams{ly}                               1.503597
	> Top-Letter-bigrams{nt}                               1.445295
	> Top-Letter-bigrams{li}                               1.385218
	> Top-Letter-bigrams{es}                               1.384108
	> Top-Letter-bigrams{be}                               1.376793
	> Top-Letter-bigrams{me}                               1.336192
	> Top-Letter-bigrams{of}                               1.336192
	> Top-Letter-bigrams{al}                               1.263544
	> Top-Letter-bigrams{ou}                               1.254311
	> Top-Letter-bigrams{te}                               0.930177
	> Top-Letter-bigrams{co}                               0.854336
	> Top-Letter-bigrams{ro}                               0.824606
	> Top-Letter-bigrams{th}                               0.824606
	> Top-Letter-bigrams{om}                               0.824606
	> Top-Letter-bigrams{ha}                               0.780786
	> Top-Letter-bigrams{it}                               0.728361
	> Top-Letter-trigrams{ent}                             2.295277
	> Top-Letter-trigrams{ati}                             2.117155
	> Top-Letter-trigrams{tha}                             2.068538
	> Top-Letter-trigrams{ion}                             1.757519
	> Top-Letter-trigrams{ons}                             1.659537
	> Top-Letter-trigrams{iti}                             1.577544
	> Top-Letter-trigrams{tio}                             1.551513
	> Top-Letter-trigrams{act}                             1.518851
	> Top-Letter-trigrams{con}                             1.380920
	> Top-Letter-trigrams{hat}                             1.370903
	> Top-Letter-trigrams{tic}                             1.263544
	> Top-Letter-trigrams{eve}                             1.217016
	> Top-Letter-trigrams{for}                             1.196668
	> Top-Letter-trigrams{ere}                             1.044078
	> Top-Letter-trigrams{ate}                             0.860398
	> Top-Letter-trigrams{res}                             0.840518
	> Top-Letter-trigrams{his}                             0.828305
	> Top-Letter-trigrams{nce}                             0.819622
	> Top-Letter-trigrams{pro}                             0.791433
	> Top-Letter-trigrams{sta}                             0.791433

----------------

You seem to use the letter combination "h" frequently in your writing. Try searching your document to anonymize for this combination and substituting the words they occur in with other words that doesn't have the combination or rephrasing the sentence to change the word used.

You seem to use the letter combinations __"h"__ and "ing" frequently in your writing, "ab" the most. Try searching your document to anonymize for these combinations and substituting the words they occur in with other words that don't have the combination or rephrasing the sentence to change the word used.

You seem to use the following letter combinations frequently in your writing, the topmost ones being the most revealing. Try searching your document to anonymize for these combinations and substituting the words they occur in with other words that don't have the combination or rephrasing the sentence to change the word used.

1. "h"
2. "ing"
3. "be"

Example: For the frequent letter combination "ing", "He was __running__ because he was late" could be changed to "He ran because he was late", eliminating the need for "ing".

----------------

	<feature name="Letters" calc_hist="true">
		<description value="Frequency of letters (a-z, case insensitive)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.LetterNGramEventDriver">
			<param name="N" value="1"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Top Letter bigrams" calc_hist="true">
		<description value="Most common letter bigrams (e.g. aa, ab etc.), case insensitive. Bigrams are taken only within words (do not cross adjacent words)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.LetterNGramEventDriver">
			<param name="N" value="2"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

	<feature name="Top Letter trigrams" calc_hist="true">
		<description value="Most common letter trigrams (e.g. aaa, aab etc.), case insensitive. Trigrams are taken only within words (do not cross adjacent words)."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.LetterNGramEventDriver">
			<param name="N" value="3"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="5"></a>Word Lengths
--------------------------

Features: Word Lengths

Sample result values:

	> Word-Lengths{8}                                      2.083494
	> Word-Lengths{10}                                     1.991242
	> Word-Lengths{12}                                     1.706604
	> Word-Lengths{4}                                      1.551418
	> Word-Lengths{13}                                     1.516167
	> Word-Lengths{11}                                     1.073552
	> Word-Lengths{2}                                      1.063432
	> Word-Lengths{9}                                      0.999142
	> Word-Lengths{6}                                      0.909484
	> Word-Lengths{14}                                     0.840518

----------------

You seem to use words `N` character long frequently in your writing. Try finding words of this length in the document you want to anonymize and replacing them with longer or shorter symnonyms.

You seem to use words __`N1`__ characters long and `N2` characters long frequently in your writing, `N1` the most. Try finding words of these lengths in the document you want to anonymize and replacing them with longer or shorter synonyms.

You seem to use words of the following lengths frequently in your writing, the topmost ones being the most revealing. Try finding words of these lengths in the document you want to anonymize and replacing them with longer or shorter synonyms.

1. Words `N1` characters long
2. Words `N2` characters long
3. Words `N3` characters long

----------------

	<feature name="Word Lengths" calc_hist="true">
		<description value="Frequency of words of different lengths (excluding punctuation)."/>
		<event-driver class="com.jgaap.eventDrivers.WordLengthEventDriver">
		</event-driver>
		<canonicizers>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="6"></a>Misspelled Words
------------------------------

Features: Misspelled Words

Sample result values:

	> Misspelled-Words{it's}                               0.909484

---------------

You seem to misspell the follow words frequently in your writing, the topmost ones being the most revealing. Try finding these misspellings and fixing them in the document you want to anonymize.

1. "Word"

---------------

	<feature name="Misspelled Words" calc_hist="true">
		<description value="Frequencies of misspelled words out of a list of 5,513 common misspellings."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.ListEventDriver">
			<param name="sort" value="true"/>
			<param name="whiteList" value="true"/>
			<param name="keepLexiconInMem" value="true"/>
			<param name="underlyingEvents" value="Words"/>
			<param name="filename" value="edu/drexel/psal/resources/writeprints_misspellings.txt"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="7"></a>Function Words
----------------------------

Features: Function Words

Sample result values:

	> Function-Words{this}                                 1.786993
	> Function-Words{the}                                  1.701123
	> Function-Words{he}                                   1.676441
	> Function-Words{his}                                  1.560639
	> Function-Words{was}                                  1.349051
	> Function-Words{i}                                    1.176220
	> Function-Words{that}                                 1.132181
	> Function-Words{but}                                  0.925501
	> Function-Words{also}                                 0.909484
	> Function-Words{of}                                   0.888588
	> Function-Words{on}                                   0.860398
	> Function-Words{more}                                 0.840518
	> Function-Words{not}                                  0.819622
	> Function-Words{we}                                   0.793592
	> Function-Words{to}                                   0.780786
	> Function-Words{in}                                   0.755640

---------------

There are a finite set of common "function" words in the English language such as "the", "she", "we", "to", "aso", etc. You seem to use the following common function words frequently in your writing, the topmost ones being the most revealing. Try finding these occurrances in your document to anonymize and replacing or removing them where possible.

1. "this"
2. "the"
3. "he"

---------------

	<feature name="Function Words" calc_hist="true">
		<description value="512 common function words, used by Koppel et al. in Koppel, 2005."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.ListEventDriver">
			<param name="sort" value="false"/>
			<param name="whiteList" value="true"/>
			<param name="keepLexiconInMem" value="true"/>
			<param name="underlyingEvents" value="Words"/>
			<param name="filename" value="edu/drexel/psal/resources/koppel_function_words.txt"/>
		</event-driver>
		<canonicizers>
			<canonicizer class="com.jgaap.canonicizers.UnifyCase">
			</canonicizer>
			<canonicizer class="edu.drexel.psal.jstylo.canonicizers.StripEdgesPunctuation">
			</canonicizer>
		</canonicizers>
		<cullers>
			<culler class="edu.drexel.psal.jstylo.eventCullers.MostCommonEventsExtended">
				<param name="N" value="50"/>
			</culler>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="8"></a>Punctuation
-------------------------

Features: Punctuation

Sample result values: None yet

-------------------

You use the following punctuation quite frequently in your writing, the topmost ones being the most revealing. Try replacing these punctuation makes with substitutions where applicable or removing where necessary in your document to anonymize.

1. !
2. ,
3. .

-------------------

	<feature name="Punctuation" calc_hist="true">
		<description value="Punctuation symbols like . , ! etc."/>
		<event-driver class="edu.drexel.psal.jstylo.eventDrivers.ListEventDriver">
			<param name="sort" value="false"/>
			<param name="whiteList" value="true"/>
			<param name="keepLexiconInMem" value="false"/>
			<param name="underlyingEvents" value="Characters"/>
			<param name="filename" value="edu/drexel/psal/resources/writeprints_punctuation.txt"/>
		</event-driver>
		<canonicizers>
		</canonicizers>
		<cullers>
		</cullers>
		<norm value="NONE"/>
		<factor value="1.0"/>
	</feature>

<a id="9"></a>Part-Of-Speech Combinations
-----------------------------------------

[TODO]