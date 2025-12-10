#!/usr/bin/env python3
"""
Script to fix duration_minutes in jf-club.json
Sets duration_minutes to 1 when it's 0
"""

import json
import os

def fix_duration_minutes():
    # Path to the JSON file
    json_file_path = '/home/snsa/Desktop/jf-mobile/data/jf-club.json'
    
    # Check if file exists
    if not os.path.exists(json_file_path):
        print(f"Error: File {json_file_path} not found")
        return
    
    # Read the JSON file
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON file: {e}")
        return
    except Exception as e:
        print(f"Error reading file: {e}")
        return
    
    # Count changes
    changes_count = 0
    
    # Fix duration_minutes
    for item in data:
        if 'duration_minutes' in item:
            if item['duration_minutes'] == 0:
                item['duration_minutes'] = 1
                changes_count += 1
                print(f"Fixed: {item.get('title', 'Unknown title')}")
    
    # Save the updated JSON file
    try:
        with open(json_file_path, 'w', encoding='utf-8') as file:
            json.dump(data, file, indent=2, ensure_ascii=False)
        print(f"\nSuccessfully updated {changes_count} entries")
        print(f"File saved: {json_file_path}")
    except Exception as e:
        print(f"Error saving file: {e}")

if __name__ == "__main__":
    fix_duration_minutes()
