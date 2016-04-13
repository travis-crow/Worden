<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
	<title>Worden - Test Your Own Document</title>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="<c:url value='/static/css/materialize.css' />" rel="stylesheet"" rel="stylesheet" />
	<script src="https://code.jquery.com/jquery-git.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/js/materialize.min.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
	<script src="<c:url value='/static/js/ng-file-upload.js' />" ></script>
	<script src="<c:url value='/static/js/fileUploadController.js' />" ></script>
	<link href="<c:url value='/static/css/style.css' />" rel="stylesheet" rel="stylesheet" />
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/font/material-design-icons/Material-Design-Icons.woff">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.6/font/roboto/Roboto-Bold.eot">
</head>

<body ng-app="fileUpload" ng-controller="fileUploadController">
	<header>
		<nav class="white" role="navigation">
			<div class="nav-wrapper" style="margin-left: 1em;">
				<a href="../Spring4MVCAngularJSExample/Welcome" class="brand-logo right"><img id="worden-logo" src="<c:url value='/static/images/worden-banner-logo.png' />"></a>
				<div class="col s12 hide-on-med-and-down">
					<a href="../" class="breadcrumb">Home</a>
					<a href="./" class="breadcrumb">Test Your Own Document</a>
				</div>
			</div>
		</nav>
	</header>
	
	<main>
	
	<div ng-show="loading">
	<h3 class="header center"><i style="color:#9B4DCA;" class=" fa fa-circle-o-notch fa-spin fa-3x"></i></h3>
				<h3 style="color:#9B4DCA;" class="header center">This might take some time..... </i></h3>
				
	</div>
	
	<div ng-hide="results || loading">
		<div class="section" id="index-banner">
			<h3 class="header center">Test Your Own Document</h3>
		</div>
		<div class="container">
			<div class="row">
				<form action="#">
					<p>Add at least one document of yours for Worden to attempt to identify:</p>
					<div class="">
						
							<button class="btn-large waves-effect waves-light purple" type="file" ngf-select ng-model="testFile" name="file"    
             				 ngf-max-size="10MB" required
             				ngf-model-invalid="errorFile">Add Test Document</button>
      						<i ng-show="myForm.file.$error.required">*required</i><br>
      						<i ng-show="myForm.file.$error.maxSize">File too large 
          					{{errorFile.size / 1000000|number:1}}MB: max 2M</i>
      					
					
						<div class="file-path-wrapper">
							<div class="file-path validate" type="text">{{testFile.name}}</div>
							<button ng-click="testFile = null" ng-show="testFile">Remove</button>
						</div>
					</div>
					<br>
					<p>Add at least two other similar documents you've written to see if Worden will match your documents above to them. It if can, then the above documents are not anonymous and stand the risk of revealing your identify:</p>
					<div class="file-field input-field">
						
							<button class="btn-large waves-effect waves-light purple" 
							ngf-select="uploadFiles($files, $invalidFiles)" multiple
         					  ngf-max-height="1000" ngf-max-size="10MB">
      						Add Other Documents</button>
						<div class="row">
						<div class="file-path-wrapper col s12" ng-repeat="file in files">
							<div class="file-path validate" type="text">{{file.name}}</div>
							<button ng-click="files[$index] = null" ng-show="files[$index]">Remove</button>
						</div>
						</div>
					</div>
					<br>
				</form>
				<div>
				<p>Select whether or not you have some similar documents from at least two other people which your documents would most likely be compared against when someone would try identifying the author:</p>
				<button ng-hide="uploadGenericSet" ng-click="selectUploadGenericSet()" id="text-your-own-document-next-page" class="btn waves-effect waves-light purple">Select Generic Set</button>
				<button ng-hide="uploadAuthors" ng-click="selectUploadAuthors()" id="text-your-own-document-next-page" class="btn waves-effect waves-light purple">Upload Known Authors</button>
				</div>
				
			<div id="genericDocumentSet" ng-show="uploadGenericSet">
			<h3 class="header center">Selecting Generic Document Set</h3>
			<div class="row">
				<p>While providing Worden with documents from other similar authors your document to anonymize would be compared against delivers the best results, Worden provides some generic writing sets for common writing types for you to choose from for you to test with. It is recommended you supply an appropriate writing set for legitimate attempts to anonymize your documents.</p>
				<br>
				<div class="col s12">
				<label>Select writing type</label>
				<div class="input-field">
				</div>
					<select ng-model="type" style="display:block;">
						<option value="1" selected>Email</option>
						<option value="2">Paper</option>
						<option value="3">Tweet</option>
					</select>
					
				</div>
			</div>
			</div>
			
			<div id="uploadAuthors" ng-show="uploadAuthors">
			<h3 class="header center">Adding Other Authors' Documents</h3>
			<div class="row">
				<p>Add documents from at least three authors your documents will be compared against.</p>
				<div class="col  s12">
					<div class="col s12" style="    padding: 0; background-color:white;border: solid 1px #D1D1D1;border-radius:2px;">
						<div class = "col s4" style="background-color:#F4F5F6;border-right: 1px solid #D1D1D1;border-bottom-left-radius:2px;border-top-left-radius:2px;">
							<div class="row">
								<div class="col s12" style="padding-top:6px;">
									<a href="" ng-click="addAuthor()" id="create-author" class="btn-flat center purple-text" style="display: block; width: 100%;">Create Author</a>
									<input id="add-documents" class="btn-flat center purple-text" type="button" value="Add Documents" style="=display: block; width: 100%;">
									<a href="" id="rename-author" class="btn-flat center purple-text" style="display: block; width: 100%;">Rename Author</a>
									<a href="" id="remove" class="btn-flat center purple-text" style="display: block; width: 100%;">Remove</a>
									<a href="" id="remove-all" class="btn-flat center purple-text" style="display: block; width: 100%;">Remove All</a>
									<input name="add-documents" id="add-documents-input" type="file" multiple="" style="visibility:hidden">
								</div>
							</div>
						</div>
						<div class="col s4">
						<div ng-show="addNewAuthor">
							<input type = "text"  ng-model="addNewAuthorName" placeholder="Name"><button ng-click="submitNewAuthor()" class="btn waves-effect waves-light purple">Add</button>
						</div>
						<div ng-repeat="author in authors">
						<div ng-class="" ng-click="selectAuthor($index)" style="padding:0" class="btn-flat "><i style="margin-right:5px;" class="fa fa-user"></i>{{author.Name}}</div>
						</div>
						</div>
						<div ng-show="currentAuthor" class="col s4">
						<div style="cursor:pointer;font-size:15px" type="file" ng-change="setFile()" ngf-select ng-model="currentAuthor.UploadFile" class="center purple-text">Add To {{currentAuthor.Name}}'s Documents</div>
							<div ng-repeat="file in currentAuthor.Files">
								{{file.name}}
							</div>
						</div>
					</div>
				</div>
				
			</div>
			
			</div>
			
			<br>
			<div class="row">
				<div class="col s12">
					<button ng-click="startUpload()" id="text-your-own-document-next-page" class="btn waves-effect waves-light purple">Start</button>
				</div>
			</div>
		</div>
			</div>
			<br>
			
		</div>
		<div ng-show="results" ng-hide="results === false">
		<div class="section" id="index-banner">
			<h3 class="header center">Results</h3>
		</div>
		<div class="row">
			<div class="container">
			<h4 style="color:#9B4DCA" class="header center">Document: {{results.experimentContents[0].title}}</h4>
				<p>Worden believes <strong id="suspectedAuthor">{{suspected}}</strong> the true author of <strong class="documentName">{{results.experimentContents[0].title}}</strong> among the <strong id="numberOfAuthors"></strong> other authors. </p>
				<br>
			</div>
			<div class="row" id="suggestions">
			</div>
		</div>

		<!-- Modal Structure -->
		<div id="modal1" class="modal">
			<div class="modal-content">
				<div class="container" style="overflow-y: scroll;overflow-x: hidden;max-height:350px;">
					<div class="row">
						<div class="col s12 l10 offset-l1">
							<table class="centered highlight bordered">
								<thead>
									<tr>
										<th data-field="id">Author</th>
										<th data-field="name">Wrote <span class="documentName"></span></th>
									</tr>
								</thead>
								<tbody id="certaintyTable">
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<a href="#!" class="modal-action modal-close waves-effect waves-light purple btn" style="margin-right:5px;">Close</a>
			</div>
		</div>
		</div>
	</main>

	<footer class="page-footer white">
		<div class="container">
			<div class="row">
				<div class="col s7 offset-s5">
					<a href="http://drexel.edu/cci/"><img width="45" style="padding-top:15px;" src="<c:url value='/static/images/drexel-logo.png' />" /></a>
				</div>
			</div>
		</div>
	</footer>
	
	<!-- Scripts -->
	<script>
		$(document).ready(function() {
			$('input:radio').change(function() {
				switch($(this).context.id) {
 					case 'has-author-documents':
 						$("#text-your-own-document-next-page").attr("href", "../adding-other-authors-documents/");
 						break;
 					case 'does-not-have-author-documents':
 						$("#text-your-own-document-next-page").attr("href", "");
 						break;
 				}
			});
		});
	</script>
</body>
<style>
.selectedAuthor
{
	background-color: #9B4DCA !important;
    color: #FFF;
}
.divTextInput{
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #9e9e9e;
    border-radius: 0;
    outline: none;
    height: 3rem;
    width: 100%;
    font-size: 1rem;
    margin: 0 0 15px 0;
    padding: 0;
    box-shadow: none;
    box-sizing: content-box;
    transition: all .3s;
}
</style>
</html>