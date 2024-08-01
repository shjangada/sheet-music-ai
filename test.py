from PIL import Image

def test_pillow():
    try:
        # Create a simple image
        img = Image.new('RGB', (100, 100), color = 'red')
        img.save('test_image.png')
        print("Pillow is working correctly. Image saved as 'test_image.png'.")
    except Exception as e:
        print(f"Error with Pillow: {str(e)}")

if __name__ == '__main__':
    test_pillow()
