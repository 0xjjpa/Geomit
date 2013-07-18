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