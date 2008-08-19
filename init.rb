require "markdown_editor"
ActionView::Helpers::FormHelper.send :include, MarkdownEditor::FormHelper
ActionView::Base.send :include, MarkdownEditor::FormHelper
ActionView::Base.send :include, MarkdownEditor::FormHelper
ActionView::Helpers::AssetTagHelper.register_javascript_expansion :markdown_editor => ["markdown_editor/livepipe-ui/livepipe",
                                                                                       "markdown_editor/livepipe-ui/textarea",
                                                                                       "markdown_editor/livepipe-ui/hotkey",
                                                                                       "markdown_editor/markdown_editor"]

                                                                                       

