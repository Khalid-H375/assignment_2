
/**
 * Show an error message for a given field.
 * @param {string} fieldId  - id of the input element
 * @param {string} message  - error text to display
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '-error');
    if (field)  field.classList.add('error');
    if (errEl)  { errEl.textContent = message; errEl.classList.add('visible'); }
}

/**
 * Clear error state from a field.
 * @param {string} fieldId
 */
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errEl = document.getElementById(fieldId + '-error');
    if (field)  field.classList.remove('error');
    if (errEl)  { errEl.textContent = ''; errEl.classList.remove('visible'); }
}

/**
 * Show/hide a conditional element by toggling the 'visible' class.
 * @param {string} id
 * @param {boolean} show
 */
function toggleVisible(id, show) {
    const el = document.getElementById(id);
    if (!el) return;
    if (show) { el.classList.add('visible'); }
    else      { el.classList.remove('visible'); }
}

/* =============================================
   NAVIGATION HIGHLIGHTING
   Adds 'active' class to nav link matching
   the current page filename.
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav ul li a').forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) link.classList.add('active');
    });
});

/* =============================================
   REGISTRATION FORM VALIDATION  (register.html)
   ============================================= */

function validateRegistration(e) {
    e.preventDefault();

    // Clear previous errors
    ['reg-username','reg-email','reg-phone','reg-password',
     'reg-confirm','reg-gender','reg-dietary','reg-country'].forEach(clearError);

    let valid = true;

    const username = document.getElementById('reg-username').value.trim();
    if (!username) {
        showError('reg-username', 'Username is required.');
        valid = false;
    } else if (username.length < 5) {
        showError('reg-username', 'Username must be at least 5 characters.');
        valid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('reg-username', 'Username may only contain letters, numbers, and underscores.');
        valid = false;
    }

    const email = document.getElementById('reg-email').value.trim();
    if (!email) {
        showError('reg-email', 'Email address is required.');
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('reg-email', 'Please enter a valid email address.');
        valid = false;
    }

    const phone = document.getElementById('reg-phone').value.trim();
    if (!phone) {
        showError('reg-phone', 'Phone number is required.');
        valid = false;
    } else if (!/^\d{8,15}$/.test(phone)) {
        showError('reg-phone', 'Phone number must be 8–15 digits only.');
        valid = false;
    }

    // Password: >=10 chars, uppercase, lowercase, digit, special char
    const password = document.getElementById('reg-password').value;
    if (!password) {
        showError('reg-password', 'Password is required.');
        valid = false;
    } else if (password.length < 10) {
        showError('reg-password', 'Password must be at least 10 characters.');
        valid = false;
    } else if (!/[A-Z]/.test(password)) {
        showError('reg-password', 'Password must include at least one uppercase letter.');
        valid = false;
    } else if (!/[a-z]/.test(password)) {
        showError('reg-password', 'Password must include at least one lowercase letter.');
        valid = false;
    } else if (!/\d/.test(password)) {
        showError('reg-password', 'Password must include at least one digit.');
        valid = false;
    } else if (!/[^a-zA-Z0-9]/.test(password)) {
        showError('reg-password', 'Password must include at least one special character.');
        valid = false;
    }

    // Confirm password
    const confirm = document.getElementById('reg-confirm').value;
    if (!confirm) {
        showError('reg-confirm', 'Please confirm your password.');
        valid = false;
    } else if (confirm !== password) {
        showError('reg-confirm', 'Passwords do not match.');
        valid = false;
    }

    // Gender: radio buttons
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        showError('reg-gender', 'Please select your gender.');
        valid = false;
    }

    // Dietary preference: checkbox group – at least one must be checked
    const dietChecked = document.querySelector('input[name="dietary"]:checked');
    if (!dietChecked) {
        showError('reg-dietary', 'Please select at least one dietary preference.');
        valid = false;
    }

    // Country
    const country = document.getElementById('reg-country').value;
    if (!country) {
        showError('reg-country', 'Please select your country/region.');
        valid = false;
    }

    if (valid) {
        // All valid – submit the form
        document.getElementById('register-form').submit();
    }

    return false;
}

/* =============================================
   RESERVATION FORM VALIDATION (reservation.html)
   ============================================= */

const RESTAURANT_DEPOSITS = {
    'chinatown-dumplings':  20,
    'lucky-noodle-bar':     15,
    'saffron-palace':       25,
    'la-bella-trattoria':   30,
    'sakura-ramen':         20,
    'the-vegan-garden':     15,
};

function initReservationPage() {
    const params     = new URLSearchParams(window.location.search);
    const restaurant = params.get('restaurant') || sessionStorage.getItem('selectedRestaurant');
    const select     = document.getElementById('res-restaurant');
    if (restaurant && select) {
        select.value = restaurant;
        const box = document.getElementById('deposit-info-box');
        if (box) box.style.display = 'block';
        updateDeposit();
    }

    // Wire up dynamic event handlers
    if (select) select.addEventListener('change', updateDeposit);

    const payMethod = document.getElementById('res-payment');
    if (payMethod) payMethod.addEventListener('change', togglePaymentFields);

    const sameEmail = document.getElementById('res-same-email');
    if (sameEmail) sameEmail.addEventListener('change', fillBillingEmail);
}


function updateDeposit() {
    const select  = document.getElementById('res-restaurant');
    const display = document.getElementById('deposit-display');
    if (!select || !display) return;
    const amount = RESTAURANT_DEPOSITS[select.value];
    display.textContent = amount ? `$${amount} AUD` : '—';
}

function togglePaymentFields() {
    const method = document.getElementById('res-payment').value;
    toggleVisible('voucher-section',  method === 'voucher');
    toggleVisible('card-section',     method === 'online');
}

function validateReservation(e) {
    e.preventDefault();

    // Clear previous errors
    ['res-name','res-email','res-phone','res-restaurant',
     'res-date','res-time','res-people','res-payment',
     'res-voucher','res-card','res-billing-email'].forEach(clearError);

    let valid = true;

    // Full name
    const name = document.getElementById('res-name').value.trim();
    if (!name) { showError('res-name', 'Full name is required.'); valid = false; }

    // Email
    const email = document.getElementById('res-email').value.trim();
    if (!email) {
        showError('res-email', 'Email address is required.'); valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('res-email', 'Please enter a valid email address.'); valid = false;
    }

    // Phone: at least 10 digits
    const phone = document.getElementById('res-phone').value.trim();
    if (!phone) {
        showError('res-phone', 'Phone number is required.'); valid = false;
    } else if (!/^\d{10,15}$/.test(phone)) {
        showError('res-phone', 'Phone number must contain at least 10 digits.'); valid = false;
    }

    // Restaurant selection
    const restaurant = document.getElementById('res-restaurant').value;
    if (!restaurant) { showError('res-restaurant', 'Please select a restaurant.'); valid = false; }

    // Reservation date – must not be in the past
    const dateVal = document.getElementById('res-date').value;
    if (!dateVal) {
        showError('res-date', 'Reservation date is required.'); valid = false;
    } else {
        const today = new Date(); today.setHours(0,0,0,0);
        const picked = new Date(dateVal);
        if (picked < today) { showError('res-date', 'Reservation date cannot be in the past.'); valid = false; }
    }

    // Time
    const timeVal = document.getElementById('res-time').value;
    if (!timeVal) { showError('res-time', 'Reservation time is required.'); valid = false; }

    // Number of people > 0
    const people = parseInt(document.getElementById('res-people').value, 10);
    if (!document.getElementById('res-people').value || isNaN(people) || people < 1) {
        showError('res-people', 'Number of people must be at least 1.'); valid = false;
    }

    // Payment method
    const payMethod = document.getElementById('res-payment').value;
    if (!payMethod) { showError('res-payment', 'Please select a payment method.'); valid = false; }

    if (payMethod === 'voucher') {

    }

    if (payMethod === 'online') {
        // Credit card: Visa/MC = 16 digits, Amex = 15 digits
        const cardType = document.getElementById('res-card-type') ?
            document.getElementById('res-card-type').value : '';
        const card = document.getElementById('res-card').value.trim().replace(/\s/g,'');
        if (!card) {
            showError('res-card', 'Credit card number is required.'); valid = false;
        } else if (cardType === 'amex') {
            if (!/^\d{15}$/.test(card)) {
                showError('res-card', 'American Express card must be exactly 15 digits.'); valid = false;
            }
        } else {
            // Visa/Mastercard default
            if (!/^\d{16}$/.test(card)) {
                showError('res-card', 'Visa/Mastercard number must be exactly 16 digits.'); valid = false;
            }
        }
    }
    return false;
}

/* =============================================
   RECOMMENDATION LOGIC  (recommend.html)
   Rule-based matching: each restaurant scores
   points based on dietary, budget, and purpose.
   ============================================= */
const RESTAURANTS = [
    {
        id:          'chinatown-dumplings',
        name:        'Chinatown Dumplings',
        cuisine:     'Chinese',
        dietary:     ['none','halal'],
        budget:      'low',
        purpose:     ['family','casual'],
        price:       '$10–$20 per person',
        deposit:     20,
        description: 'Authentic Cantonese dumplings and dim sum in the heart of Melbourne\'s Chinatown. Loved for its bustling atmosphere and value.',
        img:         'design/images/restaurant1.jpg',
        dishes:      'Pork Dumplings $8 · Har Gow $9 · BBQ Pork Bun $5',
    },
    {
        id:          'lucky-noodle-bar',
        name:        'Lucky Noodle Bar',
        cuisine:     'Japanese / Chinese',
        dietary:     ['none','vegetarian'],
        budget:      'low',
        purpose:     ['casual','date'],
        price:       '$15–$25 per person',
        deposit:     15,
        description: 'Cosy noodle bar famous for its rich tonkotsu ramen and hand-pulled noodles. Great for a relaxed dinner with friends or a casual date.',
        img:         'design/images/restaurant2.jpg',
        dishes:      'Tonkotsu Ramen $17 · Shoyu Ramen $16 · Gyoza $10',
    },
    {
        id:          'saffron-palace',
        name:        'Saffron Palace',
        cuisine:     'Indian',
        dietary:     ['halal','vegetarian','vegan'],
        budget:      'mid',
        purpose:     ['family','business','casual'],
        price:       '$25–$40 per person',
        deposit:     25,
        description: 'Elegant Indian restaurant offering a wide selection of Halal, vegetarian, and vegan dishes. Flavourful curries and freshly baked naan.',
        img:         'design/images/restaurant3.jpg',
        dishes:      'Butter Chicken $22 · Dal Makhani $18 · Garlic Naan $5',
    },
    {
        id:          'la-bella-trattoria',
        name:        'La Bella Trattoria',
        cuisine:     'Italian',
        dietary:     ['none','vegetarian'],
        budget:      'high',
        purpose:     ['date','business'],
        price:       '$50–$80 per person',
        deposit:     30,
        description: 'Sophisticated Italian trattoria with a curated wine list and handmade pasta. Ideal for romantic evenings or client dinners.',
        img:         'design/images/restaurant4.jpg',
        dishes:      'Truffle Tagliatelle $38 · Seafood Risotto $42 · Tiramisu $14',
    },
    {
        id:          'sakura-ramen',
        name:        'Sakura Ramen House',
        cuisine:     'Japanese',
        dietary:     ['none','vegetarian'],
        budget:      'mid',
        purpose:     ['casual','date','family'],
        price:       '$20–$35 per person',
        deposit:     20,
        description: 'Warm, Izakaya-style ramen house serving handcrafted broths simmered for 18 hours. A must-visit for Japanese food lovers.',
        img:         'design/images/restaurant5.jpg',
        dishes:      'Spicy Miso Ramen $21 · Chashu Pork Bowl $19 · Takoyaki $12',
    },
    {
        id:          'the-vegan-garden',
        name:        'The Vegan Garden',
        cuisine:     'Plant-Based',
        dietary:     ['vegan','vegetarian'],
        budget:      'mid',
        purpose:     ['family','casual','date'],
        price:       '$20–$38 per person',
        deposit:     15,
        description: 'Melbourne\'s favourite plant-based restaurant, proving vegan food can be bold, colourful, and deeply satisfying. Zero compromise on flavour.',
        img:         'design/images/restaurant6.jpg',
        dishes:      'Jackfruit Tacos $18 · Mushroom Wellington $26 · Açaí Bowl $14',
    },
];

/**
 * Run the recommendation engine.
 * For each restaurant, award points:
 *  +3 if dietary preference matches
 *  +3 if budget matches
 *  +2 if dining purpose matches
 * Sort by score descending; return top results (score >= 2).
 */
function runRecommendation(e) {
    e.preventDefault();

    const dietary = document.getElementById('rec-dietary').value;
    const budget  = document.getElementById('rec-budget').value;
    const purpose = document.getElementById('rec-purpose').value;

    if (!dietary || !budget || !purpose) {
        document.getElementById('rec-error').style.display = 'block';
        return false;
    }
    document.getElementById('rec-error').style.display = 'none';

    // Score each restaurant
    const scored = RESTAURANTS.map(r => {
        let score = 0;
        // Dietary match: 'none' preference is compatible with all
        if (dietary === 'none' || r.dietary.includes(dietary)) score += 3;
        // Budget match
        if (r.budget === budget) score += 3;
        // Purpose match
        if (r.purpose.includes(purpose)) score += 2;
        return { ...r, score };
    });

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Filter: show restaurants with score >= 2 (at least one match)
    const results = scored.filter(r => r.score >= 2);

    displayRecommendations(results.length ? results : scored.slice(0, 3));
    return false;
}

/**
 * Render recommendation cards into #rec-results.
 * @param {Array} restaurants
 */
function displayRecommendations(restaurants) {
    const container = document.getElementById('rec-results');
    if (!container) return;

    container.innerHTML = '<h2 style="margin-bottom:1rem;text-align:center">Recommended For You</h2>';

    const grid = document.createElement('div');
    grid.className = 'grid-3';

    restaurants.forEach(r => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img class="card-img" src="${r.img}" alt="${r.name}" onerror="this.src='design/images/placeholder.jpg'">
            <div class="card-body">
                <span class="tag">${r.cuisine}</span>
                <h3 class="card-title">${r.name}</h3>
                <p style="font-size:.88rem;color:var(--text-muted);margin:.4rem 0">${r.description}</p>
                <p class="price-badge">${r.price}</p>
                <p style="font-size:.83rem;margin:.4rem 0;color:var(--text-muted)">Deposit: <strong>$${r.deposit}</strong></p>
                <a href="reservation.html?restaurant=${r.id}"
                   class="btn btn-full" style="margin-top:.8rem;font-size:.88rem">
                   Reserve This Table
                </a>
            </div>`;
        grid.appendChild(card);
    });

    container.appendChild(grid);
    container.scrollIntoView({ behavior: 'smooth' });
}

/* =============================================
   BILL CALCULATOR  (bill.html)
   ============================================= */

function calculateBill() {
    const restaurantId = document.getElementById('bill-restaurant').value;
    const people       = parseInt(document.getElementById('bill-people').value, 10) || 1;
    const serviceCharge = document.getElementById('bill-service') ? document.getElementById('bill-service').checked : false;

    const restaurant = RESTAURANTS.find(r => r.id === restaurantId);
    if (!restaurant) return;

    // Parse price range midpoint for base estimate
    const priceStr  = restaurant.price;
    const matches   = priceStr.match(/\$(\d+)[–\-]?\$?(\d+)?/);
    const minPrice  = matches ? parseInt(matches[1]) : 20;
    const maxPrice  = matches && matches[2] ? parseInt(matches[2]) : minPrice + 15;
    const midPrice  = (minPrice + maxPrice) / 2;

    // Selected dish checkboxes (if any)
    let dishTotal = 0;
    const dishBoxes = document.querySelectorAll('.dish-check:checked');
    if (dishBoxes.length > 0) {
        dishBoxes.forEach(cb => { dishTotal += parseFloat(cb.dataset.price || 0); });
        dishTotal *= people;
    } else {
        dishTotal = midPrice * people;
    }

    const subtotal = dishTotal;
    const service  = serviceCharge ? subtotal * 0.1 : 0;
    const deposit  = restaurant.deposit;
    const total    = subtotal + service;
    const balance  = total - deposit;

    // Update display
    document.getElementById('bill-subtotal').textContent  = `$${subtotal.toFixed(2)}`;
    document.getElementById('bill-service-fee').textContent = `$${service.toFixed(2)}`;
    document.getElementById('bill-total').textContent     = `$${total.toFixed(2)}`;
    document.getElementById('bill-deposit-paid').textContent = `$${deposit.toFixed(2)}`;
    document.getElementById('bill-balance').textContent   = `$${balance.toFixed(2)}`;

    document.getElementById('bill-result').style.display = 'block';
}

/* =============================================
   PAGE INIT – call appropriate setup on load
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Reservation page init
    if (document.getElementById('reservation-form')) initReservationPage();
});
