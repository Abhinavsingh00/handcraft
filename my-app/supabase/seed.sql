-- =====================================================
-- Seed Data for Pawfectly Handmade Products
-- =====================================================

-- Insert products from each category
INSERT INTO products (slug, name, description, price, compare_price, category, badge, images, features, stock, bulk_pricing) VALUES
-- Collars & Leashes
('handmade-leather-collar', 'Handmade Leather Collar', 'Premium leather collar with brass hardware, hand-stitched for durability. Each collar is crafted with care using high-quality vegetable-tanned leather that ages beautifully over time.', 29.99, NULL, 'collars-leashes', 'bestseller', '["/products/collars/leather-collar-1.jpg", "/products/collars/leather-collar-2.jpg"]'::jsonb, '["Genuine vegetable-tanned leather", "Solid brass buckle", "Hand-stitched construction", "Available in 5 sizes"]'::jsonb, 50, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

('nylon-patterned-collar', 'Nylon Patterned Collar', 'Vibrant nylon collar with fun patterns, quick-release buckle. Lightweight and comfortable for everyday wear with adjustable sizing for the perfect fit.', 16.99, 20.99, 'collars-leashes', 'sale', '["/products/collars/nylon-collar-1.jpg", "/products/collars/nylon-collar-2.jpg"]'::jsonb, '["Soft nylon webbing", "Quick-release buckle", "Machine washable", "Multiple pattern options"]'::jsonb, 75, '[{"minQty": 2, "discount": 15}, {"minQty": 4, "discount": 25}]'::jsonb),

('martingale-training-collar', 'Martingale Training Collar', 'Gentle training collar that tightens when pulled. Perfect for dogs who slip out of regular collars, providing control without choking.', 22.50, NULL, 'collars-leashes', NULL, '["/products/collars/martingale-1.jpg", "/products/collars/martingale-2.jpg"]'::jsonb, '["No-slip design", "Limited closure", "Soft neoprene lining", "Training-friendly"]'::jsonb, 40, '[{"minQty": 3, "discount": 10}]'::jsonb),

('reflective-safety-collar', 'Reflective Safety Collar', 'High-visibility collar with reflective threading for nighttime safety. Essential for evening walks and early morning adventures.', 18.99, NULL, 'collars-leashes', 'new', '["/products/collars/reflective-1.jpg", "/products/collars/reflective-2.jpg"]'::jsonb, '["3M reflective material", "Weather-resistant", "Durable metal D-ring", "Available in neon colors"]'::jsonb, 60, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

('leash-4ft-classic', '4ft Classic Leash', 'Classic 4-foot leather leash with padded handle. Ideal length for training and everyday walks, providing control without restricting your dog.', 24.99, NULL, 'collars-leashes', 'bestseller', '["products/leashes/leash-4ft-1.jpg", "products/leashes/leash-4ft-2.jpg"]'::jsonb, '["Full-grain leather", "Padded handle", "Solid brass clasp", "4ft length"]'::jsonb, 45, '[{"minQty": 2, "discount": 10}]'::jsonb),

('hands-free-running-leash', 'Hands-Free Running Leash', 'Bungee-style leash for running with your dog. Keep your hands free while maintaining a comfortable distance from your running companion.', 28.99, NULL, 'collars-leashes', 'new', '["/products/leashes/hands-free-1.jpg", "/products/leashes/hands-free-2.jpg"]'::jsonb, '["Shock-absorbing bungee", "Waist belt included", "Traffic handle", "Reflective stitching"]'::jsonb, 35, '[{"minQty": 2, "discount": 15}]'::jsonb),

('retractable-leash-16ft', 'Retractable Leash 16ft', '16ft retractable leash with one-button brake. Give your dog freedom to explore while maintaining control with the reliable braking system.', 19.99, 24.99, 'collars-leashes', 'sale', '["/products/leashes/retractable-1.jpg", "/products/leashes/retractable-2.jpg"]'::jsonb, '["16ft tape leash", "Ergonomic handle", "One-button brake", "Durable casing"]'::jsonb, 55, '[{"minQty": 3, "discount": 10}, {"minQty": 6, "discount": 20}]'::jsonb),

-- Treats & Chews
('organic-peanut-butter-treats', 'Organic Peanut Butter Treats', 'Delicious organic peanut butter biscuits dogs love. Made with simple, wholesome ingredients you can actually pronounce.', 12.99, NULL, 'treats-chews', 'bestseller', '["/products/treats/pb-treats-1.jpg", "/products/treats/pb-treats-2.jpg"]'::jsonb, '["Organic ingredients", "No artificial preservatives", "Made in USA", "Crunchy texture"]'::jsonb, 80, '[{"minQty": 3, "discount": 15}, {"minQty": 6, "discount": 25}]'::jsonb),

('deer-antler-chew-large', 'Deer Antler Chew Large', 'Natural shed antler for aggressive chewers. Long-lasting chew that helps clean teeth and keeps dogs occupied for hours.', 18.99, NULL, 'treats-chews', NULL, '["/products/chews/antler-1.jpg", "/products/chews/antler-2.jpg"]'::jsonb, '["100% natural shed antler", "Long-lasting", "Rich in minerals", "No odor or mess"]'::jsonb, 30, '[{"minQty": 2, "discount": 10}, {"minQty": 4, "discount": 20}]'::jsonb),

('sweet-potato-chews', 'Sweet Potato Chews', 'Healthy sweet potato slices, slowly dehydrated. A natural alternative to rawhide that''s digestible and packed with vitamins.', 9.99, 12.99, 'treats-chews', 'sale', '["/products/chews/sweet-potato-1.jpg", "/products/chews/sweet-potato-2.jpg"]'::jsonb, '["Single ingredient", "Digestible", "High in fiber", "No additives"]'::jsonb, 65, '[{"minQty": 4, "discount": 20}, {"minQty": 8, "discount": 30}]'::jsonb),

('beef-jerky-strips', 'Beef Jerky Strips', 'Premium dried beef jerky for training rewards. High-protein, low-fat treats perfect for training sessions or everyday rewards.', 14.99, NULL, 'treats-chews', 'new', '["/products/treats/jerky-1.jpg", "/products/treats/jerky-2.jpg"]'::jsonb, '["Real beef", "No fillers", "Easy to break", "Training-ready size"]'::jsonb, 70, '[{"minQty": 3, "discount": 10}, {"minQty": 6, "discount": 20}]'::jsonb),

('dental-sticks-mint', 'Dental Sticks Mint Flavor', 'Daily dental sticks that freshen breath while cleaning teeth. Make dental care a treat your dog will actually look forward to.', 15.99, NULL, 'treats-chews', 'bestseller', '["/products/treats/dental-1.jpg", "/products/treats/dental-2.jpg"]'::jsonb, '["Vet-recommended formula", "Freshens breath", "Reduces plaque", "Daily use"]'::jsonb, 90, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

-- Beds & Blankets
('orthopedic-memory-foam-bed', 'Orthopedic Memory Foam Bed', 'Luxurious memory foam bed for joint support. Provide your furry friend with the ultimate comfort and support for restful sleep.', 79.99, 99.99, 'beds-blankets', 'bestseller', '["/products/beds/orthopedic-1.jpg", "/products/beds/orthopedic-2.jpg"]'::jsonb, '["3-layer memory foam", "Waterproof liner", "Removable cover", "Machine washable"]'::jsonb, 25, '[{"minQty": 2, "discount": 15}]'::jsonb),

('donut-cuddler-bed-small', 'Donut Cuddler Bed Small', 'Calming donut bed for anxious dogs. The raised rim creates a sense of security, while the super-soft filling provides ultimate comfort.', 34.99, NULL, 'beds-blankets', NULL, '["/products/beds/donut-1.jpg", "/products/beds/donut-2.jpg"]'::jsonb, '["Self-warming fabric", "Raised rim", "Non-slip bottom", "Machine washable"]'::jsonb, 40, '[{"minQty": 2, "discount": 10}]'::jsonb),

('raised-cot-bed-medium', 'Raised Cot Bed Medium', 'Elevated bed that keeps pets cool and off the ground. Perfect for outdoor use or dogs who prefer a cooler sleeping surface.', 49.99, NULL, 'beds-blankets', 'new', '["/products/beds/cot-1.jpg", "/products/beds/cot-2.jpg"]'::jsonb, '["Breathable mesh", "Powder-coated steel", "Easy assembly", "Weather-resistant"]'::jsonb, 30, '[{"minQty": 2, "discount": 10}, {"minQty": 4, "discount": 20}]'::jsonb),

('fleece-dog-blanket-large', 'Fleece Dog Blanket Large', 'Super soft fleece blanket perfect for crates or sofas. Add a layer of comfort anywhere your dog likes to rest.', 24.99, 29.99, 'beds-blankets', 'sale', '["/products/blankets/fleece-1.jpg", "/products/blankets/fleece-2.jpg"]'::jsonb, '["Premium fleece", "Machine washable", "Available in multiple colors", "Large 50x60 size"]'::jsonb, 50, '[{"minQty": 3, "discount": 15}, {"minQty": 6, "discount": 25}]'::jsonb),

('waterproof-liner-universal', 'Waterproof Liner Universal', 'Waterproof liner to protect beds from accidents. Extend the life of your dog''s bed with this durable, noiseless protector.', 19.99, NULL, 'beds-blankets', NULL, '["/products/beds/liner-1.jpg", "/products/beds/liner-2.jpg"]'::jsonb, '["100% waterproof", "Noiseless material", "Universal sizing", "Easy to clean"]'::jsonb, 60, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

-- Toys & Accessories
('plush-squirrel-toy', 'Plush Squirrel Toy', 'Squeaky plush toy with crinkle tail. Engage your dog''s natural hunting instincts with this adorable and entertaining toy.', 11.99, NULL, 'toys-accessories', 'bestseller', '["/products/toys/squirrel-1.jpg", "/products/toys/squirrel-2.jpg"]'::jsonb, '["Multiple squeakers", "Crinkle paper", "No stuffing", "Reinforced seams"]'::jsonb, 85, '[{"minQty": 3, "discount": 20}, {"minQty": 6, "discount": 30}]'::jsonb),

('tug-rope-toy-medium', 'Tug Rope Toy Medium', 'Durable cotton rope for interactive tug-of-war. Perfect for bonding with your dog while providing dental benefits through chewing.', 9.99, NULL, 'toys-accessories', NULL, '["/products/toys/rope-1.jpg", "/products/toys/rope-2.jpg"]'::jsonb, '["Natural cotton", "Flosses teeth", "Machine washable", "Multiple sizes"]'::jsonb, 70, '[{"minQty": 4, "discount": 15}, {"minQty": 8, "discount": 25}]'::jsonb),

('interactive-puzzle-ball', 'Interactive Puzzle Ball', 'Mentally stimulating treat-dispensing ball. Keep your dog entertained and mentally sharp while they work to retrieve tasty rewards.', 16.99, 20.99, 'toys-accessories', 'sale', '["/products/toys/puzzle-1.jpg", "/products/toys/puzzle-2.jpg"]'::jsonb, '["Adjustable difficulty", "Dishwasher safe", "BPA-free", "Fits most treats"]'::jsonb, 55, '[{"minQty": 2, "discount": 10}, {"minQty": 4, "discount": 20}]'::jsonb),

('durable-chew-toy-bone', 'Durable Chew Toy Bone', 'Nearly indestructible rubber bone for power chewers. Save your furniture and satisfy your dog''s natural urge to chew.', 13.99, NULL, 'toys-accessories', 'new', '["/products/toys/chew-bone-1.jpg", "/products/toys/chew-bone-2.jpg"]'::jsonb, '["Tough rubber", "Flavored throughout", "Floats in water", "Multiple sizes"]'::jsonb, 65, '[{"minQty": 2, "discount": 10}, {"minQty": 5, "discount": 20}]'::jsonb),

('travel-water-bottle', 'Travel Water Bottle', 'Portable water bottle with built-in trough. Keep your dog hydrated on walks, hikes, and road trips with this all-in-one solution.', 14.99, NULL, 'toys-accessories', 'bestseller', '["/products/accessories/bottle-1.jpg", "/products/accessories/bottle-2.jpg"]'::jsonb, '["Leak-proof design", "One-handed operation", "BPA-free", "Holds 24oz"]'::jsonb, 75, '[{"minQty": 2, "discount": 10}, {"minQty": 4, "discount": 20}]'::jsonb),

('poop-bag-holder', 'Poop Bag Holder', 'Stylish poop bag dispenser with carabiner clip. Never forget waste bags on walks again with this convenient and stylish accessory.', 8.99, NULL, 'toys-accessories', NULL, '["/products/accessories/bag-holder-1.jpg", "/products/accessories/bag-holder-2.jpg"]'::jsonb, '["Includes 30 bags", "Carabiner clip", "Multiple patterns", "Refillable"]'::jsonb, 100, '[{"minQty": 5, "discount": 15}, {"minQty": 10, "discount": 25}]'::jsonb),

('travel-bandana-sets', 'Travel Bandana Sets', 'Matching bandana sets for dog and owner. Coordinate your style on adventures with these comfortable, adjustable bandanas.', 12.99, 15.99, 'toys-accessories', 'sale', '["/products/accessories/bandana-1.jpg", "/products/accessories/bandana-2.jpg"]'::jsonb, '["Set of 2 bandanas", "Adjustable fit", "Machine washable", "Multiple patterns"]'::jsonb, 60, '[{"minQty": 2, "discount": 10}, {"minQty": 4, "discount": 20}]'::jsonb)

ON CONFLICT (slug) DO NOTHING;
