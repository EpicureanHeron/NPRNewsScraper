# NPR News Scraper

## [Deployed on Heroku](https://nprscraper-jft.herokuapp.com/)

## Overview

NPR News Scraper is a web app that lets users view and leave comments on the latest news. Articles are scraped using the Cheerio library to scrape [NPR news](https://www.npr.org/sections/news/) and then populates a Mongo database. 

## Tech used

* Express: Handles all server requests.

* Express-handlebars: Renders database results on the frontend.

* Mongoose: Structures models for the Mongo DB backend.

* Body-parser: Parsers requests in concert with the express server.

* Cheerio: Scrapes data from the source, in this case, NPR News. 

* Request: Initiates getting from the news site.

* Morgan: Logging tool.

## Deployed on Heroku

The fullstack is on Heroku including the Mongo database hosted through mongolab (aka mLab MongoDB). 

## Guide to Run Locally

* Download Repo

* Run `npm install`

* Set up Mongo DB called `NPR`

* Start Mongo DB and then run `npm start`



