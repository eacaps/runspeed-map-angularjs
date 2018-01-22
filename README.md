# runspeed-map-angularjs
I made this to brush up on starting a project from scratch. I liked interface Garmin already has for displaying all my GPS running data but I decided it would be a fun experiment to see if I could do a slightly different take on the data.

To challenge myself I also decided to try to implement the basic scale component using various frameworks. This is the AngularJS version, you can see the React version here: https://github.com/eacaps/runspeed-map-angularjs.

## running
Running this app requires git and a relatively recent version of node and npm.

    $ git clone git@github.com:eacaps/runspeed-map-angularjs.git
    $ cd runspeed-map-angularjs
    $ npm install
    $ npm start

This will start the app at http://localhost:3000/.

## dev
    $ npm run dev
Dev mode for this runs webpack watch. Since there's no fancy JS transpiling going on, webpack is the way to go.

## testing
jasmine and however you test angularjs will be incorporated soon :(

## next
I actually dove straight into this before looking at the tcx file format. I just grabbed the first thing that came up for tcx - https://github.com/mapbox/tcx and used that as my parser. As it turns out, I actually lose some data fidelity using that parser so the next thing on my list of TODOs is re-writing the tcx parsing and segment creation to use: https://www.npmjs.com/package/tcx-js.

If you have another other sample data from other platforms you'd like included just hit me up with an issue or a pull request.
