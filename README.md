# Worden

Worden is a web application which weighs the power of JStylo (https://github.com/psal/jstylo) to allow the core functions of the authorship-attribution engine to be accessible via the web.

## Work-in-progress

Worden is currently a work in progress, and while it is capable of running, there are some inconveniences in its setup which we are working to resolve. Namely, the primary resources, JStylo, is not available in the Maven central repository (this is due in turn to a large dependency it possesses which is not available there). While we have plans to adjust that in the future, for the time being JStylo must be either manually added to your local maven repository (and the pom file of worden updated to reflect this) or you must checkout JStylo(https://github.com/psal/jstylo), build it, and place "jstylo-2.9.0.jar" in DeployedResources/WebContent/lib/. You must also take the jgaap-5.2.0-lite.jar located in the JStylo github and place it in DeployedResources/WebContent/lib/ as well.

We apologize for this inconvenience.

### Running Worden

To run Worden, you must follow the following instructions.

1. Clone this project
2. Install JStylo as described in the Work-in-progress section
3. build Worden via a Maven install with Worden's pom file
4. Deploy the generated war file to a server configured to handle it

More detailed documentation will be added at a later date.

