if defined?(::Rails)
  class UniformUi
    class Engine < ::Rails::Engine

      if Sprockets::VERSION.start_with?('4')
        Engine.config.assets.precompile += %w(uniform/manifest.js)
      end
      
    end
  end
else
  module UniformUi
    ASSET_PATH = File.expand_path("../lib/assets", __dir__)
  end
end