package com.websystique.springmvc.controller;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
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

import com.google.gson.JsonObject;
import com.jgaap.generics.Document;

import edu.drexel.psal.jstylo.generics.FullAPI;
import edu.drexel.psal.jstylo.generics.FullAPI.Builder;
import edu.drexel.psal.jstylo.generics.FullAPI.analysisType;
import edu.drexel.psal.jstylo.generics.ProblemSet;
import edu.drexel.psal.jstylo.machineLearning.weka.WekaAnalyzer;

@Controller
@RequestMapping("/")
public class IndexController {

    private static String userAuthor = "testAuthor";

	@RequestMapping("/")
    public String getIndexPage() {
        return "Welcome";
    }
	@RequestMapping("/Welcome")
    public String getWelcomePage() {
        return "Welcome";
    }
	
	@RequestMapping("/TestDocument")
	public String getTestDocument(){
		return "TestDocument";
	}
	
	@RequestMapping("/IdentifyDocument")
	public String getIdentifyDocument(){
		return "IdentifyDocument";
	}
	
	@ResponseStatus(value = HttpStatus.OK)
    @RequestMapping(value = "/StartProcess", method = RequestMethod.POST)
    public @ResponseBody String startProcess(MultipartHttpServletRequest request, @RequestParam("type") String type ) throws IOException {

		ProblemSet ps = new ProblemSet();
		ps.setTrainCorpusName("Worden Experiment");
        Iterator<String> itr = request.getFileNames();
        String testDir = request.getServletContext().getRealPath("/TestDocument/");
        String refDir = request.getServletContext().getRealPath("/TrainDocuments/");
        
        File testFile = new File(testDir);
        if(!testFile.exists()){
        	testFile.mkdir();
        }
        
        File refFile = new File(refDir);
        if(!refFile.exists()){
        	refFile.mkdir();
        }
        //TODO need to make these paths relative / internal
       /* String testDir = "/Users/Eric/Documents/TestDocument/";///request.getServletContext().getRealPath("/TestDocument/");
        String refDir = "/Users/Eric/Documents/References/";//request.getServletContext().getRealPath("/References/");*/
        String xml = request.getServletContext().getRealPath("/writeprints_feature_set_limited.xml");
        System.out.println("Temporary File Directory: "+refDir);
        
        //TODO is the document to identify always at a specific index? 
        //Surely there's a better way to determine which is which than whether or not we're at the end of the iterator
        while (itr.hasNext()) {
            String uploadedFile = itr.next();
            MultipartFile file = request.getFile(uploadedFile);
            if(!itr.hasNext()){
                System.out.println("Adding test document: "+file.getOriginalFilename());
                ps.addTestDoc(userAuthor, makeDoc(file,userAuthor,testDir));
            }
            else{
                System.out.println("Adding train document: "+file.getOriginalFilename());
                ps.addTrainDoc(userAuthor, makeDoc(file,userAuthor,refDir));
            }
        }	
        
        
        //TODO load in the sample files
                        //sample files are currently located in References/samples
        if(type != null)
        {
            String samplePath;
            if(type == "2"){
            	samplePath = request.getServletContext().getRealPath("/References/samples/emails");
            }
            else if(type == "3"){
            	samplePath = request.getServletContext().getRealPath("/References/samples/twitter");
            }
            else {
            	samplePath = request.getServletContext().getRealPath("/References/samples/essays");
            }
          
                       FileUtils file = new FileUtils();
                       Iterator<File> files = file.iterateFiles(new File(samplePath),null, true);
                       
                      while(files.hasNext()){
                    	  File currentFile = files.next();
                    	  String currentAuthor = currentFile.getParentFile().getName();
                    	  System.out.println("Adding train document: "+currentFile.getName());
                    	  ps.addTrainDoc(currentAuthor, makeDoc(currentFile,currentAuthor));
                      }
        }          
                    
                        
        //switch on essay/email/tweet dbs
        
        System.out.println("Problem Set XML\n"+ps.toXMLString());
        FullAPI fullApi = new Builder()
        .cfdPath(xml)
        .ps(ps)
        .setAnalyzer(new WekaAnalyzer())
        .numThreads(1)
        .analysisType(analysisType.TRAIN_TEST_KNOWN)
        .build();
        
        fullApi.prepareInstances();
        fullApi.calcInfoGain();
        fullApi.run();
        
        //ConcurrentHashMap<Integer, Double> test = fullApi.getTrainingDataMap().getDataMap().get("author").get("title");
//        getDataValues().get(index).getCount();
        
        JsonObject json = fullApi.getResults().toJson();
        json.addProperty("InfoGain",fullApi.getReadableInfoGain(false));
        return json.toString();
    }

    private Document makeDoc(File file, String author) {
        return new Document(file.getPath(), author, file.getName());
    }

    private Document makeDoc(MultipartFile file, String author, String destinationDirectory)
            throws IllegalStateException, IOException {
        String filepath = destinationDirectory + file.getOriginalFilename();
        File dest = new File(filepath);
        System.out.println("Adding file: "+file.getOriginalFilename()+" to "+filepath+" in "+destinationDirectory);
        file.transferTo(dest);
        return new Document(dest.getPath(), author, file.getOriginalFilename());
    }

}