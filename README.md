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

1. Install Geomit. 

2. Add the pre-commit hook to any repository you want to add a `contributors.geojson` file *(must be a Github repository)*. Just open your `.git/hooks` forlder, replace `pre-commit.sample` for `pre-commit` and update the `pre-commit` file with the following content.

```
#!/usr/bin/env ruby
require 'socket'

=begin
Current workflow...
Geomit opens (TCP Server loads)
Pre-commit hook triggers
Pre-commit opens CWD/contributors.geojson
  if something
    Pre-commit hook sends CWD/contributors.geojson and hangs
    Geomit answers with the updated contributors.geojson
    Pre-commit hook writes the updated contributors.geojson
  else
    Geomit answers with the new contributors.geojson
    Pre-commit hook writes the new contributors.geojson
=end

# Configurable
host = 'localhost'
port = 8888

# Constants
FNAME = '/contributors.geojson'
SIZE = 1024 * 1024 * 10
CONTRIBUTORS = Dir.pwd + FNAME

# Init...
puts "Connecting to Geomit..."
s = TCPSocket.new host, port
sleep 1 

getRepoNameCommand = "basename `git rev-parse --show-toplevel`"
getUsernameCommand = "git ls-remote --get-url"
getPrevSHACommand = "git rev-parse --verify HEAD"

# Communication Test
repourl = `#{getUsernameCommand}`
username = /git@github.com:(\w*)\/.*/.match(repourl)[1]

reponame = `#{getRepoNameCommand}`
sha = `#{getPrevSHACommand}`

s.send "Greetings from "+username+", repo "+reponame, 0

# Retrieving 
puts "Retrieving contributors.geojson"
if File.file?(CONTRIBUTORS)
  puts "Found. Sending to Geomit"
  s.send '{"receive": "true", "username": "'+username+'", "sha": "'+sha.chomp+'"}', 0
  sleep 1
  File.open(Dir.pwd + FNAME, 'rb') do |file|
    while chunk = file.read(SIZE)
      s.write(chunk)
    end
  end
else
  puts "Not found. Creating contributos.geojson"
  s.send '{"create": "true", "username": "'+username+'", "sha": "'+sha.chomp+'"}', 0
end

geojson = s.recv(SIZE)

puts "Updating contributors.geojson"
unless geojson.nil?
  File.open(CONTRIBUTORS, 'w') do |file| 
    file.write(geojson)
  end
end

puts "Completed updating contributors.geojson"
gitAddContributors = "git add contributors.geojson"

`#{gitAddContributors}`
```

3. Launch Geomit, which will prompt then a welcome message and a listening port display.

4. Continue working as you would normally, ignoring Geomit. Every time you perform a commit, Geomit will retrieve your location, see if there's a `contributors.geojson` file already and add yours, or create a new one if there's none.

## Security

Anyone (or anything) listening to Geomit's TCP port can retrieve the communication between Geomit and the Pre-commit hook, thus, obtaining your location. Although a security protocol was considered in order to hinder this problem, your shouldn't be sharing your location in a Github repository to begin with if security it's a main concern for you.  

## Limitations

Currently Geomit relies heavily in your OSX and Ruby to get your github username, your contributors.geojson file (if any) and other data. For the moment, it only works with a github domain (it's not too hard to update the regex that parses this, but wasn't a priority, as the maps are only parsed by Github)

Geomit requires the usage of Ruby for connecting to TCP as part of a Pre-commit hook. Future releases might include other languages version.

Since it's a Chrome Extension, it also requires Google Chrome. However, being a [packaged app](http://developer.chrome.com/apps/about_apps.html), its limitations are not as bad as the ones from a Chrome Extension such as needing Google Chrome open. As long as Geomit is open, it can perform all the required actions to retrieve your location.

## Roadamp

### Version 0.1.3

[01.08.2013] Fixed some errors on launch trying to look for an old dependency

### Next features

* Adding multiple languages support (python, nodejs, shell)
* Adding more information to the Geojson maps.