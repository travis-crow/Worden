<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html lang="en">

	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
		<title>Worden - Identify Anonymous Document</title>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<link href="<c:url value='/static/css/materialize.css' />" rel="stylesheet" " rel="stylesheet " />
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.5/angular.min.js "></script>
		<script src="<c:url value='/static/js/ng-file-upload.js' />" ></script>
		<script src="<c:url value='/static/js/fileUploadController.js' />"></script>
		<link href="<c:url value='/static/css/style.css' />" rel="stylesheet" rel="stylesheet" />
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
	</head>

	<body ng-app="fileUpload" ng-controller="fileUploadController">
		<header>
			<nav class="white" role="navigation">
				<div class="nav-wrapper" style="margin-left: 1em;">
					<a href="../Worden/Welcome" class="brand-logo right"><img id="worden-logo" src="<c:url value='/static/images/worden-banner-logo.png' />"></a>
					<div class="col s12 hide-on-med-and-down">
						<a href="../Worden/Welcome" class="breadcrumb">Home</a>
						<a href="../Worden/IdentifyDocument" class="breadcrumb">Identify Anonymous Document</a>
						<span ng-show="results" ng-hide="results === false" class="breadcrumb">Results</span>
					</div>
				</div>
			</nav>
		</header>
		<main>
			<div ng-show="loading">
				<div class="section" id="index-banner">
					<h3 class="header center">This might take some time..... </i></h3>
				</div>
				<br>
				<h3 class="header center"><i style="color:#9B4DCA;" class="fa fa-circle-o-notch fa-spin fa-1x"></i></h3>
			</div>
			<div ng-hide="results || loading">
				<div class="section" id="index-banner">
					<h3 class="header center">Select Your Documents</h3>
				</div>
				<div class="container">
					<div class="row">
						<form action="#">
							<p>Select the anonymous document to identify:</p>
							<div class="file-field input-field">
								<div id="add-test-document" class="btn-large waves-effect waves-light purple col l4 s12" type="file" name="file" required ng-model="testFile" ngf-max-size="10MB" ngf-select ngf-model-invalid="errorFile">
									<span>Add Document</span>
									<input type="file" multiple>
								</div>
								<div class="col s12 chip-box inactive-box" id="test-document-box">
									<div class="custom-chip">
										<button class="custom-chip-delete-button" ng-click="testFile = null" ng-show="testFile">
											<i class="tiny material-icons">close</i>
										</button>
										{{testFile.name}}
									</div>
								</div>
							</div>
						</form>
						<br>
					</div>
					<div id="uploadAuthors" ng-show="testFile">
						<br>
						<div class="row">
							<p>Add documents from at least three authors that may have written the anonymous document:</p>
							<div class="col  s12">
								<div class="col s12" style="    padding: 0; background-color:white;border: solid 1px #D1D1D1;border-radius:2px;">
									<div class="col s4" style="background-color:#F4F5F6;border-right: 1px solid #D1D1D1;border-bottom-left-radius:2px;border-top-left-radius:2px;">
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
											<input type="text" ng-model="addNewAuthorName" placeholder="Name">
											<button ng-click="submitNewAuthor()" class="btn waves-effect waves-light purple">Add</button>
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
						<div class="row">
							<div class="col s12">
								<button ng-click="startUpload()" id="text-your-own-document-next-page" class="btn waves-effect waves-light purple">Start</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div ng-show="results" ng-hide="results === false">
				<div class="section" id="index-banner">
					<h3 class="header center">Results</h3>
				</div>
				<div class="row">
					<h4 style="color:#9B4DCA" class="header center">{{ verdict }} {{results.experimentContents[0].title}}</h4>
					<div class="container">
						<!-- <p class="center">Worden believes <strong id="suspectedAuthor" style="text-decoration:underline;">{{suspected}}</strong> the true author of <strong class="documentName">{{results.experimentContents[0].title}}</strong> among the <strong id="numberOfAuthors"></strong> other authors. </p> -->
						<p>{{ response }}</p>
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
					<div class="center">
						<a href="http://drexel.edu/cci/"><img width="45" style="padding-top:15px;" src="<c:url value='/static/images/drexel-logo.png' />" /></a>
					</div>
				</div>
			</div>
		</footer>
		<!-- Scripts -->
		<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="<c:url value='/static/js/materialize.js' />"></script>
	</body>

	<style>
		.selectedAuthor {
			background-color: #9B4DCA !important;
			color: #FFF;
		}

		div.ng-valid~div.inactive-box,
		button.ng-valid~div.inactive-box {
			border-color: #84C43F;
		}

		div .ng-hide {
			min-width: 100px;
			min-height: 20px;
			background-color: red;
		}
	</style>
</html>