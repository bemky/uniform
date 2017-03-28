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
    file.write(ERB.new(File.read('preview/index.html.erb')).result(binding))
  end
  
end

desc "Compile preview"
task :preview do
  
  File.open('./site/site/uniform.css', "w") do |file|
    file << environment['uniform.scss']
  end
  
  File.open('./site/site/preview.css', "w") do |file|
    file << environment['preview.scss']
  end
  
  # Render the test html file
  File.open('./site/index.html', 'w') do |file|
    file.write(ERB.new(File.read('preview/index.html.erb')).result(binding))
  end
  
end

class UrlGenerator < Sprockets::DirectiveProcessor
  protected
    def process_source
      @result << @pathname.to_s << "\n" unless @has_written_body
    end
end
