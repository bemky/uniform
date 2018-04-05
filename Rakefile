require 'condenser'
require 'sass-media_query_combiner'
require 'fileutils'

module Helpers
  
  def asset_path(path, options = {})
    "/assets/#{@environment.find_export(path).path}"
  end
  
  def capture
    old_output = @output_buffer
    @output_buffer = ""
    yield
  ensure
    @output_buffer = old_output
  end

  def html_block(**options, &block)
    html = capture(&block)
    spaces = html.match(/^ +/)
    if spaces
      spaces = spaces[0]
      count = spaces.scan(/ /).count
      html = html.gsub(/^ {#{count}}/, "")
    end
    @output_buffer << "<pre><code class='#{options[:class]}'>"
    @output_buffer << CGI::escapeHTML(html.strip)
    @output_buffer << "</code></pre>"
  end

  def colors
    {
      'background':         '#f2f2f2',
      'gray':               '#505153',
      'gray-light':         '#cccccc',
      'gray-dark':          '#373839',
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
      'muted':              '#cccccc'
    }
  end
end


method_source = <<-RUBY
  def layout(locals={})
    locals.each do |k, v|
      if k.to_s =~ /\A[a-z_][a-zA-Z_0-9]*\z/
        local_variable_set(k, v)
      else
        raise "invalid locals key: \#{k.inspect} (keys must be variable names)"
      end
    end

    context = $environment.context_class.new($environment)
    p = proc { #{::Erubi::Engine.new(File.read('docs/src/layout.html.erb')).src } }
    context.instance_eval(&p)
  end
RUBY

eval(method_source)

# task :setup do
$environment = Condenser.new('./vendor/assets')
Dir.children('./vendor/assets/').each do |path|
  $environment.append_path path
end
$environment.append_path File.expand_path('./docs/src/')
Dir.children('./docs/src/assets/').each do |path|
  $environment.append_path File.expand_path(File.join('./docs/src/assets/',path))
end

$environment.append_path File.expand_path('./node_modules/')

$environment.writers.each do |mime_type, value|
  value.delete_if { |v| v[0].is_a?(Condenser::ZlibWriter) }
end

$environment.context_class.class_eval do
  include Helpers
end
$environment.cache = Condenser::Cache::MemoryStore.new

namespace :compile do
  
  task :default => [:preview, :package]
  
  task :preview do

    # manifest = Condenser::Manifest.new(environment, './site')
    # manifest.compile(%w(uniform.css uniform.js preview.css))

    %w(uniform.css uniform.js preview.css preview.js *.png).each do |asset|
      $environment.resolve(asset).each do |asset|
        FileUtils.mkdir_p(File.dirname(File.join('docs', asset.path)))
        asset.export.write('docs/assets')
      end
    end
    
    Dir.glob('docs/src/**/*').each do |filename|
      next if File.directory?(filename)
      next if filename =~ /^docs\/src\/assets\/[^\/]+\//
      next if filename == 'docs/src/layout.html.erb'
      filename.delete_prefix!('docs/src/')
      
      FileUtils.mkdir_p(File.dirname(File.join('docs', filename)))
      if filename.end_with?('.erb')
        filename.delete_suffix!('.erb')
        current_page = filename.split('.')[0]

        File.write(File.join('docs', filename), layout { $environment.find_export(filename).source })
      else
        File.write(File.join('docs', filename), $environment.find_export(filename).source)
      end
    end
  end
  
  task :package => :preview do
  end
  
end
__END__





require 'active_support/core_ext/string'
require 'fileutils'
require 'zip'

# environment.css_compressor = :scss

desc "Compile page"
task :compile do

  File.delete("./uniform.zip")
  Zip::File.open("./uniform.zip", Zip::File::CREATE) do |zipFile|
      FileList['./site/assets/javascripts/uniform.js', './site/assets/stylesheets/uniform.css'].each do |filename|
          zipFile.add(filename.split('/').last, filename)
      end
  end

end