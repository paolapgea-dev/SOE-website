// ============================================================
// SCIENCE OF EFFICIENCY — Wix Velo Code for Glossary Page
// ============================================================
//
// HOW TO USE THIS IN WIX:
//
// STEP 1: Set Up CMS Collection
//   1. Go to your Wix Dashboard > CMS
//   2. Create a new Collection called "Glossary"
//   3. Add these fields:
//      - term (Text)
//      - aka (Text)
//      - definition (Text)
//      - category (Text) - values: Cognitive, Social, Developmental,
//        Clinical, Behavioral, Personality, Neuroscience
//      - tags (Text) - comma-separated
//      - blogLink (URL)
//      - slug (Text)
//   4. Import glossary-import.csv into this collection
//
// STEP 2: Set Up the Page
//   1. Create a new page called "Glossary"
//   2. Add these elements (name them exactly as shown):
//      - Text Input -> rename to #searchInput
//      - Repeater -> rename to #glossaryRepeater
//        Inside the repeater, add:
//          - Text -> rename to #termText
//          - Text -> rename to #akaText
//          - Text -> rename to #defText
//          - Text -> rename to #tagsText
//          - Button -> rename to #blogLinkBtn (hidden by default)
//      - Filter buttons -> rename to:
//          #filterAll, #filterCognitive, #filterSocial,
//          #filterDevelopmental, #filterClinical, #filterBehavioral,
//          #filterPersonality, #filterNeuroscience
//      - Text -> rename to #resultCount
//
// STEP 3: Paste This Code
//   1. Click on the page in the editor
//   2. Click "Code" at the bottom (or Dev Mode > Turn on)
//   3. Paste ALL of this code into the page code panel
//   4. Preview and test!
//
// ============================================================

import wixData from 'wix-data';

let allItems = [];
let currentCategory = 'all';
let currentSearch = '';

$w.onReady(function () {
    loadGlossary();

    // Debounced search
    let searchTimeout;
    $w('#searchInput').onInput((event) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = event.target.value.toLowerCase().trim();
            filterAndDisplay();
        }, 300);
    });

    setupFilterButtons();
});

// Load all glossary terms from CMS
async function loadGlossary() {
    try {
        const results = await wixData.query('Glossary')
            .ascending('term')
            .limit(100)
            .find();

        allItems = results.items;

        // Fetch remaining pages if > 100 terms
        if (results.totalCount > 100) {
            let allResults = [...results.items];
            let skip = 100;
            while (skip < results.totalCount) {
                const more = await wixData.query('Glossary')
                    .ascending('term')
                    .skip(skip)
                    .limit(100)
                    .find();
                allResults = [...allResults, ...more.items];
                skip += 100;
            }
            allItems = allResults;
        }

        filterAndDisplay();
    } catch (error) {
        console.error('Error loading glossary:', error);
    }
}

// Filter by category + search, then display
function filterAndDisplay() {
    let filtered = allItems;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(item =>
            item.category &&
            item.category.toLowerCase() === currentCategory.toLowerCase()
        );
    }

    if (currentSearch) {
        filtered = filtered.filter(item => {
            const text = [
                item.term || '',
                item.aka || '',
                item.definition || '',
                item.tags || '',
                item.category || ''
            ].join(' ').toLowerCase();
            return text.includes(currentSearch);
        });
    }

    $w('#resultCount').text =
        `${filtered.length} term${filtered.length !== 1 ? 's' : ''} found`;

    $w('#glossaryRepeater').data = filtered.map(item => ({
        _id: item._id,
        term: item.term,
        aka: item.aka,
        definition: item.definition,
        tags: item.tags,
        blogLink: item.blogLink,
        category: item.category
    }));

    $w('#glossaryRepeater').onItemReady(($item, itemData) => {
        $item('#termText').text = itemData.term || '';
        $item('#akaText').text = itemData.aka
            ? `Also known as: ${itemData.aka}` : '';
        $item('#defText').text = itemData.definition || '';
        $item('#tagsText').text = itemData.tags || '';

        if (itemData.blogLink) {
            $item('#blogLinkBtn').show();
            $item('#blogLinkBtn').onClick(() => {
                import('wix-location').then(wixLocation => {
                    wixLocation.to(itemData.blogLink);
                });
            });
        } else {
            $item('#blogLinkBtn').hide();
        }
    });
}

// Category filter buttons
function setupFilterButtons() {
    const filters = [
        { id: '#filterAll', category: 'all' },
        { id: '#filterCognitive', category: 'cognitive' },
        { id: '#filterSocial', category: 'social' },
        { id: '#filterDevelopmental', category: 'developmental' },
        { id: '#filterClinical', category: 'clinical' },
        { id: '#filterBehavioral', category: 'behavioral' },
        { id: '#filterPersonality', category: 'personality' },
        { id: '#filterNeuroscience', category: 'neuroscience' },
    ];

    filters.forEach(filter => {
        $w(filter.id).onClick(() => {
            currentCategory = filter.category;

            // Update active state styling
            filters.forEach(f => {
                $w(f.id).style.backgroundColor = '#FFFFFF';
                $w(f.id).style.color = '#1a1a2e';
            });
            $w(filter.id).style.backgroundColor = '#FFE135';
            $w(filter.id).style.color = '#1a1a2e';

            filterAndDisplay();
        });
    });
}

// ============================================================
// NO-CODE ALTERNATIVE:
//
// If you prefer zero code, use Wix's built-in approach:
// 1. Add a Dataset connected to "Glossary" collection
// 2. Add a Repeater connected to the Dataset
// 3. Connect text elements to collection fields
// 4. Use Wix's built-in search input + Dataset filter
//
// The Velo code above gives you faster client-side filtering,
// combined search + category filter, and debounced search.
// ============================================================
