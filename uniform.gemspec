# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)

Gem::Specification.new do |s|
  s.name        = "uniform-ui"
  s.version     = '0.5'
  s.authors     = ["Ben Ehmke"]
  s.email       = ["benehmke@gmail.com"]
  s.homepage    = "http://bemky.github.io/uniform/"
  s.summary     = %q{Sass UI}
  s.description = %q{Sass compenents and defaults for building a UI that's on fleak.}
  s.license     = "MIT"

  s.required_ruby_version = ">= 1.9.3"
  s.required_rubygems_version = ">= 1.3.6"

  # Developoment 
  s.add_development_dependency 'rake'
  s.add_development_dependency 'bundler'

  # Runtime
  s.add_dependency 'bourbon'
  s.add_dependency 'neat'
  
  s.files        = `git ls-files`.split("\n")
  s.require_path = 'lib'
end
