const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoint at http://localhost:4000/api/cases...');
    
    // Test basic connectivity
    console.log('1. Testing server connectivity...');
    const response = await fetch('http://localhost:4000/api/cases');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Get the response text first to see what we're getting
    const responseText = await response.text();
    console.log('2. Raw response:', responseText.substring(0, 500));
    
    try {
      const data = JSON.parse(responseText);
      console.log('3. Parsed JSON data:', JSON.stringify(data, null, 2));
      console.log('4. Number of cases returned:', Array.isArray(data) ? data.length : 'Not an array');
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError.message);
      console.log('Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('Error testing API:', error.message);
    
    // Test if server is running at all
    try {
      const serverTest = await fetch('http://localhost:4000');
      const serverResponse = await serverTest.text();
      console.log('Server root response:', serverResponse);
    } catch (serverError) {
      console.error('Server not responding at all:', serverError.message);
    }
  }
}

testAPI();
