require 'lib/uniform'
require 'zip'
require 'sassc-media_query_combiner'

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions
set :source, 'docs-src'
set :build_dir, 'docs'

activate :condenser do |config|
  config.path = Dir.each_child(UniformUi::ASSET_PATH).map { |a| File.join(UniformUi::ASSET_PATH, a) }
end
app.condenser.unregister_preprocessor('application/javascript')
app.condenser.register_preprocessor('application/javascript', ::Condenser::JSAnalyzer)
app.condenser.register_preprocessor('application/javascript', ::Condenser::BabelProcessor.new(File.expand_path('./'),  {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-export-default-from',
    ["@babel/plugin-transform-runtime", { corejs: 3, useESModules: true }]
  ],
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: { browsers: '> 1% and not dead' }
    }]
  ]
}))
app.condenser.unregister_minifier('application/javascript')

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

helpers do
  def capture_html(**args, &block)
    html = if handler = auto_find_proper_handler(&block)
      handler.capture_from_template(**args, &block)
    else
      yield(**args)
    end
    
    spaces = html.match(/^ +/)
    if spaces
      spaces = spaces[0]
      count = spaces.scan(/ /).count
      html = html.gsub(/^ {#{count}}/, "")
    end
    html = html.strip
    
    ::ActiveSupport::SafeBuffer.new.safe_concat(html)
  end
  alias html_block capture_html
  
  def code(language=nil, options={}, &block)
    raise 'The code helper requires a block to be provided.' unless block_given?
    @_out_buf, _buf_was = "", @_out_buf
    
    begin
      content = capture_html(&block)
    ensure
      # Reset stored buffer
      @_out_buf = _buf_was
    end
    
    content = content.encode(Encoding::UTF_8)
    concat_content Middleman::Syntax::Highlighter.highlight(content, language, options).html_safe
  end
  
  def colors
    %w(gray green blue red yellow)
  end
  
  def css_rules(file='uniform.css')
    @parsers = {} unless @parsers
    if !@parsers[file]
      @parsers[file] = {
        printed_selectors: [],
        parser: CssParser::Parser.new
      }
      @parsers[file][:parser].load_string!(app.condenser.find(file).to_s)
    end
    @parsers[file]
  end
  
  def css_rule(rule, file='uniform.css')
    @parsers = {} unless @parsers
    if !@parsers[file]
      @parsers[file] = parser = CssParser::Parser.new
      @parsers[file].load_string!(app.condenser.find(file).to_s)
    end
    css_rules(file).find_by_selector(rule)
  end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end

configure :build do
  app.condenser.unregister_writer('application/gzip')
  # Can't purge because it messes up templates ability to read css
  # app.condenser.register_postprocessor('text/css', ::Condenser::PurgeCSSProcessor.new(app.condenser.npm_path, {
  #   content: [File.expand_path('./docs/**/*.html'), File.expand_path('./docs-src/assets/javascripts/**/*.js')],
  #   safelist: ["/hljs*/", "/.*code.*/"]
  # }))
  
  # Clear Dist
  Dir.children('./dist').each do |file|
    if File.directory?(file)
      FileUtils.rm_r(File.join('./dist', file))
    elsif !(file =~ /\-\w{64}\..*$/)
      File.delete(File.join('./dist', file))
    end
  end

  # Export to Dist    
  %w(uniform.css uniform.js).each do |asset|
    app.condenser.resolve(asset).each do |asset|
      asset.export.write('dist')
    end
  end
  
  # Rename Dist files to remove sha ... Hack for lack of export_without_digest.. remove when available
  Dir.children('./dist').each do |file|
    next unless file =~ /\-\w{64}\..*$/
    File.rename(File.join('./dist', file), File.join('./dist', file.gsub(/^(.*)\-\w{64}\.(.*)$/, '\1.\2')))
  end

  # Build Zip File
  File.delete("./docs-src/uniform.zip") if File.exists?("./docs-src/uniform.zip")
  files = Dir.children('./dist')
  Zip::File.open("./docs-src/uniform.zip", Zip::File::CREATE) do |zipFile|
    files.each do |file|
      zipFile.add(file, File.expand_path(File.join('./dist/', file)))
    end
  end
  
end

activate :directory_indexes
