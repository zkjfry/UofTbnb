# UOFT BNB
## Description
Our app is a house renting app that is similar to air bnb, but have additional features for university students specifically. We mainly provide two services: House renting and Roommates finding. There are two main target user groups for our app: Tenants and Landlords. Some features are for landlords, some features are for tenants, but they are both classified as users in our web app. 

## Walkthrough
* The first page you see will be the login page. We have two default accounts:
	* Email: admin, Password: admin for admin account
	* Email: user, Password: user for user
* You can also signup for another account by clicking the yellow sign up button. After that you can use your newly created account to sign in.
* After logging in, you will be redirected to the main page of our app, which is the tenant page. In this page, users can search for their desired houses/apartments and click on the info card to see more informations. 
* There is a nav bar on the top of the screen which has the following functionality:
	* Access message button: Clicking on the message icon on the left of the nav bar will redirect you to the message page. Which we will talk about it later. There is also a text field that display how many messages you are getting now.
	*  Redirect buttons: On the right of the message button, there will be redirect buttons. The first one will take you to the tenant page. The second one will take you to the landlord page. The third one will take you to the roommate page. The last one is the sign out button, which sign out the current user and redirect you to the login page.
* On the right of the redirect buttons there is the current user's name and his profile picture, with a button that brings up a side bar. Click on the user's profile picture will redirect you to his user's page. There are two buttons on the side bar: one that redirect you to the user's page and signs the current user out.
* There are couple of cards under the nav bar that act as location filters. Click on each of them to display the houses that matches the location displayed on that card.
* Below those card are the filters and the houses. The filter on the left allows the user to enter more detailed information about the house the want to search. The user must fill in all the information and click the search button at the bottom in order to use the filter properly.
* The houses are displayed on the right are the houses that matched the filter's requirement. You can click on the card to brings out a horizontal menu which has a button that allows you to check detailed information about the house.
* The roommate page works exactly the same as the tenant page. Except the view detailed button is displayed on the card instead of the side bar. Also, the filter for the roommate page has the wakeup time range and sleep time range. For these 2 parameters, our design was only doing comparison regardless of the date, hence if the user input the sleep time range from 11 PM to 2 AM on the next day, it won't work. 
* The landlord page is a form that allows the user to submit information about their apartment/house if they want to rent them out. After you complete one section, click the next button to go back to the previous section if you want to change some information. After filling out the information, click on the submite button to upload the house listing. You MUST fill in all of the text areas and inputs, as well as the pictures, or the uploaded info won't be saved to the database. Also, the price has to be integer, cannot be floats. If you go back to the mainpage after submitting, you should be able to see your submission. In order to make this page works properly, YOU NEED TO FILL IN ALL THE INFORMATION.
* The user page will display all the information about the current user. Users can change his profile picture on this page as well as change his password. This place also display the current user's renting status. For the current rented house, you can click on the end renting button to end the renting. For the past rented house, you can click on the write review button to write review for that house.
* The house info page displays some detailed information about the house. This includes all the information about the house that the landlord submited in the landlord page. At the bottom there are reviews for the house other people wrote. There is also a reserve card that allows the user to send a reserve request to the landlord. In order to make this page works properly, PLEASE FILL IN THE START DATE AND THE END DATE.
* The roommate info page is identical to the house info page, except it displays all the information about the roommate instead of the landlord.
* The edit roommate page is identical to the landlord page, except it allows the user to submit information for the roommate listing. PLEASE FILL IN ALL THE INFORMATION.
* The write review page allows the user to write review about the house. PLEASE FILL IN ALL THE INFORMATION.
* The message page displays all the incoming renting request. 
* The admin page is only visible to the admin. In this page, the admin can perform the following operations:
	* Approve/Reject house listing request: Once a landlord submits a houselisting request, their request needs to be approved by the admin in order to make it display on the tenant page. Admin can approve or reject newly submitted request.
	* Cancel house listings: Admins can cancel bad rated house if they want to by clickin the cancel listing button.
	* Approve/Reject roommate listing request: This is identical to the house listing request, except it approves/rejects the roommate request instead of the house listing requests.
	* Cancel roommate listing: This is identical to the cancel house listing operation, except it cancels roommate listing instead of the house listings.
	* Remove Users: Admins can delete user's account by clicking "delete this user".
* The admin can switch between these operation by clicking the expand button on the top right to brings up a side bar, and select operation accordingly.

Our deployed website is on heroku, with the following url:
https://blooming-coast-86189.herokuapp.com/

## (While we updated our final commit we were building our project on heroku simultanerously. However the heroku repo crashed for some reason, and the error message was heroku reached maximum build capacity, or some message close to that. We already got the heroku working, but I think there's some problem with heroku that led us needing to re-build the project. We have the new url as follows: https://lit-escarpment-74065.herokuapp.com/ , and this took us 10 minutes to deploy and build)