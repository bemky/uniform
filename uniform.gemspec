require File.expand_path("../lib/uniform/version", __FILE__)

Gem::Specification.new do |s|
  s.name        = "uniform-ui"
  s.version     = Uniform::VERSION
  s.authors     = ["Ben Ehmke"]
  s.email       = ["benehmke@gmail.com"]
  s.homepage    = "http://bemky.github.io/uniform/"
  s.summary     = %q{Sass UI}
  s.description = %q{Sass components and helpers for building a UI.}
  s.license     = "MIT"

  s.required_ruby_version = ">= 2.5.0"

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  s.add_runtime_dependency 'sass'

  s.add_development_dependency 'rake'
  s.add_development_dependency 'activesupport'
  s.add_development_dependency 'rubyzip'
  s.add_development_dependency 'media_query_combiner'
end
