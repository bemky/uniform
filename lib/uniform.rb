if defined?(::Rails)
  class UniformUi
    class Engine < ::Rails::Engine
      
      if defined?(::Sprockets)
        if Sprockets::VERSION.start_with?('4')
          Engine.config.assets.precompile << 'uniform/manifest.js'
        end
      elsif defined?(::Condenser)
        assets_dir = File.expand_path("../lib/assets", __dir__)
        Dir.each_child(assets_dir) do |child|
          child = File.join(assets_dir, child)
          Engine.config.assets.path << child if File.directory?(child)
        end
      end
      
    end
  end
else
  module UniformUi
    ASSET_PATH = File.expand_path("../lib/assets", __dir__)
  end
end