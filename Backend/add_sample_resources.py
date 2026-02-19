"""
Add sample resources to the database
Run this script to populate the database with test resources
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from myapp.models import Resource

def add_sample_resources():
    """Add 8 sample resources to the database"""
    
    resources = [
        {
            'name': 'Computer Lab 1',
            'type': 'LAB',
            'capacity': 30,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Computer Lab 2',
            'type': 'LAB',
            'capacity': 30,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Classroom A',
            'type': 'CLASSROOM',
            'capacity': 40,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Classroom B',
            'type': 'CLASSROOM',
            'capacity': 50,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Classroom C',
            'type': 'CLASSROOM',
            'capacity': 45,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Main Auditorium',
            'type': 'EVENT_HALL',
            'capacity': 200,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Conference Hall',
            'type': 'EVENT_HALL',
            'capacity': 100,
            'status': 'AVAILABLE'
        },
        {
            'name': 'Science Lab',
            'type': 'LAB',
            'capacity': 25,
            'status': 'AVAILABLE'
        }
    ]
    
    print("Adding sample resources...")
    
    for resource_data in resources:
        resource, created = Resource.objects.get_or_create(
            name=resource_data['name'],
            defaults=resource_data
        )
        
        if created:
            print(f"✅ Created: {resource.name}")
        else:
            print(f"⚠️  Already exists: {resource.name}")
    
    print(f"\n✅ Total resources in database: {Resource.objects.count()}")

if __name__ == '__main__':
    add_sample_resources()
