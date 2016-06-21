package com.websystique.springmvc.controller;

import java.io.File;
import java.io.IOException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.jgaap.generics.Document;

import edu.drexel.psal.jstylo.generics.DataMap;
import edu.drexel.psal.jstylo.generics.DocumentData;
import edu.drexel.psal.jstylo.generics.FeatureData;
import edu.drexel.psal.jstylo.generics.FullAPI;
import edu.drexel.psal.jstylo.generics.FullAPI.Builder;
import edu.drexel.psal.jstylo.generics.FullAPI.analysisType;
import edu.drexel.psal.jstylo.featureProcessing.ProblemSet;
import edu.drexel.psal.jstylo.machineLearning.weka.WekaAnalyzer;


@Controller
@RequestMapping("/")
public class IndexController {

	private static String userAuthor = "_Unknown_";
	private static String testDocument = "";

	@RequestMapping("/")
	public String getIndexPage() {
		return "Welcome";
	}
	@RequestMapping("/Welcome")
	public String getWelcomePage() {
		return "Welcome";
	}

	@RequestMapping("/TestDocument")
	public String getTestDocument() {
		return "TestDocument";
	}

	@RequestMapping("/IdentifyDocument")
	public String getIdentifyDocument() {
		return "IdentifyDocument";
	}

	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value = "/StartProcess", method = RequestMethod.POST)
	public @ResponseBody String startProcess(MultipartHttpServletRequest request, @RequestParam(value = "type", required = false) String type) throws IOException {
		ProblemSet ps = new ProblemSet();
		ps.setTrainCorpusName("Worden Experiment");
		Iterator <String> itr = request.getFileNames();
		String testDir = request.getServletContext().getRealPath("/TestDocument/");
		String refDir = request.getServletContext().getRealPath("/TrainDocuments/");

		Enumeration<String> authors = request.getParameterNames();
		
		
		File testFile = new File(testDir);
		if (!testFile.exists()) {
			try{
				testFile.mkdir();				
			}
			catch(Exception e){
				return e.getMessage();
			}

		}

		File refFile = new File(refDir);
		if (!refFile.exists()) {
			try{
				refFile.mkdir();
			}
			catch(Exception e){
				return e.getMessage();
			}

		}

	
		String xml = request.getServletContext().getRealPath("/writeprints_feature_set_limited.xml");

		try{

		//TODO is the document to identify always at a specific index? 
		//Surely there's a better way to determine which is which than whether or not we're at the end of the iterator
		while (itr.hasNext()) {
			String uploadedFile = itr.next();
			MultipartFile file = request.getFile(uploadedFile);
			
			if (uploadedFile.contains("author")) {//adding train document
				int closeBracket = uploadedFile.indexOf(']'); // example authors[0].files[0] // just includes authors[0]
				String authorString = uploadedFile.substring(closeBracket + 1,uploadedFile.length());
				closeBracket = authorString.indexOf(']');
				String subAuthorString = authorString.substring(1,closeBracket);
				ps.addTrainDoc(subAuthorString, makeDoc(file, userAuthor, refDir));
			} else if(uploadedFile.contains("test")) {// adding test document
				try{
					ps.addTestDoc(userAuthor, makeDoc(file, userAuthor, testDir));
				}
				catch(Exception e){
					return e.getMessage();
				}
				testDocument = file.getOriginalFilename();
			} else {
				
				try{
					ps.addTrainDoc(userAuthor, makeDoc(file, userAuthor, refDir));
				}
				catch(Exception e){
					return e.getMessage();
				}

			}
		}

		//TODO load in the sample files
		//sample files are currently located in References/samples
		if (type != null) {
			String samplePath;
			if (type.equals("1")) {
				samplePath = request.getServletContext().getRealPath("/References/samples/emails");
			} else if (type.equals("2")) {
				samplePath = request.getServletContext().getRealPath("/References/samples/essays");
			} else if (type.equals("3")){
				samplePath = request.getServletContext().getRealPath("/References/samples/tweets");
			} else {
				samplePath = request.getServletContext().getRealPath("/References/samples/emails");
			}

			FileUtils file = new FileUtils();
			Iterator <File> files = file.iterateFiles(new File(samplePath), null, true);

			while (files.hasNext()) {
				File currentFile = files.next();
				String currentAuthor = currentFile.getParentFile().getName();
				if (currentAuthor.equals("emails") || currentAuthor.equals("essays") || currentAuthor.equals("tweets")) {
					continue;
				}
				System.out.println("Adding train document: " + currentFile.getName());
				try{
					ps.addTrainDoc(currentAuthor, makeDoc(currentFile, currentAuthor));
				}
				catch(Exception e){
					return e.toString();
				}
			}
		}


		FullAPI fullApi =  new Builder().cfdPath(xml)
										.ps(ps)
										.setAnalyzer(new WekaAnalyzer())
										.numThreads(4)
										.analysisType(analysisType.TRAIN_TEST_KNOWN)
										.build();
		fullApi.prepareInstances();
		fullApi.calcInfoGain();
		fullApi.run();

		JsonObject jsonTestDocCounts = new JsonObject();
		DataMap testingDataMap = fullApi.getTestingDataMap(); // Contains the test document(s) only
		// Counting features in the author's test document
		ConcurrentHashMap<String, DocumentData> featureDataMap = testingDataMap.getDataMap().get(userAuthor);
		for (Entry <Integer, String> featureEntry: testingDataMap.getFeatures().entrySet()) {
			String feature = featureEntry.getValue();
			Integer featureCount = 0;
			for (Entry <String, DocumentData> testDocumentEntry: featureDataMap.entrySet()) {
				FeatureData featureData = testDocumentEntry.getValue().getDataValues().get(featureEntry.getKey());
				if (featureData != null) {
					featureCount = featureData.getCount();
				}
			}
			jsonTestDocCounts.addProperty(feature, featureCount);
			//System.out.printf("%s:%s\n", feature, featureCount);
		}
		JsonObject jsonOtherDocsAverageCounts = new JsonObject();
		JsonObject jsonOtherAuthorsAverageCounts = new JsonObject();
		DataMap otherDocsDataMap = fullApi.getTrainingDataMap(); // ALL other docs (include user's other docs)
		HashMap<String, Double> randomAuthorsAverageCounts = new HashMap<String, Double>();
		Random randomAuthorsFeatures = new Random();
		for (Entry<String, ConcurrentHashMap<String, DocumentData>> authorEntry : otherDocsDataMap.getDataMap().entrySet()) {
			String authorName = authorEntry.getKey();
			// Averaging feature counts in the user's "Other Documents"
			if (authorName.equals(userAuthor)) {
				featureDataMap = authorEntry.getValue();
				for (Entry <Integer, String> featureEntry: otherDocsDataMap.getFeatures().entrySet()) {
					String feature = featureEntry.getValue();
					double featureCount = 0.0;
					double numOfOtherDocs = 0.0;
					for (Entry <String, DocumentData> otherDocumentsEntry: featureDataMap.entrySet()) {
						numOfOtherDocs++;
						FeatureData featureData = otherDocumentsEntry.getValue().getDataValues().get(featureEntry.getKey());
						if (featureData != null) {
							featureCount += featureData.getCount();
						}
					}
					double featureAverage = featureCount / numOfOtherDocs;
					featureAverage = Math.round(featureAverage * 100.0) / 100.0;
					jsonOtherDocsAverageCounts.addProperty(feature, featureAverage);
					//System.out.printf("%s:%s\n", feature, featureCount);
				}
			// Averaging feature counts for random other author's documents
			// (OR, one that has feature counts if all other authors have 0 counts, this
			// should be safe enough to keep us away from becoming a plagerism tool)
			} else {
				featureDataMap = authorEntry.getValue();
				for (Entry <Integer, String> featureEntry: otherDocsDataMap.getFeatures().entrySet()) {
					String feature = featureEntry.getValue();
					double featureCount = 0.0;
					double numOfOtherDocs = 0.0;
					for (Entry <String, DocumentData> otherDocumentsEntry: featureDataMap.entrySet()) {
						numOfOtherDocs++;
						FeatureData featureData = otherDocumentsEntry.getValue().getDataValues().get(featureEntry.getKey());
						if (featureData != null) {
							featureCount += featureData.getCount();
						}
					}
					double featureAverage = featureCount / numOfOtherDocs;
					Double average = randomAuthorsAverageCounts.get(feature);
					if (average == null || average.equals(0.0) || (featureAverage > 0.0 && randomAuthorsFeatures.nextBoolean())) {
						randomAuthorsAverageCounts.put(feature, featureAverage);
					}
				}
			}
		}
		for (Entry<String, Double> featureAverage : randomAuthorsAverageCounts.entrySet()) {
			String feature = featureAverage.getKey();
			double average = Math.round(featureAverage.getValue() * 100.0) / 100.0;
			jsonOtherAuthorsAverageCounts.addProperty(feature, average);
			//System.out.printf("%s:%s\n", feature, average);
		}
		
		System.out.println(fullApi);
		System.out.println(fullApi.getResults());
		JsonObject json = fullApi.getResults().toJson();
		json.addProperty("InfoGain", fullApi.getReadableInfoGain(false));
		json.add("FeatureTestDocCounts", jsonTestDocCounts);
		json.add("FeatureOtherDocsAverageCounts", jsonOtherDocsAverageCounts);
		json.add("FeatureOtherAuthorsAverageCounts", jsonOtherAuthorsAverageCounts);
		return json.toString();
		}
		catch(Exception e){
			return e.getMessage();
		}
		
		
	}
	
	@ResponseStatus(value = HttpStatus.OK)
	@RequestMapping(value = "/StartIdentifyProcess", method = RequestMethod.POST)
	public @ResponseBody String startIdentifyProcess(MultipartHttpServletRequest request, @RequestParam(value = "type", required = false) String type) throws IOException {
		ProblemSet ps = new ProblemSet();
		ps.setTrainCorpusName("Worden Experiment");
		Iterator <String> itr = request.getFileNames();
		String testDir = request.getServletContext().getRealPath("/TestDocument/");
		String refDir = request.getServletContext().getRealPath("/TrainDocuments/");

		Enumeration<String> authors = request.getParameterNames();
		
		
		File testFile = new File(testDir);
		if (!testFile.exists()) {
			testFile.mkdir();
		}

		File refFile = new File(refDir);
		if (!refFile.exists()) {
			refFile.mkdir();
		}

	
		String xml = request.getServletContext().getRealPath("/writeprints_feature_set_limited.xml");
		System.out.println("Temporary File Directory: " + refDir);

		//TODO is the document to identify always at a specific index? 
		//Surely there's a better way to determine which is which than whether or not we're at the end of the iterator
		while (itr.hasNext()) {
			String uploadedFile = itr.next();
			MultipartFile file = request.getFile(uploadedFile);
			if (uploadedFile.contains("author")) {
				System.out.println("Adding train document: " + file.getOriginalFilename());
				int closeBracket = uploadedFile.indexOf(']'); // example authors[0].files[0] // just includes authors[0]
				String authorString = uploadedFile.substring(closeBracket + 1,uploadedFile.length());
				closeBracket = authorString.indexOf(']');
				String subAuthorString = authorString.substring(1,closeBracket);
				ps.addTrainDoc(subAuthorString, makeDoc(file, userAuthor, refDir));
			} else if(uploadedFile.contains("test")) {
				System.out.println("Adding test document: " + file.getOriginalFilename());
				testDocument = file.getOriginalFilename();
				ps.addTestDoc(userAuthor, makeDoc(file, userAuthor, testDir));
				testDocument = file.getOriginalFilename();
			}
		}

		//switch on essay/email/tweet dbs
		System.out.println("Problem Set XML\n" + ps.toXMLString());
		FullAPI fullApi =  new Builder().cfdPath(xml)
										.ps(ps)
										.setAnalyzer(new WekaAnalyzer())
										.numThreads(4)
										.analysisType(analysisType.TRAIN_TEST_UNKNOWN)
										.build();
		fullApi.prepareInstances();
		fullApi.calcInfoGain();
		fullApi.run();

		
		JsonObject json = fullApi.getResults().toJson();
		JsonArray probabilityMap = json.getAsJsonArray("experimentContents").get(0).getAsJsonObject().getAsJsonArray("probabilityMap");
		int numberOfAuthors = probabilityMap.size();
		double maxProbability = 0;
		String suspectedAuthor = "";
		for (int i = 0; i < numberOfAuthors; i++) {
			String author = probabilityMap.get(i).getAsJsonObject().get("Author").getAsString();
			double probability = probabilityMap.get(i).getAsJsonObject().get("Probability").getAsDouble();
			if (probability > maxProbability) {
				suspectedAuthor = author;
				maxProbability = probability;
			}
		}
		
		JsonObject jsonTestDocCounts = new JsonObject();
		DataMap testingDataMap = fullApi.getTestingDataMap(); // Contains the test document(s) only
		ConcurrentHashMap<String, DocumentData> featureDataMap = testingDataMap.getDataMap().get(userAuthor);
		for (Entry <Integer, String> featureEntry: testingDataMap.getFeatures().entrySet()) {
			String feature = featureEntry.getValue();
			Integer featureCount = 0;
			for (Entry <String, DocumentData> testDocumentEntry: featureDataMap.entrySet()) {
				FeatureData featureData = testDocumentEntry.getValue().getDataValues().get(featureEntry.getKey());
				if (featureData != null) {
					featureCount = featureData.getCount();
				}
			}
			jsonTestDocCounts.addProperty(feature, featureCount);
		}
		
		JsonObject jsonOtherAuthorsAverageCounts = new JsonObject();
		DataMap otherDocsDataMap = fullApi.getTrainingDataMap(); // ALL other docs (include user's other docs)
		HashMap<String, Double> randomAuthorsAverageCounts = new HashMap<String, Double>();
		for (Entry<String, ConcurrentHashMap<String, DocumentData>> authorEntry : otherDocsDataMap.getDataMap().entrySet()) {
			String authorName = authorEntry.getKey();
			if (authorName.equals(suspectedAuthor)) {
				featureDataMap = authorEntry.getValue();
				for (Entry <Integer, String> featureEntry: otherDocsDataMap.getFeatures().entrySet()) {
					String feature = featureEntry.getValue();
					double featureCount = 0.0;
					double numOfOtherDocs = 0.0;
					for (Entry <String, DocumentData> otherDocumentsEntry: featureDataMap.entrySet()) {
						numOfOtherDocs++;
						FeatureData featureData = otherDocumentsEntry.getValue().getDataValues().get(featureEntry.getKey());
						if (featureData != null) {
							featureCount += featureData.getCount();
						}
					}
					double featureAverage = featureCount / numOfOtherDocs;
					randomAuthorsAverageCounts.put(feature, featureAverage);
				}
			}
		}
		for (Entry<String, Double> featureAverage : randomAuthorsAverageCounts.entrySet()) {
			String feature = featureAverage.getKey();
			double average = Math.round(featureAverage.getValue() * 100.0) / 100.0;
			jsonOtherAuthorsAverageCounts.addProperty(feature, average);
		}

		json = fullApi.getResults().toJson();		
		json.addProperty("InfoGain", fullApi.getReadableInfoGain(false));
		json.addProperty("suspectedAuthor", suspectedAuthor);
		json.add("FeatureTestDocCounts", jsonTestDocCounts);
		json.add("FeatureOtherAuthorsAverageCounts", jsonOtherAuthorsAverageCounts);
		return json.toString();
	}

	private Document makeDoc(File file, String author) {
		return new Document(file.getPath(), author, file.getName());
	}

	private Document makeDoc(MultipartFile file, String author, String destinationDirectory)
	throws IllegalStateException, IOException {
		String filepath = destinationDirectory + file.getOriginalFilename();
		File dest = new File(filepath);
		System.out.println("Adding file: " + file.getOriginalFilename() + " to " + filepath + " in " + destinationDirectory);
		file.transferTo(dest);
		return new Document(dest.getPath(), author, file.getOriginalFilename());
	}
}