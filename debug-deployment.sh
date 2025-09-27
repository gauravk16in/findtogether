#!/bin/bash

# Debug deployment script for FindTogether
echo "🔍 Debugging FindTogether deployment..."

echo "📁 Project structure check:"
ls -la api/

echo "🔧 Checking API files:"
for file in api/*.js; do
    if [ -f "$file" ]; then
        echo "✅ Found: $file"
        head -n 5 "$file"
        echo "---"
    fi
done

echo "📦 Package.json scripts:"
cat package.json | grep -A 10 '"scripts"'

echo "⚙️ Vercel config:"
cat vercel.json

echo "🌐 Testing API endpoints locally (if possible):"
echo "You can test these URLs after deployment:"
echo "- https://findtogether.vercel.app/api/test"
echo "- https://findtogether.vercel.app/api/cases"
echo "- https://findtogether.vercel.app/api/reports"

echo "✨ Deployment debug complete!"
