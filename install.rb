require 'fileutils'

public_dir = File.join RAILS_ROOT, 'public'
plugin_dir = File.dirname(__FILE__)

FileUtils.cp_r File.join(plugin_dir, 'javascripts', 'markdown_editor'), File.join(public_dir, 'javascripts')
FileUtils.cp File.join(plugin_dir, 'stylesheets', 'markdown_editor.css'), File.join(public_dir, 'stylesheets')
FileUtils.cp_r File.join(plugin_dir, 'images', 'markdown_editor'), File.join(public_dir, 'images')
