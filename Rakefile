require 'fileutils'
require 'sprockets'
require "sprockets-sass"
require 'bundler/setup'

Bundler.require(:default)

# Setup Sprockets
environment = Sprockets::Environment.new
environment.append_path 'lib'
environment.append_path 'preview'
environment.css_compressor = :scss

desc "Compile preview"
task :compile do
  FileUtils.rm_f('./uniform.css')

  File.open('./preview/uniform.css', "w") do |file|
    file << environment['uniform.css.scss']
  end
  
  File.open('./preview/preview.css', "w") do |file|
    file << environment['preview.css.scss']
  end
  
  # Render the test html file
  File.open('./index.html', 'w') do |file|
    file.write(ERB.new(File.read('preview/index.html.erb')).result(binding))
  end
  
end

class UrlGenerator < Sprockets::DirectiveProcessor
  protected
    def process_source
      @result << @pathname.to_s << "\n" unless @has_written_body
    end
end
