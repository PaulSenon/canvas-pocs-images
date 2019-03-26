# Few PoC about canvas and images.
Some PoC about image color replacement and other realtime video stuff.
It's ruff, and not really optimized. Just a playground.

# Requirements
node (>=v8) installed on your computer

# Installation
`npm install`

# Usage
`npm start`=> it will run a local server

then, there is 3 PoCs :

* http://localhost (basic image color replacement with fixed lorerance)
* http://localhost/cam/ (chromakey on webcam input, with tolerance slider)
* http://localhost/tracking/ (the same as cam, but with (one) face tracking (to start, click somewhere on the picture to select the chromakey))

