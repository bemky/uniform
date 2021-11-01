<p align="center">
    <a href="http://uniform-ui.com/" style="display:block; max-width:400px;">
        <img src="https://raw.githubusercontent.com/bemky/uniform/master/docs-src/assets/images/logo.png" width="400" alt="Uniform UI">
    </a>
    <p align="center">
        A rails gem of sass components and utilities for building a UI.<br>
        <a href="http://uniform-ui.com/">
            Demo and Documentation
        </a>
    </p>
</p>



# Installation

## Manual
Download compiled CSS and JS: http://uniform-ui.com/uniform.zip

Link to css and js in html document:

```html
<link rel="stylesheet" href="/uniform.css" type="text/css" media="screen" charset="utf-8">
<script src="/uniform.js"></script>
```

## Ruby
Add this line to your application's Gemfile:

    gem 'uniform-ui'

Add Uniform assets to asset paths

Example for [Condenser](https://github.com/malomalo/condenser):

    condenser.path = Dir.each_child(UniformUi::ASSET_PATH).map { |a| File.join(UniformUi::ASSET_PATH, a) }


## NPM
    npm install uniform-ui

```javascript
import {Dropdown} as Uniform from 'uniform';

new Uniform.Dropdown({
    el: $('.example')
})
```

### Media Query Combiner
The breakpoint utilities can bloat the library by 30ish%. Use a media query combiner to condense the mean media queries into batches.

For Rails Sprockets: https://github.com/aaronjensen/sass-media_query_combiner
For Rails Condenser: https://github.com/malomalo/condenser
```rails
env.register_postprocessor('text/css', ::Condenser::CSSMediaCombinerProcessor)
```


# Usage

Checkout the [documentation](http://uniform-ui.com)

## Configuration
Define configuration by setting keys of `$uniform_configs` prior to `@import 'uniform';` `$uniform_configs` is deep merged with defaults giving `$uniform_configs` priority. To remove default keys give them value of `false`.

### Example
```scss
$uniform_configs: (
    sizes: (
        padding: (
            "8x": "8rem"
        )
    ),
    colors: (),
    pseudo_classes: (
        "hover": hover,
    ),
    combinators: (
        ">": ">"
    ),
    breakpoints: (
        include_containers: true,
    )
)
@import 'uniform';
```
### Sizes
Size modifiers give a type of utility a size by postfixing to the type with a `-` (ex. `margin-bottom-2x`). Sizes are defined per type.

#### Extending `$uniform_configs.sizes`
| key | defaults | description |
| -- | -- | -- |
| `border` | none, 2px, 3px, 4px | border-width |
| `divide` | none, 2px, 3px, 4px | border-between objects |
| `rounded` | none, xs, sm, lg, xl | border-radius |
| `margin` | none, 1/4x, 1/2x, 3/4x, xs, sm, lg, xl, 2x | space around object |
| `gap` | none, xs, sm, lg, xl | gap in grid |
| `space` | none, xs, sm, lg, xl, 2x, 4x | space between objects |
| `pad` | none, 1/4x, 1/2x, 3/4x, xs, sm, lg, xl, 2x | padding of an object |
| `text` | xs, sm, lg, xl, 2x, 4x, 8x | font-size of text |
| `stroke` | sm, md, lg, 2x, 3x | stroke of svg |

### Colors
Color modifiers build out an entire spectrum of utility classes related to color.

#### Extending `$uniform_configs.colors`
You can configure a color to a color (hex, hsl, rgb...), `false`, or a hash (options below). Setting to a color ignores options for the color (mainly spectrum option). Setting to `false` removes the color (this is helpful to remove a uniform default color).

##### Defaults
<table>
<!-- COLORS --><tr><td colspan=10><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/white.svg" style="inline-block">white</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray.svg" style="inline-block">gray</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-10.svg" style="inline-block">gray-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-20.svg" style="inline-block">gray-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-30.svg" style="inline-block">gray-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-40.svg" style="inline-block">gray-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-50.svg" style="inline-block">gray-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-60.svg" style="inline-block">gray-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-70.svg" style="inline-block">gray-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-80.svg" style="inline-block">gray-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/gray-90.svg" style="inline-block">gray-90</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green.svg" style="inline-block">green</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-10.svg" style="inline-block">green-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-20.svg" style="inline-block">green-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-30.svg" style="inline-block">green-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-40.svg" style="inline-block">green-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-50.svg" style="inline-block">green-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-60.svg" style="inline-block">green-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-70.svg" style="inline-block">green-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-80.svg" style="inline-block">green-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/green-90.svg" style="inline-block">green-90</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue.svg" style="inline-block">blue</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-10.svg" style="inline-block">blue-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-20.svg" style="inline-block">blue-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-30.svg" style="inline-block">blue-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-40.svg" style="inline-block">blue-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-50.svg" style="inline-block">blue-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-60.svg" style="inline-block">blue-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-70.svg" style="inline-block">blue-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-80.svg" style="inline-block">blue-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/blue-90.svg" style="inline-block">blue-90</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red.svg" style="inline-block">red</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-10.svg" style="inline-block">red-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-20.svg" style="inline-block">red-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-30.svg" style="inline-block">red-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-40.svg" style="inline-block">red-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-50.svg" style="inline-block">red-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-60.svg" style="inline-block">red-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-70.svg" style="inline-block">red-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-80.svg" style="inline-block">red-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/red-90.svg" style="inline-block">red-90</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow.svg" style="inline-block">yellow</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-10.svg" style="inline-block">yellow-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-20.svg" style="inline-block">yellow-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-30.svg" style="inline-block">yellow-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-40.svg" style="inline-block">yellow-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-50.svg" style="inline-block">yellow-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-60.svg" style="inline-block">yellow-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-70.svg" style="inline-block">yellow-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-80.svg" style="inline-block">yellow-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/yellow-90.svg" style="inline-block">yellow-90</td></tr><tr><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple.svg" style="inline-block">purple</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-10.svg" style="inline-block">purple-10</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-20.svg" style="inline-block">purple-20</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-30.svg" style="inline-block">purple-30</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-40.svg" style="inline-block">purple-40</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-50.svg" style="inline-block">purple-50</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-60.svg" style="inline-block">purple-60</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-70.svg" style="inline-block">purple-70</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-80.svg" style="inline-block">purple-80</td><td><img src="https://raw.githubusercontent.com/bemky/uniform/master/docs/assets/colors/purple-90.svg" style="inline-block">purple-90</td></tr><!-- COLORS END -->
</table>

#### Options for `$uniform_configs.colors.[color]`
| key | type | description | default |
| -- | -- | -- | -- |
| `spectrum` | Boolean | expand the given color to a spectrum of lightness (10) to darkness (90) (ex. `text-red-30`) | false |
| `color` | Hex, HSL, RGB | color value of key | – |
| `[key]` | Hex, HSL, RGB | any extra key given will create an additional color with the given key as postfix modifier of the key (ex. `red: (light: #E1563E)` will produce `.text-red-light{color: #E1563E}`) | – |

### Combinators
Combinator modifiers give most utility classes the ability to apply a utility to the combinator by postfixing the combinator with `[utility]-[combinator]` (ex. `margin-bottom->`)
**Example**
```scss
$uniform_configs: (
    combinators: (">": ">")
)
```
Generates
```css
.margin-bottom-> > * {
    margin-bottom: 1em;
}
```

### Pseudo Classes
Pseudo class modifiers give most utility classes the ability to scope to the given pseudo class by prefixing a utility with `[pseudo class]:[utility]`. (ex `hover:text-red`).
#### Example
```scss
$uniform_configs: (
    pseudo_classes: (hover: "hover")
)
```
Generates
```css
.hover:text-red {
    color: #E1563E;
}
```

#### Group Hover
There is one predefined pseudo class for `group-hover`. If the key `group-hover` is set then the following will be generated:
```css
.group:hover{
    .group-hover:bg-blue {
        background: #0994E2
    }
}
```

### Breakpoints
Breakpoint modifiers give most utility classes the ability to be responsive by prefixing a utlity with `[breakpoint]:[utility]` (ex. `md:margin-top`), so that that utility is only applied in the given media query.
#### Example
```scss
$uniform_configs: (
    breaking_points: (
        include_containers: true,
        mobile: "max-width: 719px"
    )
)
```
Generates
```css
@media only screen and (min-width: 720px){
    .mobile:margin-top {
        margin-top: 1em;
    }
}
.mobile-container .margin-top {
    margin-top: 1em;
}
```

#### Options for `$uniform_configs.breakpoints`
| key | type | description | default |
| -- | -- | -- | -- |
| `include_containers` | Boolean | toggle including containers for breakpoints like `.md-container > md:margin-top` | false |
| `[key]` | media query | any key given will create a breakpoint with given key as utility name and value as the media query | – |



# Browser Support
| IE / Edge | Firefox | Chrome | Safari|
| --------- | --------- | --------- | --------- |
| IE11, Edge| 52+| 59+| 9+|

# Development

Docs are generated using [Middleman](https://middlemanapp.com/)

To run server

    middleman server

To package:

    middleman build