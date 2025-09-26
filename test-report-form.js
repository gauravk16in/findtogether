// Test the missing person report functionality
// You can run this in the browser console after clicking "Find Now"

function testReportForm() {
  // Test data
  const testData = {
    // Missing person
    fullName: 'Jane Smith',
    missingSince: '2025-01-15',
    gender: 'Female',
    age: 28,
    lastSeen: 'Central Park, NYC',
    appearance: 'Wearing blue jeans and red jacket, brown hair, 5 feet 6 inches tall',
    identification: 'Small scar on left hand',
    socialMedia: '@janesmith_nyc',
    
    // Reporter
    reporterName: 'John Smith',
    relation: 'Brother',
    whatsapp: '+1-555-0123',
    address: '123 Main St, NYC, NY 10001',
    contactNumber: '+1-555-0124',
    email: 'john.smith@email.com'
  };
  
  console.log('Test data for missing person report:', testData);
  console.log('Fill out the form with this data to test the submission process.');
  
  return testData;
}

// Uncomment to run the test
// testReportForm();
