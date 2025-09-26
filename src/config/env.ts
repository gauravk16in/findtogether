import dotenv from 'dotenv';

// Load environment variables as early as possible
dotenv.config(); // Load .env
dotenv.config({ path: '.env.' }); // Load .env. (with dot at the end)
