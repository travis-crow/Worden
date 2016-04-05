package com.websystique.springmvc.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.jgaap.generics.Document;

import edu.drexel.psal.jstylo.generics.FullAPI;
import edu.drexel.psal.jstylo.generics.FullAPI.Builder;
import edu.drexel.psal.jstylo.generics.FullAPI.analysisType;
import edu.drexel.psal.jstylo.generics.ProblemSet;

@Controller
@RequestMapping("/")
public class IndexController {

        private static String userAuthor = "testAuthor";
    
		@RequestMapping("/")
	    public String getIndexPage() {
	        return "UserManagement";
	    }
		@RequestMapping("/Welcome")
	    public String getWelcomePage() {
	        return "Welcome";
	    }
		
		@RequestMapping("/TestDocument")
		public String getTestDocument(){
			return "TestDocument";
		}
		
		@ResponseStatus(value = HttpStatus.OK)
		    @RequestMapping(value = "/StartProcess", method = RequestMethod.POST)
		    public @ResponseBody String startProcess(MultipartHttpServletRequest request, @RequestParam("type") String type ) throws IOException {

				ProblemSet ps = new ProblemSet();
				ArrayList<Document> documents = new ArrayList<Document>();
                Iterator<String> itr = request.getFileNames();
                String testDir = "./References/test/";///request.getServletContext().getRealPath("/TestDocument/");
                String refDir = "./References/train/";//request.getServletContext().getRealPath("/References/");
                String xml = request.getServletContext().getRealPath("/writeprints_feature_set_limited.xml");
                System.out.println("Temporary File Directory: "+refDir);
                while (itr.hasNext()) {
                    String uploadedFile = itr.next();
                    MultipartFile file = request.getFile(uploadedFile);
                    if(!itr.hasNext()){

                        ps.addTestDoc(userAuthor, makeDoc(file,userAuthor,testDir));
                    }
                    else{
        		        documents.add(makeDoc(file,userAuthor,refDir));
                    }
                }	
                ps.addTrainDocs(userAuthor, documents);
                
                //TODO load in the sample files
                //sample files are currently located in References/samples
                /*
                File otherAuthorsDir = new File("/Users/tdutko001c/git/wordenseniordesign/References/samples/drexel_1");
                for (File authorDir : otherAuthorsDir.listFiles()){
                    List<Document> docs = new ArrayList<Document>();
                    for (File f : authorDir.listFiles()){
                        docs.add(makeDoc(f,authorDir.getName()));
                    }
                }
                */
                
                System.out.println("Problem Set XML\n"+ps.toXMLString());
                FullAPI fullApi = new Builder()
                .cfdPath(xml)
                .ps(ps)
                .classifierPath("weka.classifiers.functions.SMO")
                .numThreads(1)
                .analysisType(analysisType.TRAIN_TEST_KNOWN)
                .build();
                
                fullApi.prepareInstances();
                fullApi.prepareAnalyzer();
                fullApi.run();
                
                String string = fullApi.getStatString(); 
                return string;
		    }

    private Document makeDoc(File file, String author) {
        return new Document(file.getPath(), author, file.getName());
    }

    private Document makeDoc(MultipartFile file, String author, String destinationDirectory)
            throws IllegalStateException, IOException {
        String filepath = destinationDirectory + file.getName();
        File dest = new File(filepath);
        file.transferTo(dest);
        return new Document(dest.getPath(), author, file.getName());
    }

}