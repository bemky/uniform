require 'lib/uniform'
require 'zip'
require 'sass-media_query_combiner'

# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions
set :source, 'docs-src'
set :build_dir, 'docs'

activate :condenser do |config|
  config.path = Dir.each_child(UniformUi::ASSET_PATH).map { |a| File.join(UniformUi::ASSET_PATH, a) }
end


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

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

helpers do
  def html_block(**args, &block)
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
    html = "<pre><code class='#{args[:class]}'>" + CGI::escapeHTML(html.strip)
    html = html + "</code></pre>"
    
    ::ActiveSupport::SafeBuffer.new.safe_concat(html)
  end
  
  def colors
      {
        'background':         '#f2f2f2',
        'gray-lightest':      '#F8FAFC',
        'gray-lighter':       '#F1F5F8',
        'gray-light':         '#DAE1E7',
        'gray':               '#B8C2CC',
        'gray-dark':          '#8795A1',
        'gray-darker':        '#606F7B',
        'gray-darkest':       '#3D4852',
        'gray-background':    'rgb(238, 238, 238)',
        'green':              '#97C848',
        'green-light':        '#BBFF00',
        'green-dark':         '#709239',
        'blue':               '#0994E2',
        'blue-bright':        '#1fa9ff',
        'blue-light':         '#A7CDF2',
        'blue-dark':          '#167DBA',
        'red':                '#E1563E',
        'red-light':          '#E5766C',
        'red-dark':           '#971710',
        'red-bright':         '#ffab9b',
        'yellow':             '#D7E542',
        'yellow-dark':        '#BBC02C',
        'yellow-light':       '#E9F75A',
        'black':              '#000000',
        'white':              '#FFFFFF',
      }
    end
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript
# end

configure :build do
  app.condenser.unregister_writer(nil, nil, 'application/gzip')
  
  Dir.children('./dist').each do |file|
    if File.directory?(file)
      FileUtils.rm_r(File.join('./dist', file))
    elsif !(file =~ /\-\w{64}\..*$/)
      File.delete(File.join('./dist', file))
    end
  end

  # Export to Dist    
  %w(uniform.css uniform.jquery.js uniform.js).each do |asset|
    app.condenser.resolve(asset).each do |asset|
      asset.export.write('dist')
    end
  end
  
  # Rename Dist files to remove sha ... Hack for lack of export_without_digest.. remove when available
  Dir.children('./dist').each do |file|
    next unless file =~ /\-\w{64}\..*$/
    File.rename(File.join('./dist', file), File.join('./dist', file.gsub(/^(.*)\-\w{64}\.(.*)$/, '\1.\2')))
  end

  # Export es5 version to lib
  app.condenser.resolve('uniform.jquery.js').each do |asset|
    asset.export.write('lib/assets/javascripts')
    # Hack for lack of export_without_digest.. remove when available
    File.rename(File.expand_path('./lib/assets/javascripts/uniform.jquery-' + asset.export.hexdigest + '.js'), File.expand_path('./lib/assets/javascripts/uniform.es5.js'))
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
