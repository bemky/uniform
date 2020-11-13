# Change Log

## 3.0
- responsive modifier from `[rule]-[size]` to `[size]:[rule]`
- changed color spectrum from `[color]-dark` to `[color]-80`
- changed size from `small smaller large larger` to `xs sm lg xl`
- changed size from `quarter half` to `1/4 1/2`
- changed `margin` to both vertical and horizontal margin
- changed `text-overflow` to `text-overflow-hidden`
- changed `aspect-[..]` to be on target element, not child of that element

### Added
- `text-3/4`
- `@include responsive-rule('.text-bold') { font-weight: bold; }`
- `@include size-rule('.margin') using $size { margin: $size }`
- `@include color-rule('.border') using $color { border-color: $color }`
- `@include breakpoint('lg'){}`
- `@include pseudo-class-rule()`
- `width-1/2 width-1/4 width-3/4 width-full`
- `.flex .grid .inline-grid .inline-flex`
- `.flex-[shrink|fill|auto|none]`
- `.order-#`
- `.grid-[cols|rows]-#`
- `.col-[span|start|end]-#`
- `.row-[span|start|end]-#`
- `.gap-[v|h]-#`
- `.shadow-[sm|md|lg|xl]`
- `.opacity-[0,10,20...100]`
- `.object-cover` and `.object-contain`
- `.sticky` and `.fixed`
- `.contents` as `display: contents`
- `.group:hover group-hover:bg-blue`
- `rounded-[size]`
- `.space-v-[size]` as space between children
- `.space-h-[size]` as space between children
- `.text-uppercase .text-lowercase .text-capitalize`
- `.text-100 .text-200 ... .text-900`
- `.text-list-[style]`
- `.bg-opacity-[#]`
- `.text-opacity-[#]`
- `.border-opacity-[#]`
- `.divide-[v|h]-[size]`
- `.select-[all|text|none|auto]`
- `.rotate-[0,1,3,180]`
- `.transition-[100-1000]`
- `.transition-[all|border|background...]`
- `.animate-[spin bounce blink ping pulse]`
- `.animate-[200 400 600... 2000]`


### Removed
- remove `text-2_0 text-1_2...`
- `@include position-fill|position-center|position-h-center|position-v-center` in favor of utility classes
- `@include sizes`
- `@include size-rule`
- `@include colors`
- `width-###-p`
- `height-###-vh max-height-###-vh min-height-###-vh`
- `.hover-text-underline`
- `.text-subtle .text-subtle-more`
- `.text-muted .text-muted-less`
- `p.large`
- `blockquote.quote`
- `.grid-[align type]` for `.items-cross-[align type]`
- `.grid-h-[align type]` for `.content-cross-[align type]`
- `.grid-v-[align type]` for `.content-[align type]`
- `.uniformTableDotLeaders`
- `.row` for `.table-row`
- `.cell-[top|middle]` for `.align-[top|middle]`

##2.3.1
- new loader animation and template

##2.3
- new gray spectrum: lightest, lighter, light, gray, dark, darker, darkest

##2.2.2
- changed uniformRow to be less opinionated
- remove uniformRow-body and uniformThumb from uniformRow

##2.2.0
- removed jquery dependency
- changed jquery plugin inclusion, now include jquery plugins by importing uniform-jquery
- moved lib files from vendor/assets to lib/assets


## 2.0
New naming structures. Breaks a lot of class names and variables from 1.x.

### Added
- Breakpoints now default to screen sizes using media queries, but you can also force a breakpoint by wrapping an element with `sm-size`, `md-size`, `lg-size`, `xl-size`
- `uniformThumb`
- `uniformCard-accordion` to uniformCard
- `color('gray-dark')`
- mixin `size-rule`. Make a rule for a specific size breakpoint
- mixin `colors`. Declare selectors with color modification classes on certain attributes
- mixin `sizes`. Declare selectors with color modification classes on certain attributes

### Removed
- `uniformTile` (replaced with `uniformCard-tile`)
- color variables (`$gray`, `$yellow`, `$red-dark`...) changed to `color('gray-dark')`
- `hidden` use `.hide` instead
- `uniformTabs` use `uniformNav` with `border-bottom` instead
- removed `position-fill`
- removed `uniformError` and `uniformErrorMessage` use `data-uniform-error`

### Changed
- `-tiny` to `-quarter`
- `-less` to `-half`
- `-more` to `-2x`
- `-super` to `-4x`
- `pointer` to `cursor-pointer`
- Changed modifier classes to start with component name or dash (ex. `uniformButton green` => `uniformButton -green`)
- Changed default grid .col so that starts with padding, add `.grid-nest` to bring first and last column to edge
- removed `grid.no-wrap`, use `.grid.grid-nowrap`
- changed `grid.no-gutter` to `grid.grid-gutter-none`
- changed `grid.nest` to `grid.grid-nest`
- changed `col.no-gutter` to `.col-gutter-none`
- changed `uniform-loader` to `uniformLoader`
- changed `uniformNav` to `uniformMainNav`
- changed `uniformNavList` to `uniformNav`
- changed mixin `horizontal-center` to `position-h-center`
- changed mixin `align-middle` to `position-center`
- changed mixin `vertical-middle` to `position-v-center`
- changed mixin `apply-media-sizes` to `size-rules`
- changed `uniformForm-table` to `uniformForm -table`
- changed `[data-error-message]` to `[data-uniform-error]`


## 1.0
This is the first really stable and usable release of Uniform. Many of the components were rewritten, removed, and added. In general, this release brings a shift in methodology. Building with Uniform now supplies and relies on more helpers to build things out.

*This will break everything in previous versions.* Many component names went from `title-case` to `camelCase`, and many modifier classes inside of components were removed in favor of using helper classes in html.

### Added
- `uniformAlert`
- `uniformDropdown`
- `uniformSelect`
- `uniformFloatingLabel`
- `uniformModal`
- `uniformTable`
- `uniformTooltip`
- tons of helper classes like `margin`, `pad`, `border-top`...

### Removed
- `bourbon` and `neat` dependencies
- custom sass functions
- `uniform-list`, `uniform-checks`, `uniform-step`, `uniform-icons`

### Changed
- `title-case` to `camelCase` for all compontents
- `inline-input` to `uniformInputGroup`
- `.container` to `.grid` was completely overhauld to use flexbox
- `table-container` to `table`
