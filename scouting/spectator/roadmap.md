## Moving forward

### Improvements to the tracking form / data

1. track the human player's performance
   * how? What is the specific data we're recording?
     * "hits" vs "misses"
     * qualitative rating

### Improvements to the app architecture

1. split out data aggregation / interpretation into own app ("Spectator Rollup")
2. make transmission of data from "Spectator" to "Rollup" ***easier***
   * need to ensure data integrity is maintained
     * data should not need to be maintained by Scouters, but should be *"transmitted"* to *"central location"* on "Commit"

What does "transmitting" the data look like and what is our "central location"?

##### Option 1: QR Code
* Transmission: 
  * by QR Code
* Central location: 
  * the rollup app itself
* summary: 
  * instead of producing a QR Code that represents a tab-separated row of data meant to be copied into a spreadsheet, we would produce a QR code representing a link to the Rollup app that would include a query parameter with the data to be integrated.
  * upon clicking the link, the user would then be taken to the Rollup app, and the data in the query parameter would be integrated with the rest of the data the user holds, which would be held in "local storage"
    * (could also automatically download the fully integrated data locally, should anything happen)
* pros: 
  * everything stays within the client side
  * fast to develop
* cons: 
  * needing to scan QR Codes
  * need to rely on people's local devices to maintain the data
  * less secure

##### Option 2: Google Sheets
* Transmission:
  * to Google Sheet
* Central Location
  * a given / chosen Google Sheet
* summary:
  * When a Scouter commits their report, it is sent and added to a Google Sheet
  * Rollup queries the Google Sheet for data, without any necessary interaction between users.
* pros:
  * not dependent on particular devices
  * data security / integrity
  * external service is (potentially) free
* cons:
  * slower to develop
  * need to ensure security 
    * avoid enshrining ids in code
      * api-key
      * spreadsheet-id
      * etc

##### Option 3: Custom server / service
* Transmission:
  * api call to our own service
* Central location
  * whatever we want
* summary:
  * we build our own backend
    * initial design thoughts:
      * shared transient sessions
        * host creates a session and shares session key with all relevant parties
      * all data is recorded to / queried from the session
      * once we're done with it, the session is allowed to expire
* pros:
  * we control how the data is stored and where
* cons:
  * setup
  * additional development time
  * potential monetary cost of deploying our own server