from PIL import Image

def convert_to_favicon(input_image_path, output_favicon_path):
    # Open the input image
    with Image.open(input_image_path) as img:
        # Convert the image to RGBA if it's not already in that mode
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        
        # Resize the image to favicon dimensions (16x16)
        favicon_size = (16, 16)
        img = img.resize(favicon_size)
        
        # Create a new image for the favicon.ico format
        favicon = Image.new("RGBA", (256, 256), (255, 255, 255, 0))
        favicon.paste(img, (120, 120), img)
        
        # Save the favicon.ico file
        favicon.save(output_favicon_path, format="ICO", sizes=[(16,16)])

# Example usage
input_image_path = "/home/Mtawa/Documents/GitHub/dataware/Data set/data-repository/src/images .jpeg"
output_favicon_path = "/home/Mtawa/Documents/GitHub/dataware/Data set/data-repository/src/favicon.ico"

convert_to_favicon(input_image_path, output_favicon_path)
