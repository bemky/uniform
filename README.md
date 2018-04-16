<p align="center">
    <a href="http://uniform-ui.com/" style="display:block; max-width:400px;">
        <img src="https://raw.githubusercontent.com/bemky/uniform/master/docs-src/assets/images/logo.png" width="400" alt="Uniform UI">
    </a>
    <p align="center">
        A rails gem of sass components and helpers for building a UI.<br>
        <a href="http://uniform-ui.com/">
            Demo and Documentation
        </a>
    </p>
</p>



## Installation

Requires JQuery be available in the global namespace.

### Manual
Download compiled CSS and JS: http://uniform-ui.com/uniform.zip

Link to css and js in html document:

```html
<link rel="stylesheet" href="/uniform.css" type="text/css" media="screen" charset="utf-8">
<script src="/uniform.js"></script>
```

### Rails
Add this line to your application's Gemfile:

    gem 'uniform-ui'

Include the css library in your asset pipeline.

```scss
@import 'uniform';
```

Include the javascript library in your asset pipeline.
```javascript
//= require uniform
````

##### Sass Media Query Combiner
The utility classes produce quite a bit of media queries which can bloat the library by 15ish%... use https://github.com/aaronjensen/sass-media_query_combiner to combine media queries together.


### Node Module
    npm install uniform-ui

```javascript
import * as Uniform from 'uniform';
// or
import {Modal, Dropdown} as Uniform from 'uniform';

new Uniform.Dropdown({
    el: $('.example')
})
```

Import jquery plugins to enable automatic usage.

```javascript
import {Plugins} as Uniform from 'uniform';

$('.exampleDropdown').uniformDropdown();
```
 

## Usage

Checkout the [documentation](http://uniform-ui.com)

## Browser Support
| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari|
| --------- | --------- | --------- | --------- |
| IE11, Edge| 52+| 59+| 9+|

## Development

To compile preview:

    rake compile:preview

To package:

    rake compile:package


#### TODO
- Js for Collapse/Expand/Accordion
- Organize helpers page
- Add docs about breakpoints and media queries
- Add docs for sizes and colors mixins
- docs on including scss in node module
- UniformMainNav for mobile