![cover](https://raw.github.com/jjperezaguinaga/Geomit/master/assets/cover.png)

# Geomit

A chrome app that attaches your location in your next git commit. Through [Git Hooks](http://git-scm.com/book/en/Customizing-Git-Git-Hooks), [HTML5 Geolocation](http://www.html5rocks.com/en/tutorials/geolocation/trip_meter/) and the [Networks Communcation API](http://developer.chrome.com/apps/app_network.html), Geomit can create [Geojson](https://help.github.com/articles/mapping-geojson-files-on-github) files to be displayed in your Github repositories.

Your location and of any of your contributors who uses Geomit will be attached in a `contributors.geojson` file in the base of your repository, allowing you to import the rendered map to any webpage through Github's map system.

E.g.
<iframe class="render-viewer" src="https://render.github.com/view/geojson/?url=https%3A%2F%2Fraw.github.com%2Fbenbalter%2Fdc-wifi-social%2Fmaster%2Fbars.geojson" sandbox="allow-scripts allow-same-origin">Viewer requires iframe.</iframe>

## Why?

After [Github's release](https://help.github.com/articles/mapping-geojson-files-on-github) on mapping geoJSON files, anyone can create a `.geojson` file and upload it to their Repositories in order to display a nice map about specific information. However, generating this geojson files is not an easy task, thus Geomit.

Also, many open source projects had been crafted with the love of many developers around the globe. I find the possibility of showing a map at the end of every repository under "Contributors" as a token of gratitude to all developers around the globe.