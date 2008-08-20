# PickyColor
module MarkdownEditor
  module FormHelper

    
    # include to the output the span and javascript tag needed for the helper
    def markdown_editor_output(textarea, object_name, method, id)
      name = method.nil? ? "#{id}" : "#{object_name}_#{method}"
      
      out = textarea
      
      out << (javascript_tag %{
        document.observe('dom:loaded',function(){
          setMarkdownTextarea('#{name}');
        });
      }) 
      return out    
    end
    
    
    def markdown_editor_tag(name, value = nil, options = {})
      options[:id] ||= name
      options[:class] ||= "markdown_editor"
    
      
      textarea = content_tag :textarea, nil, { 
                   "id" => options[:id], 
                   "name" => name,
                   "class" => options[:class],
                   "value" => value}.update(options.stringify_keys)

      return markdown_editor_output(textarea, name, nil, options[:id])
    end

            
    def markdown_editor(object, method, options = {})     
      obj = options[:object] || instance_variable_get("@#{object}")
      options[:class] ||= "markdown_editor"
         
      textarea = ActionView::Helpers::InstanceTag.new(object, method, self, nil, options.delete(:object))
      return markdown_editor_output textarea.to_text_area_tag(options), object, method, nil 
    end
    
  end 
end

module ActionView
  module Helpers
    class FormBuilder
      def markdown_editor(method, options = {})
        @template.markdown_editor(@object_name, method, options.merge(:object => @object))
      end
    end
  end
end
