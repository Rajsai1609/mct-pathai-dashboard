"""
Seed alumni data into Supabase.
Usage: python scripts/seed_alumni.py
Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in env (or .env.local).
"""

import os
import sys
from pathlib import Path

# Load .env.local if present
env_file = Path(__file__).parent.parent / ".env.local"
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if "=" in line and not line.startswith("#"):
            k, _, v = line.partition("=")
            os.environ.setdefault(k.strip(), v.strip())

try:
    from supabase import create_client
except ImportError:
    print("Install supabase-py first: pip install supabase")
    sys.exit(1)

URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
if not URL or not KEY:
    print("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    sys.exit(1)

client = create_client(URL, KEY)

ALUMNI = [
    # Google
    {"full_name": "Aditya Verma",       "current_company": "Google",     "current_title": "Software Engineer II",        "university": "University of Washington",  "graduation_year": 2022, "major": "Computer Science",      "visa_status": "h1b",      "location": "Seattle, WA",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/aditya-verma-uw"},
    {"full_name": "Priya Sharma",        "current_company": "Google",     "current_title": "Data Analyst",                "university": "Georgia Tech",              "graduation_year": 2021, "major": "Data Science",          "visa_status": "h1b",      "location": "Atlanta, GA",      "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Rahul Nair",          "current_company": "Google",     "current_title": "Product Manager",             "university": "UT Dallas",                 "graduation_year": 2020, "major": "Business Analytics",   "visa_status": "green_card","location": "Austin, TX",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/rahul-nair-google"},
    {"full_name": "Sneha Patel",         "current_company": "Google",     "current_title": "UX Researcher",               "university": "Northeastern University",   "graduation_year": 2023, "major": "Human-Computer Interaction","visa_status": "opt",   "location": "Boston, MA",       "willing_to_refer": True,  "linkedin_url": None},

    # Microsoft
    {"full_name": "Kavya Reddy",         "current_company": "Microsoft",  "current_title": "Software Engineer",           "university": "University of Washington",  "graduation_year": 2022, "major": "Computer Engineering",  "visa_status": "h1b",      "location": "Redmond, WA",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/kavya-reddy-ms"},
    {"full_name": "Arjun Mehta",         "current_company": "Microsoft",  "current_title": "Cloud Solution Architect",    "university": "Arizona State University",  "graduation_year": 2019, "major": "Information Systems",   "visa_status": "h1b",      "location": "Phoenix, AZ",      "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Divya Krishna",       "current_company": "Microsoft",  "current_title": "Data Engineer",               "university": "University of Illinois",    "graduation_year": 2021, "major": "Computer Science",      "visa_status": "stem_opt", "location": "Chicago, IL",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/divya-krishna-msft"},
    {"full_name": "Sanjay Iyer",         "current_company": "Microsoft",  "current_title": "Program Manager",             "university": "Carnegie Mellon University","graduation_year": 2020, "major": "Software Engineering",  "visa_status": "h1b",      "location": "Pittsburgh, PA",   "willing_to_refer": False, "linkedin_url": None},

    # Amazon
    {"full_name": "Ananya Gupta",        "current_company": "Amazon",     "current_title": "SDE II",                      "university": "Purdue University",         "graduation_year": 2021, "major": "Computer Science",      "visa_status": "h1b",      "location": "Seattle, WA",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/ananya-gupta-amazon"},
    {"full_name": "Vikram Singh",        "current_company": "Amazon",     "current_title": "Business Analyst",            "university": "Indiana University",        "graduation_year": 2022, "major": "Business Analytics",   "visa_status": "opt",      "location": "Indianapolis, IN", "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Meera Pillai",        "current_company": "Amazon",     "current_title": "Data Scientist",              "university": "University of Michigan",    "graduation_year": 2020, "major": "Statistics",            "visa_status": "green_card","location": "Ann Arbor, MI",    "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/meera-pillai"},
    {"full_name": "Rohan Desai",         "current_company": "Amazon",     "current_title": "Operations Manager",          "university": "Ohio State University",     "graduation_year": 2019, "major": "Supply Chain",          "visa_status": "h1b",      "location": "Columbus, OH",     "willing_to_refer": True,  "linkedin_url": None},

    # Meta
    {"full_name": "Pooja Subramaniam",   "current_company": "Meta",       "current_title": "Software Engineer",           "university": "UC San Diego",              "graduation_year": 2022, "major": "Computer Science",      "visa_status": "h1b",      "location": "Menlo Park, CA",   "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/pooja-subram-meta"},
    {"full_name": "Kiran Bhat",          "current_company": "Meta",       "current_title": "Product Analyst",             "university": "UCLA",                      "graduation_year": 2021, "major": "Information Science",   "visa_status": "stem_opt", "location": "Los Angeles, CA",  "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Akshay Kumar",        "current_company": "Meta",       "current_title": "ML Engineer",                 "university": "Stanford University",       "graduation_year": 2020, "major": "Artificial Intelligence","visa_status": "h1b",     "location": "Palo Alto, CA",    "willing_to_refer": False, "linkedin_url": "https://linkedin.com/in/akshay-kumar-meta"},

    # Databricks
    {"full_name": "Nisha Joshi",         "current_company": "Databricks", "current_title": "Data Engineer",               "university": "University of Washington",  "graduation_year": 2022, "major": "Data Engineering",      "visa_status": "opt",      "location": "San Francisco, CA","willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/nisha-joshi-db"},
    {"full_name": "Vivek Rao",           "current_company": "Databricks", "current_title": "Solutions Engineer",          "university": "Georgia Tech",              "graduation_year": 2021, "major": "Computer Science",      "visa_status": "h1b",      "location": "Atlanta, GA",      "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Lakshmi Narayan",     "current_company": "Databricks", "current_title": "Software Engineer",           "university": "UT Austin",                 "graduation_year": 2023, "major": "Computer Science",      "visa_status": "opt",      "location": "Austin, TX",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/lakshmi-narayan-db"},

    # Salesforce
    {"full_name": "Deepak Chatterjee",   "current_company": "Salesforce", "current_title": "Software Engineer",           "university": "Arizona State University",  "graduation_year": 2021, "major": "Software Engineering",  "visa_status": "h1b",      "location": "San Francisco, CA","willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Aarti Kapoor",        "current_company": "Salesforce", "current_title": "Business Analyst",            "university": "University of Illinois",    "graduation_year": 2020, "major": "Business Administration","visa_status": "h1b",     "location": "Chicago, IL",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/aarti-kapoor-sf"},

    # Stripe
    {"full_name": "Nikhil Agarwal",      "current_company": "Stripe",     "current_title": "Backend Engineer",            "university": "Cornell University",        "graduation_year": 2022, "major": "Computer Science",      "visa_status": "h1b",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/nikhil-agarwal-stripe"},
    {"full_name": "Sunita Rajan",        "current_company": "Stripe",     "current_title": "Data Analyst",                "university": "NYU",                       "graduation_year": 2021, "major": "Data Analytics",        "visa_status": "stem_opt", "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": None},

    # Datadog
    {"full_name": "Harsh Trivedi",       "current_company": "Datadog",    "current_title": "Software Engineer",           "university": "Rutgers University",        "graduation_year": 2022, "major": "Computer Science",      "visa_status": "opt",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/harsh-trivedi-dd"},
    {"full_name": "Preethi Venkatesan",  "current_company": "Datadog",    "current_title": "DevOps Engineer",             "university": "University of Texas",       "graduation_year": 2021, "major": "Information Technology","visa_status": "h1b",      "location": "Austin, TX",       "willing_to_refer": True,  "linkedin_url": None},

    # Ramp
    {"full_name": "Suresh Babu",         "current_company": "Ramp",       "current_title": "Software Engineer",           "university": "Boston University",         "graduation_year": 2023, "major": "Computer Science",      "visa_status": "opt",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/suresh-babu-ramp"},
    {"full_name": "Pavithra Mohan",      "current_company": "Ramp",       "current_title": "Product Manager",             "university": "UC Berkeley",               "graduation_year": 2021, "major": "Business",              "visa_status": "h1b",      "location": "San Francisco, CA","willing_to_refer": True,  "linkedin_url": None},

    # OpenAI
    {"full_name": "Kartik Sharma",       "current_company": "OpenAI",     "current_title": "ML Researcher",               "university": "MIT",                       "graduation_year": 2021, "major": "Artificial Intelligence","visa_status": "h1b",     "location": "San Francisco, CA","willing_to_refer": False, "linkedin_url": None},
    {"full_name": "Bhavna Saini",        "current_company": "OpenAI",     "current_title": "Software Engineer",           "university": "University of Washington",  "graduation_year": 2022, "major": "Computer Science",      "visa_status": "opt",      "location": "San Francisco, CA","willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/bhavna-saini-oai"},

    # Notion
    {"full_name": "Gaurav Malhotra",     "current_company": "Notion",     "current_title": "Frontend Engineer",           "university": "San Jose State University", "graduation_year": 2022, "major": "Computer Science",      "visa_status": "opt",      "location": "San Francisco, CA","willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/gaurav-malhotra-notion"},

    # Deloitte
    {"full_name": "Swati Mishra",        "current_company": "Deloitte",   "current_title": "Business Analyst",            "university": "University of Maryland",    "graduation_year": 2021, "major": "Information Systems",   "visa_status": "h1b",      "location": "Washington, DC",   "willing_to_refer": True,  "linkedin_url": None},
    {"full_name": "Tarun Pandey",        "current_company": "Deloitte",   "current_title": "SAP Consultant",              "university": "UT Dallas",                 "graduation_year": 2020, "major": "Management Information Systems","visa_status": "h1b","location": "Dallas, TX",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/tarun-pandey-deloitte"},
    {"full_name": "Revathi Sundaram",    "current_company": "Deloitte",   "current_title": "Data Analyst",                "university": "George Mason University",   "graduation_year": 2022, "major": "Data Analytics",        "visa_status": "stem_opt", "location": "Fairfax, VA",      "willing_to_refer": True,  "linkedin_url": None},

    # Accenture
    {"full_name": "Manish Tiwari",       "current_company": "Accenture",  "current_title": "Software Developer",          "university": "Illinois Institute of Technology","graduation_year": 2021,"major": "Computer Science",   "visa_status": "h1b",      "location": "Chicago, IL",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/manish-tiwari-acc"},
    {"full_name": "Usha Ramamurthy",     "current_company": "Accenture",  "current_title": "Project Manager",             "university": "University of Cincinnati",  "graduation_year": 2019, "major": "Project Management",   "visa_status": "green_card","location": "Cincinnati, OH",   "willing_to_refer": True,  "linkedin_url": None},

    # JPMorgan
    {"full_name": "Ravi Krishnamurthy",  "current_company": "JPMorgan",   "current_title": "Software Engineer",           "university": "Columbia University",       "graduation_year": 2022, "major": "Computer Science",      "visa_status": "h1b",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/ravi-krishna-jpm"},
    {"full_name": "Yamini Balaji",       "current_company": "JPMorgan",   "current_title": "Business Analyst",            "university": "Fordham University",        "graduation_year": 2021, "major": "Finance",               "visa_status": "opt",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": None},

    # Cognizant
    {"full_name": "Srikanth Naidu",      "current_company": "Cognizant",  "current_title": "Senior Developer",            "university": "Stevens Institute of Technology","graduation_year": 2020,"major": "Information Technology","visa_status": "h1b",  "location": "Teaneck, NJ",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/srikanth-naidu-cognizant"},
    {"full_name": "Nalini Venkatesh",    "current_company": "Cognizant",  "current_title": "QA Engineer",                 "university": "University of New Haven",   "graduation_year": 2021, "major": "Computer Science",      "visa_status": "h1b",      "location": "New Haven, CT",    "willing_to_refer": True,  "linkedin_url": None},

    # Infosys
    {"full_name": "Balaji Srinivasan",   "current_company": "Infosys",    "current_title": "Technology Analyst",          "university": "Drexel University",         "graduation_year": 2022, "major": "Computer Engineering",  "visa_status": "h1b",      "location": "Philadelphia, PA", "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/balaji-srinivasan-infosys"},

    # TCS
    {"full_name": "Indira Subramanian",  "current_company": "TCS",        "current_title": "Systems Analyst",             "university": "Pace University",           "graduation_year": 2020, "major": "Information Systems",   "visa_status": "h1b",      "location": "New York, NY",     "willing_to_refer": True,  "linkedin_url": None},

    # Wipro
    {"full_name": "Rajesh Venkataraman","current_company": "Wipro",       "current_title": "Cloud Engineer",              "university": "George Washington University","graduation_year": 2021,"major": "Cloud Computing",       "visa_status": "h1b",      "location": "Washington, DC",   "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/rajesh-v-wipro"},

    # ServiceNow
    {"full_name": "Archana Reddy",       "current_company": "ServiceNow", "current_title": "Platform Engineer",           "university": "University of Arizona",     "graduation_year": 2022, "major": "Computer Science",      "visa_status": "opt",      "location": "Phoenix, AZ",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/archana-reddy-sn"},

    # Adobe
    {"full_name": "Nagesh Pillai",       "current_company": "Adobe",      "current_title": "Data Scientist",              "university": "San Jose State University", "graduation_year": 2021, "major": "Data Science",          "visa_status": "h1b",      "location": "San Jose, CA",     "willing_to_refer": True,  "linkedin_url": None},

    # Oracle
    {"full_name": "Meenakshi Sundaram",  "current_company": "Oracle",     "current_title": "Database Administrator",      "university": "UT Dallas",                 "graduation_year": 2019, "major": "Database Systems",      "visa_status": "h1b",      "location": "Austin, TX",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/meenakshi-s-oracle"},
    {"full_name": "Sunil Krishnaswamy", "current_company": "Oracle",      "current_title": "Applications Developer",      "university": "Florida International University","graduation_year": 2020,"major": "Computer Science",   "visa_status": "h1b",      "location": "Miami, FL",        "willing_to_refer": True,  "linkedin_url": None},

    # Cisco
    {"full_name": "Padma Raghavan",      "current_company": "Cisco",      "current_title": "Network Engineer",            "university": "NJIT",                      "graduation_year": 2021, "major": "Electrical Engineering","visa_status": "h1b",      "location": "Newark, NJ",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/padma-raghavan-cisco"},

    # Nvidia
    {"full_name": "Harish Chandrasekhar","current_company": "Nvidia",     "current_title": "GPU Software Engineer",       "university": "UT Austin",                 "graduation_year": 2022, "major": "Electrical Engineering","visa_status": "h1b",      "location": "Austin, TX",       "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/harish-c-nvidia"},

    # Uber
    {"full_name": "Rekha Gopalakrishnan","current_company": "Uber",       "current_title": "Backend Engineer",            "university": "University of Washington",  "graduation_year": 2021, "major": "Computer Science",      "visa_status": "stem_opt", "location": "Seattle, WA",      "willing_to_refer": True,  "linkedin_url": "https://linkedin.com/in/rekha-g-uber"},
    {"full_name": "Vikrant Tomar",       "current_company": "Uber",       "current_title": "Data Engineer",               "university": "University of Michigan",    "graduation_year": 2022, "major": "Data Engineering",      "visa_status": "opt",      "location": "Ann Arbor, MI",    "willing_to_refer": True,  "linkedin_url": None},
]

def seed():
    print(f"Inserting {len(ALUMNI)} alumni records...")
    result = client.table("alumni").upsert(
        ALUMNI,
        on_conflict="full_name,current_company"
    ).execute()
    if hasattr(result, "error") and result.error:
        print(f"Error: {result.error}")
        sys.exit(1)
    print(f"Done. Inserted/updated {len(ALUMNI)} records.")

if __name__ == "__main__":
    seed()
