![cover](https://raw.github.com/jjperezaguinaga/Geomit/master/assets/cover.png)

# Geomit

A chrome app that attaches your location every `git commit` to a contributors.geojson file. 

Through [Git Hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks), [HTML5 Geolocation](http://www.html5rocks.com/en/tutorials/geolocation/trip_meter/) and the [Networks Communcation API](http://developer.chrome.com/apps/app_network.html), Geomit can create [Geojson](https://help.github.com/articles/mapping-geojson-files-on-github) files to be displayed in your Github repositories.

Your location and of any of your contributors who uses Geomit will be attached in a `contributors.geojson` file in the base of your repository, allowing you to import the rendered map to any webpage through Github's map system.

E.g. Adding this line to a webpage shows the rendered map for this .geojson
```
  <script src="https://embed.github.com/view/geojson/benbalter/dc-wifi-social/master/bars.geojson"></script>
```

## Why?

After [Github's release](https://help.github.com/articles/mapping-geojson-files-on-github) on mapping geoJSON files, anyone can create a `.geojson` file and upload it to their Repositories in order to display a nice map about specific information.

Since many open source projects had been crafted with the love of many developers around the globe, I find the possibility of showing a map at the end of every repository under "Contributors" as a token of gratitude to all developers around the globe.

Through Geomit, this file named as `contributors.geojson` can be easily attached to every repository and then imported to the project Github Pages, showcasing how many developers had been involved in a project and from which part of the globe.

## How?

Geomit opens a TCP port through Google Chrome and the Networks Communication API. This port is listening to your localhost all the time. A git pre-hook requests Geomit for your location, retrieved through the Geolocation API from Chrome (if one can be obtained). The location is then retrieve and parsed together with a prevevious `contributors.geojson` in the repository, or if none, a new one is created. The process ends with the pre-commit adding the `contributors.geojson` file to your repository.

## Instructions

1. After installing Geomit, you then need to add the Ruby pre-commit hook to any repository you want to add a `contributors.geojson` file.

2. Launch Geomit, which will prompt then a welcome message and a listening port display.

3. Continue working as you would normally, ignoring Geomit. Every time you perform a commit, Geomit will retrieve your location, see if there's a `contributors.geojson` file already and add yours, or create a new one if there's none.

## Limitations

Geomit requires the usage of Ruby for connecting to TCP as part of a Pre-commit hook. Future releases might include other languages version.

Since it's a Chrome Extension, it also requires Google Chrome. However, being a [packaged app](http://developer.chrome.com/apps/about_apps.html), its limitations are not as bad as the ones from a Chrome Extension such as needing Google Chrome open. As long as Geomit is open, it can perform all the required actions to retrieve your location.

## Roadamp

* Adding multiple languages support (python, nodejs, shell)
* Adding more information to the Geojson maps.