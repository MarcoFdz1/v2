#!/usr/bin/env python3
import requests
import json
import uuid
import time
import sys

# Get the backend URL from the frontend .env file
BACKEND_URL = "https://0810bf09-7686-48eb-b122-c4ed4db0c0f2.preview.emergentagent.com"
API_URL = f"{BACKEND_URL}/api"

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

def log_test(name, passed, message="", response=None):
    """Log test results with formatting"""
    test_results["total"] += 1
    
    if passed:
        test_results["passed"] += 1
        status = "✅ PASS"
    else:
        test_results["failed"] += 1
        status = "❌ FAIL"
    
    test_results["tests"].append({
        "name": name,
        "passed": passed,
        "message": message,
        "response": response
    })
    
    # Print to console
    print(f"{status} | {name}")
    if message:
        print(f"       {message}")
    if response and not passed:
        print(f"       Response: {response}")
    print()

def test_auth_login():
    """Test authentication endpoints"""
    print("\n=== Testing Authentication Endpoints ===\n")
    
    # Test admin login
    admin_data = {"email": "unbrokerage@realtyonegroupmexico.mx", "password": "OneVision$07"}
    response = requests.post(f"{API_URL}/auth/login", json=admin_data)
    log_test(
        "Admin Login", 
        response.status_code == 200 and response.json().get("role") == "admin",
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    # Test user login
    user_data = {"email": "unbrokerage@realtyonegroupmexico.mx", "password": "AgenteONE13"}
    response = requests.post(f"{API_URL}/auth/login", json=user_data)
    log_test(
        "User Login", 
        response.status_code == 200 and response.json().get("role") == "user",
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    # Test invalid login
    invalid_data = {"email": "invalid@example.com", "password": "wrongpassword"}
    response = requests.post(f"{API_URL}/auth/login", json=invalid_data)
    log_test(
        "Invalid Login", 
        response.status_code == 401,
        f"Status: {response.status_code}",
        response.json() if hasattr(response, 'json') else response.text
    )

def test_user_management():
    """Test user management endpoints"""
    print("\n=== Testing User Management Endpoints ===\n")
    
    # Generate unique email to avoid conflicts
    test_email = f"test.user.{uuid.uuid4()}@example.com"
    
    # Test user creation
    user_data = {
        "email": test_email,
        "password": "securePassword123",
        "name": "Test User",
        "role": "user"
    }
    
    response = requests.post(f"{API_URL}/users", json=user_data)
    user_created = response.status_code == 200 and "id" in response.json()
    log_test(
        "Create User", 
        user_created,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    if user_created:
        user_id = response.json()["id"]
        
        # Test get all users
        response = requests.get(f"{API_URL}/users")
        users_list = response.json() if response.status_code == 200 else []
        user_found = any(user["email"] == test_email for user in users_list)
        
        log_test(
            "Get All Users", 
            response.status_code == 200 and user_found,
            f"Status: {response.status_code}, User found: {user_found}",
            f"Found {len(users_list)} users" if response.status_code == 200 else response.text
        )
        
        # Test delete user
        response = requests.delete(f"{API_URL}/users/{user_id}")
        log_test(
            "Delete User", 
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Verify user was deleted
        response = requests.get(f"{API_URL}/users")
        users_list = response.json() if response.status_code == 200 else []
        user_deleted = not any(user["id"] == user_id for user in users_list)
        
        log_test(
            "Verify User Deletion", 
            user_deleted,
            f"User with ID {user_id} was {'not found (good)' if user_deleted else 'still found (bad)'}",
            f"Found {len(users_list)} users" if response.status_code == 200 else response.text
        )

def test_category_management():
    """Test category management endpoints"""
    print("\n=== Testing Category Management Endpoints ===\n")
    
    # Test get all categories (should auto-initialize with defaults if empty)
    response = requests.get(f"{API_URL}/categories")
    categories = response.json() if response.status_code == 200 else []
    
    log_test(
        "Get All Categories", 
        response.status_code == 200 and len(categories) >= 9,  # Should have at least the 9 default categories
        f"Status: {response.status_code}, Found {len(categories)} categories",
        f"First few categories: {categories[:2]}" if categories else response.text
    )
    
    # Test category creation
    category_data = {
        "name": f"Test Category {uuid.uuid4()}",
        "icon": "TestIcon"
    }
    
    response = requests.post(f"{API_URL}/categories", json=category_data)
    category_created = response.status_code == 200 and "id" in response.json()
    
    log_test(
        "Create Category", 
        category_created,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    if category_created:
        category_id = response.json()["id"]
        
        # Test update category
        update_data = {
            "name": f"Updated Category {uuid.uuid4()}",
            "icon": "UpdatedIcon"
        }
        
        response = requests.put(f"{API_URL}/categories/{category_id}", json=update_data)
        log_test(
            "Update Category", 
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Verify update
        response = requests.get(f"{API_URL}/categories")
        categories = response.json() if response.status_code == 200 else []
        updated_category = next((c for c in categories if c["id"] == category_id), None)
        
        update_verified = updated_category and updated_category["name"] == update_data["name"]
        log_test(
            "Verify Category Update", 
            update_verified,
            f"Category name {'matches' if update_verified else 'does not match'} expected value",
            updated_category if updated_category else "Category not found"
        )
        
        # Test delete category
        response = requests.delete(f"{API_URL}/categories/{category_id}")
        log_test(
            "Delete Category", 
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Verify deletion
        response = requests.get(f"{API_URL}/categories")
        categories = response.json() if response.status_code == 200 else []
        category_deleted = not any(c["id"] == category_id for c in categories)
        
        log_test(
            "Verify Category Deletion", 
            category_deleted,
            f"Category with ID {category_id} was {'not found (good)' if category_deleted else 'still found (bad)'}",
            None
        )

def test_video_management():
    """Test video management endpoints"""
    print("\n=== Testing Video Management Endpoints ===\n")
    
    # First, get a category ID to use
    response = requests.get(f"{API_URL}/categories")
    categories = response.json() if response.status_code == 200 else []
    
    if not categories:
        log_test("Get Category for Video Tests", False, "No categories found to use for video tests")
        return
    
    category_id = categories[0]["id"]
    
    # Test video creation
    video_data = {
        "title": f"Test Video {uuid.uuid4()}",
        "description": "This is a test video description",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "duration": "10:30",
        "youtubeId": "test12345",
        "match": "high",
        "difficulty": "medium",
        "rating": 4.5,
        "views": 100,
        "releaseDate": "2023-05-15",
        "categoryId": category_id
    }
    
    response = requests.post(f"{API_URL}/videos", json=video_data)
    video_created = response.status_code == 200 and "id" in response.json()
    
    log_test(
        "Create Video", 
        video_created,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    if video_created:
        video_id = response.json()["id"]
        
        # Test get all videos
        response = requests.get(f"{API_URL}/videos")
        videos = response.json() if response.status_code == 200 else []
        video_found = any(v["id"] == video_id for v in videos)
        
        log_test(
            "Get All Videos", 
            response.status_code == 200 and video_found,
            f"Status: {response.status_code}, Video found: {video_found}",
            f"Found {len(videos)} videos" if response.status_code == 200 else response.text
        )
        
        # Test update video
        update_data = {
            "title": f"Updated Video {uuid.uuid4()}",
            "description": "Updated test video description",
            "thumbnail": "https://example.com/updated-thumbnail.jpg",
            "duration": "15:45",
            "youtubeId": "updated12345",
            "match": "medium",
            "difficulty": "hard",
            "rating": 3.5,
            "views": 200,
            "releaseDate": "2023-06-20",
            "categoryId": category_id
        }
        
        response = requests.put(f"{API_URL}/videos/{video_id}", json=update_data)
        log_test(
            "Update Video", 
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Verify video was updated in both videos collection and category
        response = requests.get(f"{API_URL}/videos")
        videos = response.json() if response.status_code == 200 else []
        updated_video = next((v for v in videos if v["id"] == video_id), None)
        
        update_verified = updated_video and updated_video["title"] == update_data["title"]
        log_test(
            "Verify Video Update", 
            update_verified,
            f"Video title {'matches' if update_verified else 'does not match'} expected value",
            updated_video if updated_video else "Video not found"
        )
        
        # Test delete video
        response = requests.delete(f"{API_URL}/videos/{video_id}")
        log_test(
            "Delete Video", 
            response.status_code == 200,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Verify video was deleted from both videos collection and category
        response = requests.get(f"{API_URL}/videos")
        videos = response.json() if response.status_code == 200 else []
        video_deleted = not any(v["id"] == video_id for v in videos)
        
        log_test(
            "Verify Video Deletion", 
            video_deleted,
            f"Video with ID {video_id} was {'not found (good)' if video_deleted else 'still found (bad)'}",
            None
        )

def test_settings_management():
    """Test settings management endpoints"""
    print("\n=== Testing Settings Management Endpoints ===\n")
    
    # Test get settings (should create defaults if none exist)
    response = requests.get(f"{API_URL}/settings")
    settings_exist = response.status_code == 200 and "id" in response.json()
    
    log_test(
        "Get Settings", 
        settings_exist,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    if settings_exist:
        # Test update settings
        update_data = {
            "companyName": f"Updated Company Name {uuid.uuid4()}",
            "logoUrl": "https://example.com/updated-logo.png",
            "theme": "light"
        }
        
        response = requests.put(f"{API_URL}/settings", json=update_data)
        settings_updated = response.status_code == 200
        
        log_test(
            "Update Settings", 
            settings_updated,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        if settings_updated:
            # Verify settings were updated
            response = requests.get(f"{API_URL}/settings")
            updated_settings = response.json() if response.status_code == 200 else {}
            
            update_verified = (
                updated_settings.get("companyName") == update_data["companyName"] and
                updated_settings.get("logoUrl") == update_data["logoUrl"] and
                updated_settings.get("theme") == update_data["theme"]
            )
            
            log_test(
                "Verify Settings Update", 
                update_verified,
                f"Settings {'match' if update_verified else 'do not match'} expected values",
                updated_settings
            )

def test_banner_video():
    """Test banner video endpoints"""
    print("\n=== Testing Banner Video Endpoints ===\n")
    
    # Test get banner video (might be None initially)
    response = requests.get(f"{API_URL}/banner-video")
    initial_get_success = response.status_code == 200
    
    log_test(
        "Get Initial Banner Video", 
        initial_get_success,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 and response.text else "No banner video found (expected)"
    )
    
    # Test set banner video
    banner_data = {
        "title": f"Test Banner Video {uuid.uuid4()}",
        "description": "This is a test banner video",
        "thumbnail": "https://example.com/banner-thumbnail.jpg",
        "youtubeId": "banner12345"
    }
    
    response = requests.post(f"{API_URL}/banner-video", json=banner_data)
    banner_created = response.status_code == 200 and "id" in response.json()
    
    log_test(
        "Set Banner Video", 
        banner_created,
        f"Status: {response.status_code}",
        response.json() if response.status_code == 200 else response.text
    )
    
    if banner_created:
        # Verify banner video was set
        response = requests.get(f"{API_URL}/banner-video")
        banner_verified = (
            response.status_code == 200 and
            response.json().get("title") == banner_data["title"]
        )
        
        log_test(
            "Verify Banner Video", 
            banner_verified,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        # Test delete banner video
        response = requests.delete(f"{API_URL}/banner-video")
        banner_deleted = response.status_code == 200
        
        log_test(
            "Delete Banner Video", 
            banner_deleted,
            f"Status: {response.status_code}",
            response.json() if response.status_code == 200 else response.text
        )
        
        if banner_deleted:
            # Verify banner video was deleted
            response = requests.get(f"{API_URL}/banner-video")
            banner_gone = response.status_code == 200 and (not response.text or response.json() is None)
            
            log_test(
                "Verify Banner Video Deletion", 
                banner_gone,
                f"Status: {response.status_code}",
                "Banner video successfully deleted" if banner_gone else f"Banner video still exists: {response.json()}"
            )

def print_summary():
    """Print test summary"""
    print("\n" + "="*50)
    print(f"TEST SUMMARY: {test_results['passed']}/{test_results['total']} tests passed")
    print("="*50)
    
    if test_results["failed"] > 0:
        print("\nFailed Tests:")
        for test in test_results["tests"]:
            if not test["passed"]:
                print(f"❌ {test['name']}")
                if test["message"]:
                    print(f"   Message: {test['message']}")
                if test["response"]:
                    print(f"   Response: {test['response']}")
                print()
    
    success_rate = (test_results["passed"] / test_results["total"]) * 100 if test_results["total"] > 0 else 0
    print(f"Success Rate: {success_rate:.2f}%")
    
    if success_rate == 100:
        print("\n🎉 All tests passed! The backend API is working correctly.")
    else:
        print(f"\n⚠️ {test_results['failed']} tests failed. Please check the details above.")

def main():
    """Run all tests"""
    print(f"Testing backend API at: {API_URL}")
    print("="*50)
    
    try:
        # Test API connectivity
        response = requests.get(f"{API_URL}/")
        if response.status_code != 200:
            print(f"❌ API connectivity test failed with status code {response.status_code}")
            print(f"Response: {response.text}")
            return
        
        print("✅ API connectivity test passed")
        print(f"Response: {response.json()}")
        print("="*50 + "\n")
        
        # Run all test suites
        test_auth_login()
        test_user_management()
        test_category_management()
        test_video_management()
        test_settings_management()
        test_banner_video()
        
        # Print summary
        print_summary()
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error connecting to the API: {e}")
        print(f"Make sure the backend is running and accessible at {API_URL}")
        sys.exit(1)

if __name__ == "__main__":
    main()