require 'active_support/core_ext/string'
require 'fileutils'
require 'sprockets'
require "sprockets-sass"
require 'sass-media_query_combiner'
require 'bundler/setup'
require 'zip'

Bundler.require(:default)

# Setup Sprockets
environment = Sprockets::Environment.new
environment.append_path 'vendor/assets/stylesheets'
environment.append_path 'vendor/assets/javascripts'
environment.append_path 'preview'
environment.css_compressor = :scss

desc "Compile page"
task :compile do
  
  File.open('./site/assets/stylesheets/uniform.css', "w") do |file|
    file << environment['uniform.scss']
  end
  
  File.open('./site/assets/stylesheets/preview.css', "w") do |file|
    file << environment['preview.scss']
  end
  
  File.open('./site/assets/javascripts/uniform.js', "w") do |file|
    file << environment['uniform.js']
  end
  
  # Render the test html file
  File.open('./index.html', 'w') do |file|
    file.write(
      render_with_layout("preview/index.html.erb")
    )
  end

  Dir.foreach(File.join('preview')).select{|file| file =~ /\.erb$/}.each do |file_name|
    File.open("./site/#{file_name.gsub('.erb', '')}", 'w') do |file|
      @current_page = file_name.split('.')[0]
      @colors = {
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
      file.write(
        render_with_layout("preview/#{file_name}")
      )
    end
  end
  
  File.delete("./uniform.zip")
  Zip::File.open("./uniform.zip", Zip::File::CREATE) do |zipFile|
      FileList['./site/assets/javascripts/uniform.js', './site/assets/stylesheets/uniform.css'].each do |filename|
          zipFile.add(filename.split('/').last, filename)
      end
  end  
  
end

def capture
  old_output = @output
  @output = ""
  yield
ensure
  @output = old_output
end

def html_block(**options, &block)
  html = capture(&block)
  spaces = html.match(/^ +/)
  if spaces
    spaces = spaces[0]
    count = spaces.scan(/ /).count
    html = html.gsub(/^ {#{count}}/, "")
  end
  @output << "<pre><code class='#{options[:class]}'>"
  @output << CGI::escapeHTML(html.strip)
  @output << "</code></pre>"
end

def render_with_layout(template_path, context = self)
  template = File.read(template_path)
  layout = File.read('preview/layout.html.erb')
  [template, layout].inject(nil) do |prev, temp|
    render(temp){prev}
  end
end

def render(template)
  ERB.new(template, nil, nil, "@output").result( binding )
end

class UrlGenerator < Sprockets::DirectiveProcessor
  protected
    def process_source
      @result << @pathname.to_s << "\n" unless @has_written_body
    end
end
