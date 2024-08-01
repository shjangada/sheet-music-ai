from PIL import Image, ImageFilter
import sys
import numpy as np

def is_likely_sheet_music(image_path):
    try:
        # Open the image and convert to grayscale
        image = Image.open(image_path).convert('L')
        
        # Apply Gaussian blur to reduce noise
        image = image.filter(ImageFilter.GaussianBlur(radius=1))
        pixels = image.load()
        width, height = image.size

        # Convert image to numpy array for more advanced processing
        image_array = np.array(image)

        # Constants for line detection
        threshold = 180
        min_line_length = width * 0.5
        horizontal_lines = 0
        vertical_lines = 0

        # Scan for horizontal lines
        for y in range(height):
            line_length = np.sum(image_array[y, :] < threshold)
            if line_length > min_line_length:
                horizontal_lines += 1

        # Scan for vertical lines
        for x in range(width):
            line_length = np.sum(image_array[:, x] < threshold)
            if line_length > min_line_length:
                vertical_lines += 1

        # Add a pattern check for typical sheet music
        # Example: Check if there are multiple horizontal lines spaced evenly
        pattern_detected = horizontal_lines > 10 and vertical_lines > 5

        # Further checks can be added here based on the specific patterns of sheet music

        result = pattern_detected
        print('sheet_music' if not result else 'not_sheet_music')
        return result

    except Exception as e:
        print(f'Error analyzing image: {str(e)}')
        return False

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python check_sheet_music.py <image_path>")
        sys.exit(1)

    image_path = sys.argv[1]
    is_likely_sheet_music(image_path)
