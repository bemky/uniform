# Change Log

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
