<%@ page language="java" contentType="text/html; charset=ISO-8859-1" pageEncoding="ISO-8859-1"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0" />
		<title>Worden</title>
		<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<link href="<c:url value='/static/css/materialize.css' />" rel="stylesheet" />
		<link href="<c:url value='/static/css/style.css' />" rel="stylesheet" />
	</head>

	<body>
		<main>
			<div class="section no-pad-bot" id="index-banner">
				<div class="container">
					<div class="row center">
						<img class="responsive-img" style="max-height: 125px;" src="<c:url value='/static/images/worden-banner-logo.png' />" />
					</div>
					
					<div class="row center">
						<h5 class="header col s12 light">Determine the true author of anonymous documents</h5>
					</div>
					<div class="row center">
						<div class="col s12 l6" style="margin-bottom: 20px;">
							<a href="/Worden/TestDocument" id="text-your-own-document-button" class="btn-large waves-effect waves-light purple">Test Your Own Document</a>
						</div>
						<div class="col s12 l6">
							<a href="/Worden/IdentifyDocument" id="identify-anonymous-document-button" class="btn-large waves-effect waves-light purple">Identify Anonymous Document</a>
						</div>
					</div>
					<br>
					<br>
				</div>
			</div>

			<div class="divider"></div>
			<br>
			<br>

			<div class="container">
				<div class="section">
					<h4>What is Worden?</h4>
					<p>Worden is a natural language processing tool to help protect the privacy and security of individuals by obfuscating their writing style.</p>
					<br>
					<h4>Why make this tool?</h4>
					<p>For a while now with current technology, it has been possible for individuals to be identified based on nothing more than their writing style. This is even more troubling with the exposure of NSA's Prism - among other privacy invading initiatives - which make it entirely possible for them to easily attribute anonymous publications by feeding their databases into existing tools such as JGAAP and JStylo. Among the many potential consequences of this ability means that whistle blowers revealing sensitive information about highly influential people or shady government operations such as the NSA are at risk of revealing themselves simply by the way they write.</p>
					<p>Worden aims to take this technology of the hands of labs and government officials and instead deliver it to the hands of the people.</p>
					<br>
					<h4>How is this possible?</h4>
					<p>Worden uses a technique of writing analysis called "stylometry" which allows individuals to suss out both obvious and non-obvious features in a particular writing like common words, bigrams, etc. These features tend to be highly unique to the individual that wrote them, much like their fingerprints are inherently in the text itself.</p>
					<br>
					<h4>Who made this tool?</h4>
					<p>Worden is the combined effort of a small team at Drexel University guided by Rachel Greenstadt and Jeff Salvage. The team consists of (in alphabetical order):</p>
					<ul>
						<li><a href="http://barrowclift.me" class="purple-text">Marc Barrowclift</a> - Frontend developer, designer</li>
						<li>Travis Dutko - Domain expert, additional JStylo development</li>
						<li><a href="https://www.linkedin.com/in/coreyeveritt" class="purple-text">Corey Everitt</a> - Documenter, User Testing</li>
						<li>Jiakang Jin - Additional JStylo development</li>
						<li><a href="https://www.linkedin.com/in/eric-nordstrom-a1135269" class="purple-text">Eric Nordstrom</a> - Web app angular developer</li>
						<li>Ivan "Frankie" Orrego - Documenter, User Testing</li>
					</ul>
					<p>Worden's core was built on JStylo, a previous project built at Drexel University.</p>
				</div>
				<div class="section">
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

		<!--  Scripts-->
		<script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
		<script src="<c:url value='/static/js/materialize.js' />"></script>
	</body>
</html>