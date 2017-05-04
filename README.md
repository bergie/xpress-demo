NoFlo Express demo app
======================

[![Greenkeeper badge](https://badges.greenkeeper.io/bergie/xpress-demo.svg)](https://greenkeeper.io/)

Simple demo app, originally made for [the Berlin Node.js meetup](https://www.meetup.com/Node-js-Meetup-Berlin/events/238051786/).

Showcases [noflo-xpress](https://github.com/noflo/noflo-xpress) resourceful routing together with concepts like:

* Express-wide middleware (body parser)
* Route-specific middleware (JSON schema validator)
* Passing work to regular NoFlo components and handling results of that

## Installation

* Clone this repository
* `npm install` to grab the dependencies
* Prepare the SQLite database with `./node_modules/.bin/knex migrate:latest`

## Running

Start the server with:

```bash
$ ./node_modules/.bin/noflo-nodejs --register=false --graph graphs/main.json --secret=<some secret>
```

The runtime will provide an address for opening the application in [Flowhub's](https://flowhub.io/) live mode. By opening that address in your browser you can see the running software and make modifications to the graph while it is running.
