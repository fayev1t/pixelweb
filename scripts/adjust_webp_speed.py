from PIL import Image, ImageSequence
import os

def slow_down_webp(file_path, slowdown_factor=2.0):
    try:
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            return

        print(f"Processing: {file_path}")
        im = Image.open(file_path)

        frames = []
        durations = []

        # Iterate through frames
        for frame in ImageSequence.Iterator(im):
            # We need to copy because the iterator moves on
            frames.append(frame.copy())
            original_duration = frame.info.get('duration', 100) # Default 100ms
            new_duration = int(original_duration * slowdown_factor)
            durations.append(new_duration)

        if not frames:
            print(f"No frames found in {file_path}")
            return

        # Create backup
        backup_path = file_path + ".bak"
        # We save the FIRST frame with append_images for the backup too, to preserve animation
        # Or simpler: just copy the file using shutil before modifying
        import shutil
        shutil.copy2(file_path, backup_path)
        print(f"Backed up to: {backup_path}")

        # Save modified image
        # duration can be a list or an integer. If list, must match number of frames.
        # loop=0 means infinite loop.
        frames[0].save(
            file_path,
            save_all=True,
            append_images=frames[1:],
            duration=durations,
            loop=0,
            optimize=False,
            lossless=True,
            quality=100,
            method=6
        )
        print(f"Successfully slowed down {file_path} (factor: {slowdown_factor}x)")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")

if __name__ == "__main__":
    # Adjust paths based on where script is run from
    # Assuming running from project root
    base_dir = "frontend/src/assets/background"
    
    # Target files
    targets = ["LandingPage_Grass.webp", "LandingPage_Hills.webp"]
    
    for filename in targets:
        full_path = os.path.join(base_dir, filename)
        # Check if file exists, if not try absolute path relative to current script
        if not os.path.exists(full_path):
             # Fallback: try relative to script location
             script_dir = os.path.dirname(os.path.abspath(__file__))
             # Navigate up to project root: scripts/..
             project_root = os.path.dirname(script_dir)
             full_path = os.path.join(project_root, "frontend/src/assets/background", filename)

        slow_down_webp(full_path, slowdown_factor=2.0)
