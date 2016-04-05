package com.websystique.springmvc.controller;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;


import org.apache.commons.fileupload.FileUpload;
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
                String testDir = "/Users/Eric/Documents/TestDocument/";///request.getServletContext().getRealPath("/TestDocument/");
                String refDir = "/Users/Eric/Documents/References/";//request.getServletContext().getRealPath("/References/");
                String xml = request.getServletContext().getRealPath("/writeprints_feature_set_limited.xml");
                System.out.println(refDir);
                Builder builder = new Builder();
                while (itr.hasNext()) {
                    String uploadedFile = itr.next();
                    MultipartFile file = request.getFile(uploadedFile);
                    String mimeType = file.getContentType();
                    String filename = file.getOriginalFilename();
                    byte[] bytes = file.getBytes();
                    String filepath;
                    if(!itr.hasNext()){
                        filepath = testDir + filename;
                        File dest = new File(filepath);
                        file.transferTo(dest);
                        Document d1 = new Document(filepath,"TestAuthor",filename);
                        ps.addTestDoc("testAuthor", d1);

                    }
                    else{
                        filepath = refDir + filename;
                        File dest = new File(filepath);
                        file.transferTo(dest);
                        Document d1 = new Document(filepath,"TestAuthor",filename);
        		        documents.add(d1);
        		        ps.addTrainDocs("testAuthor", documents);
                    }
                    
                 
                }	
                
                System.out.println(ps.toXMLString());
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

		
		
}