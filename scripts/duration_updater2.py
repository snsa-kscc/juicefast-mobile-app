import json
import subprocess
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_media_duration(url):
    """Get exact media duration using ffprobe"""
    try:
        cmd = [
            'ffprobe',
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            url
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode == 0 and result.stdout.strip():
            return float(result.stdout.strip())
        return None
    except Exception as e:
        print(f"Error with ffprobe: {e}")
        return None

def update_item_duration(item):
    """Update a single item with its duration"""
    url = item.get('url', '')
    title = item.get('title', 'Unknown')
    
    # Only process MP3 and MP4 files
    if not (url.endswith('.mp3') or url.endswith('.mp4')):
        print(f"Skipping (not MP3/MP4): {title}")
        return item
    
    print(f"Processing: {title}")
    
    duration_seconds = get_media_duration(url)
    
    if duration_seconds:
        duration_minutes = round(duration_seconds / 60)
        item['duration_minutes'] = duration_minutes
        print(f"  ✓ Duration: {duration_minutes} minutes")
    else:
        item['duration_minutes'] = 5
        print(f"  ⚠ Using default: 5 minutes")
    
    return item

def update_json_durations(input_file, output_file, max_workers=10):
    """Process JSON file and update durations"""
    
    # Load JSON
    with open(input_file, 'r') as f:
        data = json.load(f)
    
    # Process items in parallel
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(update_item_duration, item): i 
                   for i, item in enumerate(data)}
        
        updated_data = [None] * len(data)
        for future in as_completed(futures):
            index = futures[future]
            updated_data[index] = future.result()
    
    # Save updated JSON
    with open(output_file, 'w') as f:
        json.dump(updated_data, f, indent=2)
    
    print(f"\n✓ Updated JSON saved to: {output_file}")

# Usage
if __name__ == "__main__":
    update_json_durations('output.json', 'output2.json')