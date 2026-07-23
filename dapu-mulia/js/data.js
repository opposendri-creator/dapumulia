// Data Produk Dapu Mulia
const products = [
    // ========== KUE KERING ==========
    {
        id: 1,
        name: "Nastar Keju",
        category: "kue-kering",
        price: 45000,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
        description: "Kue nastar dengan selai nanas homemade dan taburan keju premium",
        weight: "250g",
        rating: 5,
        bestseller: true
    },
    {
        id: 2,
        name: "Kastengel",
        category: "kue-kering",
        price: 50000,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        description: "Kue keju khas Belanda yang renyah dan gurih",
        weight: "250g",
        rating: 5,
        bestseller: true
    },
    {
        id: 3,
        name: "Putri Salju",
        category: "kue-kering",
        price: 48000,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        description: "Kue kering dengan taburan gula halus, lumer di mulut",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 4,
        name: "Lidah Kucing",
        category: "kue-kering",
        price: 40000,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
        description: "Kue kering tipis renyah dengan rasa vanilla",
        weight: "200g",
        rating: 4,
        bestseller: false
    },
    {
        id: 5,
        name: "Sagu Keju",
        category: "kue-kering",
        price: 42000,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
        description: "Kue sagu dengan campuran keju yang gurih",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 6,
        name: "Kue Semprong",
        category: "kue-kering",
        price: 35000,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
        description: "Kue tradisional renyah dengan rasa manis legit",
        weight: "200g",
        rating: 4,
        bestseller: false
    },

    // ========== KUE BASAH ==========
    {
        id: 7,
        name: "Bolu Pandan",
        category: "kue-basah",
        price: 55000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Bolu lembut dengan aroma pandan asli dan taburan keju",
        weight: "500g",
        rating: 5,
        bestseller: true
    },
    {
        id: 8,
        name: "Lapis Legit",
        category: "kue-basah",
        price: 85000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Kue lapis legit 36 lapis dengan rempah pilihan",
        weight: "500g",
        rating: 5,
        bestseller: true
    },
    {
        id: 9,
        name: "Klepon",
        category: "kue-basah",
        price: 25000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Kue tradisional dengan isian gula jawa dan taburan kelapa",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 10,
        name: "Putu Ayu",
        category: "kue-basah",
        price: 30000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Kue putu ayu pandan dengan taburan kelapa parut",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 11,
        name: "Bolu Kukus Mekar",
        category: "kue-basah",
        price: 28000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Bolu kukus yang mekar sempurna dengan berbagai rasa",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 12,
        name: "Dadar Gulung",
        category: "kue-basah",
        price: 22000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop",
        description: "Dadar gulung dengan isian kelapa dan gula merah",
        weight: "200g",
        rating: 4,
        bestseller: false
    },

    // ========== ROTI & PASTRY ==========
    {
        id: 13,
        name: "Roti Sobek Coklat",
        category: "roti",
        price: 32000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Roti sobek lembut dengan isian coklat meleleh",
        weight: "250g",
        rating: 5,
        bestseller: true
    },
    {
        id: 14,
        name: "Croissant Keju",
        category: "roti",
        price: 28000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Croissant berlapis dengan isian keju creamy",
        weight: "150g",
        rating: 4,
        bestseller: false
    },
    {
        id: 15,
        name: "Donat Kentang",
        category: "roti",
        price: 20000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Donat kentang empuk dengan topping glaze",
        weight: "200g (4 pcs)",
        rating: 5,
        bestseller: true
    },
    {
        id: 16,
        name: "Pisang Bolen",
        category: "roti",
        price: 25000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Pastry dengan isian pisang dan coklat keju",
        weight: "200g",
        rating: 4,
        bestseller: false
    },
    {
        id: 17,
        name: "Roti Tawar Premium",
        category: "roti",
        price: 22000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Roti tawar premium lembut dan sehat",
        weight: "400g",
        rating: 4,
        bestseller: false
    },
    {
        id: 18,
        name: "Cinnamon Roll",
        category: "roti",
        price: 30000,
        image: "https://images.unsplash.com/photo-1549931319-a545753467f7?w=400&h=400&fit=crop",
        description: "Roti gulung kayu manis dengan cream cheese frosting",
        weight: "200g",
        rating: 5,
        bestseller: true
    },

    // ========== SNACK ==========
    {
        id: 19,
        name: "Keripik Singkong Balado",
        category: "snack",
        price: 18000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Keripik singkong homemade dengan bumbu balado pedas",
        weight: "200g",
        rating: 5,
        bestseller: true
    },
    {
        id: 20,
        name: "Makroni Keju",
        category: "snack",
        price: 20000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Makroni goreng dengan taburan keju bubuk",
        weight: "200g",
        rating: 4,
        bestseller: false
    },
    {
        id: 21,
        name: "Stik Bawang",
        category: "snack",
        price: 15000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Stik bawang gurih dan renyah",
        weight: "200g",
        rating: 4,
        bestseller: false
    },
    {
        id: 22,
        name: "Kacang Telur",
        category: "snack",
        price: 20000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Kacang tanah dengan lapisan telur crispy",
        weight: "250g",
        rating: 4,
        bestseller: false
    },
    {
        id: 23,
        name: "Keripik Tempe",
        category: "snack",
        price: 15000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Keripik tempe homemade renyah dan gurih",
        weight: "150g",
        rating: 4,
        bestseller: false
    },
    {
        id: 24,
        name: "Rengginang",
        category: "snack",
        price: 18000,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d34?w=400&h=400&fit=crop",
        description: "Rengginang ketan putih gurih dan renyah",
        weight: "200g",
        rating: 4,
        bestseller: false
    },

    // ========== MINUMAN ==========
    {
        id: 25,
        name: "Es Cendol",
        category: "minuman",
        price: 12000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Minuman tradisional dengan cendol, santan, dan gula merah",
        weight: "300ml",
        rating: 5,
        bestseller: true
    },
    {
        id: 26,
        name: "Es Campur",
        category: "minuman",
        price: 15000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Es campur segar dengan berbagai topping",
        weight: "350ml",
        rating: 4,
        bestseller: false
    },
    {
        id: 27,
        name: "Wedang Jahe",
        category: "minuman",
        price: 8000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Wedang jahe hangat dengan campuran rempah",
        weight: "250ml",
        rating: 4,
        bestseller: false
    },
    {
        id: 28,
        name: "Jus Alpukat",
        category: "minuman",
        price: 18000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Jus alpukat segar dengan susu coklat",
        weight: "350ml",
        rating: 5,
        bestseller: true
    },
    {
        id: 29,
        name: "Es Teler",
        category: "minuman",
        price: 20000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Es teler lengkap dengan alpukat, kelapa muda, dan nangka",
        weight: "350ml",
        rating: 4,
        bestseller: false
    },
    {
        id: 30,
        name: "Bandrek",
        category: "minuman",
        price: 10000,
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop",
        description: "Minuman jahe pedas khas Sunda",
        weight: "250ml",
        rating: 4,
        bestseller: false
    }
];

