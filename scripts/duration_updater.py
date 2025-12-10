import requests
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_hls_duration(m3u8_url):
    """Get duration from HLS m3u8 playlist"""
    try:
        response = requests.get(m3u8_url, timeout=10)
        content = response.text
        
        # Check if this is a master playlist
        if '#EXT-X-STREAM-INF' in content:
            # Find the first variant playlist URL
            for line in content.split('\n'):
                line = line.strip()
                if line and not line.startswith('#'):
                    if not line.startswith('http'):
                        base_url = m3u8_url.rsplit('/', 1)[0]
                        variant_url = f"{base_url}/{line}"
                    else:
                        variant_url = line
                    
                    response = requests.get(variant_url, timeout=10)
                    content = response.text
                    break
        
        # Parse segment durations
        total_duration = 0
        for line in content.split('\n'):
            if line.startswith('#EXTINF:'):
                duration = float(line.split(':')[1].split(',')[0])
                total_duration += duration
        
        return total_duration if total_duration > 0 else None
    except Exception as e:
        print(f"Error fetching {m3u8_url}: {e}")
        return None

def get_mp3_duration(mp3_url):
    """Estimate MP3 duration from Content-Length header"""
    try:
        response = requests.head(mp3_url, timeout=10)
        content_length = int(response.headers.get('content-length', 0))
        
        if content_length > 0:
            # Rough estimate: 128 kbps MP3 = 16000 bytes/second
            estimated_duration = content_length / 16000
            return estimated_duration
        return None
    except Exception as e:
        print(f"Error fetching {mp3_url}: {e}")
        return None

def get_mp4_duration(mp4_url):
    """Estimate MP4 duration from Content-Length header"""
    try:
        response = requests.head(mp4_url, timeout=10)
        content_length = int(response.headers.get('content-length', 0))
        
        if content_length > 0:
            # Rough estimate: typical MP4 bitrate ~2 Mbps = 250000 bytes/second
            # This is a rough estimate and may vary significantly
            estimated_duration = content_length / 250000
            return estimated_duration
        return None
    except Exception as e:
        print(f"Error fetching {mp4_url}: {e}")
        return None

def get_media_duration(url):
    """Get duration for any media URL"""
    if url.endswith('.m3u8'):
        return get_hls_duration(url)
    elif url.endswith('.mp3'):
        return get_mp3_duration(url)
    elif url.endswith('.mp4'):
        return get_mp4_duration(url)
    else:
        return None

def update_item_duration(item):
    """Update a single item with its duration"""
    url = item.get('url')
    title = item.get('title', 'Unknown')
    
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
    update_json_durations('jf-club.json', 'output.json')