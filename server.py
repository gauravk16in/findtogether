import os
import json
from typing import Any, Dict, List
from mcp.server.fastmcp import FastMCP
from supabase import create_client, Client

# Initialize FastMCP server
mcp = FastMCP("FindTogether MCP Server")

# Supabase Configuration
# Ensure these environment variables are set or replace with your actual keys for testing
SUPABASE_URL = os.environ.get("SUPABASE_URL", "YOUR_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "YOUR_SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Mock External Services
class TwitterService:
    @staticmethod
    def post(message: str):
        print(f"[Twitter] Posted: {message}")

class FacebookService:
    @staticmethod
    def post(message: str):
        print(f"[Facebook] Posted: {message}")

class WhatsAppService:
    @staticmethod
    def send_group_message(group_id: str, message: str):
        print(f"[WhatsApp Group {group_id}] Sent: {message}")
    
    @staticmethod
    def send_direct_message(phone: str, message: str):
        print(f"[WhatsApp DM {phone}] Sent: {message}")

class GoogleMapsService:
    @staticmethod
    def generate_static_map(lat: float, lng: float) -> str:
        return f"https://maps.googleapis.com/maps/api/staticmap?center={lat},{lng}&zoom=14&size=600x300&markers=color:red%7C{lat},{lng}&key=YOUR_API_KEY"

@mcp.tool()
async def report_missing_person(
    name: str,
    age: int,
    description: str,
    last_seen_location: str,
    last_seen_date: str,
    reporter_name: str,
    reporter_contact: str,
    image_url: str = None
) -> str:
    """
    Collects victim details and creates a case ID in the database.
    """
    print("MCP: Reporting missing person...")
    
    try:
        # 1. Create Person
        person_data = {
            "name": name,
            "age": age,
            "description": description,
            "last_seen_location": last_seen_location,
            "last_seen_date": last_seen_date
        }
        
        person_res = supabase.table("persons").insert(person_data).execute()
        if not person_res.data:
            return "Failed to create person record."
            
        person = person_res.data[0]
        person_id = person['id']

        # 2. Create Photo if URL provided
        if image_url:
            supabase.table("photos").insert({
                "person_id": person_id,
                "image_url": image_url
            }).execute()

        # 3. Create Case
        case_data = {
            "person_id": person_id,
            "status": "New",
            "reported_by": reporter_name,
            "contact_name": reporter_name,
            "contact_role": "Reporter"
        }
        
        case_res = supabase.table("cases").insert(case_data).execute()
        if not case_res.data:
            return "Failed to create case record."
            
        new_case = case_res.data[0]
        
        return f"Case created successfully. Case ID: {new_case['id']}"

    except Exception as e:
        return f"Error reporting missing person: {str(e)}"

@mcp.tool()
async def post_alerts(case_id: int) -> str:
    """
    Posts formatted alerts to Twitter/X, Facebook, and WhatsApp group for a specific case.
    """
    print(f"MCP: Posting alerts for Case {case_id}...")
    
    try:
        # Fetch case details
        case_res = supabase.table("cases").select("*, persons(*, photos(*))").eq("id", case_id).execute()
        
        if not case_res.data:
            return "Case not found."
            
        case_data = case_res.data[0]
        person = case_data['persons']
        
        alert_message = (
            f"MISSING PERSON ALERT: {person['name']}, Age {person['age']}. "
            f"Last seen at {person['last_seen_location']} on {person['last_seen_date']}. "
            f"Description: {person['description']}. "
            f"If seen, please contact police or {case_data['contact_name']}. "
            f"#MissingPerson #Find{person['name'].replace(' ', '')}"
        )

        # Execute posts
        TwitterService.post(alert_message)
        FacebookService.post(alert_message)
        WhatsAppService.send_group_message('Community_Alerts_Group', alert_message)

        return "Alerts posted to Twitter, Facebook, and WhatsApp."

    except Exception as e:
        return f"Error posting alerts: {str(e)}"

@mcp.tool()
async def create_search_map(location: str) -> str:
    """
    Generates Google Maps pins for last seen locations and search zones.
    """
    print(f"MCP: Creating search map for {location}...")
    
    # Mock Geocoding
    mock_coords = {"lat": 28.6304, "lng": 77.2177}
    
    if "delhi" in location.lower():
        mock_coords["lat"] = 28.6139
        mock_coords["lng"] = 77.2090

    map_url = GoogleMapsService.generate_static_map(mock_coords["lat"], mock_coords["lng"])
    
    result = {
        "location": location,
        "coordinates": mock_coords,
        "search_zones": [
            {"radius": "1km", "priority": "High", "description": "Immediate vicinity"},
            {"radius": "5km", "priority": "Medium", "description": "Surrounding transport hubs"}
        ],
        "map_url": map_url
    }
    
    return json.dumps(result, indent=2)

@mcp.tool()
async def coordinate_volunteers(case_id: int, location: str) -> str:
    """
    Matches volunteers to search areas based on location/skills and sends WhatsApp message.
    """
    print(f"MCP: Coordinating volunteers for Case {case_id} near {location}...")
    
    try:
        # 1. Get Case Details
        case_res = supabase.table("cases").select("*, persons(*)").eq("id", case_id).execute()
        if not case_res.data:
            return "Case not found."
            
        case_data = case_res.data[0]
        person_name = case_data['persons']['name']

        # 2. Find Volunteers
        vol_res = supabase.table("volunteers").select("*").execute()
        volunteers = vol_res.data if vol_res.data else []

        # Filter manually (Mock geospatial)
        matched_volunteers = [
            v for v in volunteers 
            if (v.get('location_address') and 
                ('delhi' in v['location_address'].lower() or 
                 'connaught' in v['location_address'].lower() or 
                 'delhi' in location.lower()))
        ]

        print(f"Found {len(matched_volunteers)} volunteers near {location}")

        # 3. Send Messages & Create Notifications
        message = (
            f"URGENT VOLUNTEER ALERT: Missing Person {person_name} reported near your location ({location}). "
            f"Please check your dashboard for search coordination instructions."
        )

        notifications = []
        for vol in matched_volunteers:
            if vol.get('phone'):
                WhatsAppService.send_direct_message(vol['phone'], message)
            
            notifications.append({
                "user_id": vol['user_id'],
                "case_id": case_id,
                "title": "Urgent Search Request",
                "message": message,
                "is_read": False
            })

        if notifications:
            supabase.table("notifications").insert(notifications).execute()

        return f"Successfully contacted {len(matched_volunteers)} volunteers: {', '.join([v['name'] for v in matched_volunteers])}"

    except Exception as e:
        return f"Error coordinating volunteers: {str(e)}"

if __name__ == "__main__":
    # Run the MCP server
    mcp.run()
