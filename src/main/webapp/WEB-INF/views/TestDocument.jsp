<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
	<title>Worden - Test Your Own Document</title>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="<c:url value='/static/css/materialize.css' />" rel="stylesheet"" rel="stylesheet" />
	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js"></script>
	<script src="<c:url value='/static/js/ng-file-upload.js' />" ></script>
	<script src="<c:url value='/static/js/fileUploadController.js' />" ></script>
	<link href="<c:url value='/static/css/style.css' />" rel="stylesheet" rel="stylesheet" />

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
	<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
	<script src="../js/materialize.js"></script>
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