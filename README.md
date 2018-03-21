![Uniform](https://raw.githubusercontent.com/bemky/uniform/master/site/assets/images/logo.png)

A rails gem of sass components and helpers for building a UI.

Demo and Documentation: http://uniform-ui.com

## Installation

Add this line to your application's Gemfile:

    gem 'uniform-ui'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install uniform-ui

Include the css library in your asset pipeline.

```scss
@import 'uniform';
```

Include the javascript library in your asset pipeline.
```javascript
//= require uniform
````

The utility classes produce quite a bit of media queries which can bloat the library by 15ish%... use https://github.com/aaronjensen/sass-media_query_combiner to combine media queries together.

## Usage

Checkout the [documentation](http://uniform-ui.com)

## Development

To compile preview:

    rake compile
    
#### TODO
- Js for Collapse/Expand/Accordion
- Organize helpers page
- Clean up form page and form options
- Add docs about breakpoints and media queries
- Add docs for sizes and colors mixins