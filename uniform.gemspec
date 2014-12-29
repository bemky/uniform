# -*- encoding: utf-8 -*-
$:.push File.expand_path("../lib", __FILE__)

Gem::Specification.new do |s|
  s.name        = "uniform"
  s.version     = '1.0'
  s.authors     = ["Ben Ehmke"]
  s.email       = ["ben@42floors.com"]
  s.homepage    = "http://42floors.com"
  s.summary     = %q{42Floors Sass UI Library}
  s.description = %q{A Sass library for UI used at 42floors}

  s.rubyforge_project = "uniform-css"

  s.files         = `git ls-files`.split("\n")
  # s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  # s.executables   = `git ls-files -- bin/*`.split("\n").map{ |f| File.basename(f) }
  s.require_paths = ["lib"]

  # Developoment 
  s.add_development_dependency 'rake'
  s.add_development_dependency 'bundler'

  # Runtime
  s.add_runtime_dependency 'bourbon'
  s.add_runtime_dependency 'neat'
  
end
