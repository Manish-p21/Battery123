const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;

// Load battery data from JSON file
const loadBatteryData = async () => {
  try {
    const data = await fs.readFile(path.join(__dirname, "battery.json"), "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Failed to load battery.json:", err);
    process.exit(1);
  }
};

// Battery Controller
const batteryController = {
  // Get all batteries with optional filters
  getAllBatteries: async (req, res) => {
    try {
      const { category, brand, minPrice, maxPrice, capacity, sortBy, page = 1, limit = 10 } = req.query;
      
      // Load battery data
      let batteries = await loadBatteryData();
      
      // Build query filter
      if (category) {
        batteries = batteries.filter(b => b.category === category);
      }
      if (brand) {
        batteries = batteries.filter(b => b.brand === brand);
      }
      if (capacity) {
        batteries = batteries.filter(b => b.capacity === capacity);
      }
      if (minPrice || maxPrice) {
        batteries = batteries.filter(b => {
          const price = b.price;
          const min = minPrice ? Number(minPrice) : -Infinity;
          const max = maxPrice ? Number(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Sorting options
      const sortOptions = {
        priceAsc: (a, b) => a.price - b.price,
        priceDesc: (a, b) => b.price - a.price,
        ratingDesc: (a, b) => b.rating - a.rating,
        newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      };
      const sort = sortOptions[sortBy] || sortOptions.newest;
      batteries.sort(sort);

      // Pagination
      const skip = (page - 1) * limit;
      const total = batteries.length;
      const paginatedBatteries = batteries.slice(skip, skip + Number(limit));

      // Track applied filters
      const appliedFilters = {
        category: category || null,
        brand: brand || null,
        capacity: capacity || null,
        priceRange: minPrice || maxPrice ? [Number(minPrice) || null, Number(maxPrice) || null] : null,
        sortBy: sortBy || 'newest',
      };

      // Generate SEO metadata for the page
      const seo = {
        title: 'BatteryHub - Shop High-Quality Batteries',
        description: 'Explore our wide range of batteries for cars, bikes, inverters, and home UPS systems. Find top brands like Amaron, Exide, and Livguard.',
        canonicalUrl: `${req.protocol}://${req.get('host')}/batteries`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'BatteryHub Batteries',
          description: 'Browse our collection of high-quality batteries for various applications.',
        },
      };

      res.status(200).json({
        success: true,
        data: paginatedBatteries,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit),
        },
        appliedFilters,
        seo,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get a single battery by slug
  getBatteryBySlug: async (req, res) => {
    try {
      const batteries = await loadBatteryData();
      const battery = batteries.find(b => b.slug === req.params.slug);
      
      if (!battery) {
        return res.status(404).json({ success: false, message: 'Battery not found' });
      }

      // Enhance SEO metadata
      const seo = {
        title: battery.metaTitle || `${battery.name} - BatteryHub`,
        description: battery.metaDescription || `Buy ${battery.name} from BatteryHub. High-quality ${battery.category} battery from ${battery.brand}.`,
        canonicalUrl: `${req.protocol}://${req.get('host')}/product/${battery.slug}`,
        structuredData: battery.structuredData || {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: battery.name,
          image: battery.image,
          description: battery.description,
          brand: {
            '@type': 'Brand',
            name: battery.brand,
          },
          offers: {
            '@type': 'Offer',
            price: battery.price,
            priceCurrency: 'INR',
            availability: battery.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
          aggregateRating: battery.rating > 0 ? {
            '@type': 'AggregateRating',
            ratingValue: battery.rating,
            reviewCount: battery.structuredData?.aggregateRating?.reviewCount || 1,
          } : undefined,
        },
      };

      res.status(200).json({ success: true, data: battery, seo });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Search batteries with query and filters
  searchBatteries: async (req, res) => {
    try {
      const { q, category, brand, minPrice, maxPrice, capacity, sortBy, page = 1, limit = 10 } = req.query;

      // Load battery data
      let batteries = await loadBatteryData();

      // Build query filter
      if (q) {
        const regex = new RegExp(q, 'i');
        batteries = batteries.filter(b => 
          regex.test(b.name) || 
          regex.test(b.description) || 
          b.tags.some(tag => regex.test(tag))
        );
      }
      if (category) {
        batteries = batteries.filter(b => b.category === category);
      }
      if (brand) {
        batteries = batteries.filter(b => b.brand === brand);
      }
      if (capacity) {
        batteries = batteries.filter(b => b.capacity === capacity);
      }
      if (minPrice || maxPrice) {
        batteries = batteries.filter(b => {
          const price = b.price;
          const min = minPrice ? Number(minPrice) : -Infinity;
          const max = maxPrice ? Number(maxPrice) : Infinity;
          return price >= min && price <= max;
        });
      }

      // Sorting options
      const sortOptions = {
        priceAsc: (a, b) => a.price - b.price,
        priceDesc: (a, b) => b.price - a.price,
        ratingDesc: (a, b) => b.rating - a.rating,
        newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      };
      const sort = sortOptions[sortBy] || sortOptions.newest;
      batteries.sort(sort);

      // Pagination
      const skip = (page - 1) * limit;
      const total = batteries.length;
      const paginatedBatteries = batteries.slice(skip, skip + Number(limit));

      // Track applied filters
      const appliedFilters = {
        searchQuery: q || null,
        category: category || null,
        brand: brand || null,
        capacity: capacity || null,
        priceRange: minPrice || maxPrice ? [Number(minPrice) || null, Number(maxPrice) || null] : null,
        sortBy: sortBy || 'newest',
      };

      // Generate SEO metadata for search page
      const seo = {
        title: q ? `Search Results for "${q}" - BatteryHub` : 'Search Batteries - BatteryHub',
        description: `Find the best batteries matching your search${q ? ` for "${q}"` : ''}. Filter by category, brand, and price to get the perfect battery.`,
        canonicalUrl: `${req.protocol}://${req.get('host')}/search${q ? `?q=${encodeURIComponent(q)}` : ''}`,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'SearchResultsPage',
          name: `Battery Search${q ? ` for ${q}` : ''}`,
          description: `Search results for batteries${q ? ` matching "${q}"` : ''} on BatteryHub.`,
        },
      };

      res.status(200).json({
        success: true,
        data: paginatedBatteries,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit),
        },
        appliedFilters,
        seo,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get unique categories for filter bar
  getCategories: async (req, res) => {
    try {
      const batteries = await loadBatteryData();
      const categories = [...new Set(batteries.map(b => b.category))];
      res.status(200).json({ success: true, data: ['All Types', ...categories] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get unique brands for filter bar
  getBrands: async (req, res) => {
    try {
      const batteries = await loadBatteryData();
      const brands = [...new Set(batteries.map(b => b.brand))];
      res.status(200).json({ success: true, data: ['All Brands', ...brands] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  // Get unique capacities for filter bar
  getCapacities: async (req, res) => {
    try {
      const batteries = await loadBatteryData();
      const capacities = [...new Set(batteries.map(b => b.capacity))];
      res.status(200).json({ success: true, data: ['All Capacities', ...capacities] });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  }
};

// Main Express Application
const app = express();

// Middleware
app.use(cors({ origin: "https://batteryboss.vercel.app", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const router = express.Router();

// Route to get all batteries with optional filters
router.get('/batteries', batteryController.getAllBatteries);

// Route to get a single battery by slug
router.get('/product/:slug', batteryController.getBatteryBySlug);

// Route to search batteries with query and filters
router.get('/search', batteryController.searchBatteries);

// Route to get unique categories for filter options
router.get('/categories', batteryController.getCategories);

// Route to get unique brands for filter options
router.get('/brands', batteryController.getBrands);

// Route to get unique capacities for filter options
router.get('/capacities', batteryController.getCapacities);

app.use("/api", router);

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
