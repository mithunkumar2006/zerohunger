# 🍽️ ZeroHunger

**Bridging the gap between food surplus and food scarcity.**

ZeroHunger is a tech-driven platform designed to eliminate food waste by connecting hotels, banquet halls, and event organizers with excess food to the nearest NGOs and food shelters. By utilizing a location-based matching system and a strict "Food Tier" quality protocol, ZeroHunger ensures that safe, edible surplus food reaches those in need quickly and efficiently.

## 🌟 Key Features

* **Geospatial Matching:** Automatically connects donors with the nearest verified NGOs to reduce transit time and ensure food freshness.
* **Food Tier System:** Categorizes food to maintain safety standards:
  * *Tier 1:* Freshly cooked, perishable meals (needs immediate pickup).
  * *Tier 2:* Packaged or baked goods with a short shelf life.
  * *Tier 3:* Raw ingredients, dry rations, or uncut vegetables.
* **Dual Dashboards:** 
  * *Donor Portal:* For hotels and event managers to log surplus quantities, food tiers, and pickup windows.
  * *NGO Portal:* For receiving organizations to accept donations, track logistics, and manage volunteers.
* **Live Tracking:** Real-time status updates from donation creation to successful handover.
* **Impact Analytics:** Tracks the amount of food saved and meals served to provide a social impact score for contributing hotels.

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js, FastAPI (for location routing optimization)
* **Database:** MongoDB
* **Version Control:** Git & GitHub

## 🚀 Getting Started

Follow these steps to set up the ZeroHunger project locally.

### Prerequisites
* Node.js (v16 or higher)
* MongoDB installed and running locally, or a MongoDB Atlas URI
* Python 3.13 (if running the FastAPI routing microservice)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mithunkumar2006/ZeroHunger.git](https://github.com/mithunkumar2006/ZeroHunger.git)
   cd ZeroHunger
