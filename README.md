Katana Gulp Config
==================

v.2

HTML + SCSS (SASS) + ES2019 (babel)

Optimized to work with BEM methodology
Use it with any recommended file structure (https://bem.info/methodology/filestructure/)
Added typography and color variables, inspired by http://guides.kontur.ru

Some Plugins used in this gulp
==================

- gulp-rigger
And you can use //= to include file to your jade, stylus, cs, etc... files:
```html
//= header.html
```

- gulp-autoprefixer
Don't care about browser compability

- gulp-imagemin and imagemin-pngquant
To compress your images

- gulp-manifest
To use your gulp offline when you're in a train or in a aircraft, etc...
(Use `gulp manifest` to create offline version)

More info: see package.json and gulpfile.js files

Also you can use variables, mixins and extends from `src/blocks/global/variables.scss` (examples included)

For beautiful front-end development!


Installation
==================
Please clone this repo to your project's folder and run:

```shell
bower install
npm install
```

to install dependences

Quick Start
==================
Use src folder to work with your project

To start gulp just run:
```shell
gulp
```

To clean /build folder:
```shell
gulp clean
```

To create offline version:
```shell
gulp manifest
```


Please enjoy your coding proccess, your life and be at the present moment! Yay!