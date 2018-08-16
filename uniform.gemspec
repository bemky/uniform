lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'uniform/version'

Gem::Specification.new do |s|
  s.name        = "uniform-ui"
  s.version     = Uniform::VERSION
  s.authors     = ["Ben Ehmke"]
  s.email       = ["benehmke@gmail.com"]
  s.homepage    = "http://bemky.github.io/uniform/"
  s.summary     = %q{Sass UI}
  s.description = %q{Sass components and helpers for building a UI.}
  s.license     = "MIT"

  s.files         = Dir["lib/**/*"].select { |fn| File.file?(fn) }
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }

  s.add_runtime_dependency 'sass'

  s.add_development_dependency 'rubyzip'
  s.add_development_dependency 'sass-media_query_combiner'
end
