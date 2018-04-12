if defined?(::Rails)
  class UniformUi
    class Engine < ::Rails::Engine

      if Sprockets::VERSION.start_with?('4')
        Engine.config.assets.precompile += %w(uniform/manifest.js)
      else
        Engine.config.assets.precompile << /\.(?:svg)\z/
      end
      
    end
  end
end