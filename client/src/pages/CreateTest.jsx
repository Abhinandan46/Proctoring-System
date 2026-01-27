// Assuming that the surrounding lines remain unchanged. 
async function createTest() {
  const title = "Test Title"; // Example title
  const description = "Test description";
  const duration = 60;
  const questions = [];
  
  // Updated line 35
  await axios.post('/api/tests', { title, description, duration, questions }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  
  // Additional code...
}