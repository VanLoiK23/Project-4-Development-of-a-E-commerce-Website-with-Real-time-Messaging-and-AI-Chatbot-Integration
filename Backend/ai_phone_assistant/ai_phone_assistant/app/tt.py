import google.generativeai as genai

genai.configure(api_key="AIzaSyDP7R9iKEYV7uLaVKmbaE19CFJuNQn7lDY")

# Liệt kê tất cả model khả dụng
for m in genai.list_models():
    print(m.name, m.supported_generation_methods)