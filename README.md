# FACEBOOK POST API IMPLEMENTATION

This is a RESTful API that supports the posts functionality of Facebook. In this project, users are authenticated using jwt and facebook's access_token to make requests on facebook graph api.

## Background
In this project, a user registers, receives an email and an jwt accessToken. The user uses this accessToken to make authencated requests to facebook graph apis. I also designed apis to reset a user password. Facebook post apis implemented include: Publish a post, Fetch all Posts on a page, Delete a post, Edit a post, Upload image link, and Comment on a post. 

Once the token has been verified, I place it on a blockchain market place (OpenSea) for others to purchase. 

# Deployment:
First step to deploy project. You will need to:

1. Create .env file and copy variables into it from .env.example

2. Ensure all varibles are defined include facebook variables

3. To get SENDGRID_KEY, signup on https://sendgrid.com/free?source=sendgrid-nodejs and get the api keys

4. To set FB_ACCESS_TOKEN and FB_PAGE_ID, login to your developer account on facebook developers.facebook.com, create an app you'll be using for this test.
  On the navigation menu > Tools > click on Graphql API Explorer
  Select the created app, and add the following permissions:
    - pages_show_list
    - publish_to_groups
    - groups_access_member_info
    - page_events
    - pages_read_engagement
    - pages_manage_metadata
    - pages_read_user_content
    - pages_manage_posts
    - pages_manage_engagement
  Click on "Generate Access Token" and authenticate these access
  Following this, create a user page where these post request would be made
  Copy the generated access_token and the page_id (Found at the bottom part of the the abouts us page);

# Steps to start the app
cd into root folder, `cd facebook-api-posts`
install packages using command `npm i`
start application using command `npm run start`

# Steps and commands to run the tests.
cd into root folder, `cd facebook-api-posts`
run test using command `npm test` to run all tests

