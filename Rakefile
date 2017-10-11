require 'active_support/core_ext/string'
require 'fileutils'
require 'sprockets'
require "sprockets-sass"
require 'bundler/setup'

Bundler.require(:default)

# Setup Sprockets
environment = Sprockets::Environment.new
environment.append_path 'vendor/assets/stylesheets'
environment.append_path 'preview'
environment.css_compressor = :scss

desc "Compile page"
task :compile do
  
  File.open('./site/uniform.css', "w") do |file|
    file << environment['uniform.scss']
  end
  
  File.open('./site/preview.css', "w") do |file|
    file << environment['preview.scss']
  end
  
  # Render the test html file
  File.open('./index.html', 'w') do |file|
    file.write(
      render_with_layout("preview/index.html.erb")
    )
  end

  Dir.foreach(File.join('preview')).select{|file| file =~ /\.erb$/}.each do |file_name|
    File.open("./site/#{file_name.gsub('.erb', '')}", 'w') do |file|
      file.write(
        render_with_layout("preview/#{file_name}")
      )
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

def html_block(&block)
  @output << "<pre>"
  @output << CGI::escapeHTML(capture(&block).strip)
  @output << "</pre>"
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
