ALL_CSS_FILES = $(wildcard src/styles/modules/*.css)


all: scripts/rison.js scripts/app.js styles/app.css

scripts/rison.js: vendor/scripts/rison.js
	rollup -c rollup.config.js -f iife -o $@ $<

scripts/app.js: src/scripts/app.js
	rollup -c rollup.config.js -f iife -o $@ $<

styles/app.css: src/styles/app.css $(ALL_CSS_FILES)
	postcss $< -o styles/app.css
