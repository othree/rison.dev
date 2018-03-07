all: scripts/rison.js scripts/app.js

scripts/rison.js: vendor/scripts/rison.js
	rollup -c rollup.config.js -f iife -o scripts/rison.js vendor/scripts/rison.js

scripts/app.js: src/scripts/app.js
	rollup -c rollup.config.js -f iife -o scripts/app.js src/scripts/app.js
