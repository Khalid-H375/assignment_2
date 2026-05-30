================================================================================
COS10005 Web Development – Assignment 2
Student: Hossain Khalid
Student ID: 105978364
Semester 1, 2026
================================================================================

--------------------------------------------------------------------------------
WEBSITE STRUCTURE
--------------------------------------------------------------------------------

assignment2/
├── index.html          
├── restaurants.html    
├── recommend.html      
├── register.html       
├── reservation.html    
├── bill.html           
├── css/
│   └── style.css       
├── js/
│   └── script.js       
├── images/
│   ├── logo.png
│   ├── restaurant1.jpg
│   └── placeholder.jpg
└── Readme.txt        

--------------------------------------------------------------------------------
GITHUB REPOSITORY
--------------------------------------------------------------------------------

[Insert GitHub repository URL here]
e.g. https://github.com/yourusername/cos10005-assignment2

The repository is accessible to markers for the duration of the marking period.

--------------------------------------------------------------------------------
JAVASCRIPT VALIDATION LOGIC
--------------------------------------------------------------------------------

REGISTRATION FORM (register.html):
  If any check fails, the relevant error message is shown and form submission
  is blocked. The form only submits when all fields pass validation.

RESERVATION FORM (reservation.html):
  Errors are displayed inline next to each field; submission is blocked until
  all errors are resolved.

RECOMMENDATION LOGIC (recommend.html + script.js):
  Each restaurant has three attributes: dietary[], budget (low/mid/high),
  and purpose[] (family/date/business/casual).
  When the user submits their preferences:
    - If the user's dietary choice matches the restaurant's supported diets: +3 pts
    - If the restaurant's budget tier matches the user's selection: +3 pts
    - If the user's dining purpose matches the restaurant's purposes: +2 pts
  Restaurants are sorted by score (highest first). Restaurants with score >= 2
  are shown; if none meet this threshold, the top 3 are shown as a fallback.
  Clicking "Reserve This Table" on a result card passes the restaurant id as a
  query parameter to reservation.html, which pre-fills the dropdown.

--------------------------------------------------------------------------------
RESPONSIVE DESIGN
--------------------------------------------------------------------------------

CSS uses three breakpoints:
  - Desktop:  >= 1024px  (default; 3-column grids, full horizontal nav)
  - Tablet:   768–1023px (2-column grids, slightly reduced padding)
  - Mobile:   <= 767px   (single column, stacked form rows, smaller text)

All breakpoints use @media max-width rules in css/style.css.

--------------------------------------------------------------------------------
KNOWN ISSUES / LIMITATIONS
--------------------------------------------------------------------------------

- Restaurant images (restaurant1.jpg – restaurant6.jpg) must be manually added
  to the images/ folder. 
- Voucher code validation is intentionally omitted 

--------------------------------------------------------------------------------
REFERENCES
--------------------------------------------------------------------------------

- Images taken from - https://unsplash.com/ 

================================================================================
