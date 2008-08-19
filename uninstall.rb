require 'fileutils'

public_dir = File.join RAILS_ROOT, 'public'

FileUtils.rm_r File.join(public_dir, 'javascripts', 'markdown_editor')
FileUtils.rm File.join(public_dir, 'stylesheets', 'markdown_editor.css')
FileUtils.rm_r File.join(public_dir, 'images', 'markdown_editor')