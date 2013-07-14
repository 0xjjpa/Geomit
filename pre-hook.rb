#!/usr/bin/env ruby
require 'socket'

host = 'localhost'
port = 8888

FNAME = 'contributors.geojson'
client = TCPSocket.new host, port

=begin
### Findings about pre-hooks
1. Ruby env will close the socket (even before anything goes to the Chrome App TCP server) asap as the pre-hook is done
2. Use either loops or sleep to avoid 1.
3. Sending the file through the network takes time and it's hard to parse.
4. Use fileSystemAPI from Chrome Extension to avoid this and read the file
5. File to RW is something like Dir.pwd + FNAME
6. The current TCP server is limited in the amount of connections (15 now, set by a var), review this.

#sleep 1
#data = IO.read(FNAME)
#client.print data
#client.send(Dir.pwd, 0)
#sleep 5
#client.close

Current workflow...
Geomit opens (TCP Server loads)
Pre-commit hook triggers
Pre-commit hook sends CWD/contributors.geojson and hangs
Geomit opens CWD/contributors.geojson
  if something
    parse file as json
  else
    add new geocontributors file
  add my location
Geomit sends AWK to Pre-commit
Pre-commit closes connection
Pre-commit exec git add contributors.geojson
=end