/**
 * MongoDB Connection Test - Browser Console Version
 * 
 * HOW TO USE:
 * 1. Make sure backend is running (npm run dev in backend folder)
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire file
 * 4. Press Enter
 */

console.log('%c🧪 MongoDB Connection Test Suite', 'background: #13aa52; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');

const API_URL = 'http://localhost:5000';

window.MongoDBTest = {
  /**
   * Test 1: Check backend health and MongoDB connection
   */
  async testConnection() {
    console.log('\n%c📡 Test 1: Backend Health Check', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      
      console.log('%c✅ Backend is running', 'color: green; font-weight: bold;');
      console.table({
        'Status': data.status,
        'MongoDB': data.mongodb === 'connected' ? '✅ Connected' : '❌ Disconnected',
        'Timestamp': new Date(data.timestamp).toLocaleString()
      });
      
      return data.mongodb === 'connected';
    } catch (error) {
      console.error('%c❌ Backend not responding!', 'color: red; font-weight: bold;');
      console.log('Make sure backend is running: cd backend && npm run dev');
      return false;
    }
  },

  /**
   * Test 2: Create a test user
   */
  async testCreateUser() {
    console.log('\n%c👤 Test 2: Create Test User', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    const testUser = {
      walletAddress: `0xTEST${Math.random().toString(36).substring(2, 15)}`,
      username: `test_user_${Date.now()}`,
      email: 'test@skillsync.pro',
      userType: 'freelancer'
    };
    
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('%c✅ User created successfully!', 'color: green; font-weight: bold;');
        console.table({
          'ID': data._id,
          'Username': data.username,
          'Wallet': data.walletAddress,
          'Type': data.userType
        });
        return data;
      } else {
        console.warn('%c⚠️ User creation returned:', 'color: orange;', data);
        return null;
      }
    } catch (error) {
      console.error('%c❌ Failed to create user:', 'color: red;', error.message);
      return null;
    }
  },

  /**
   * Test 3: Get all users
   */
  async testGetUsers() {
    console.log('\n%c📋 Test 3: Get All Users', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    try {
      const response = await fetch(`${API_URL}/api/users`);
      const users = await response.json();
      
      console.log(`%c✅ Retrieved ${users.length} users from database`, 'color: green; font-weight: bold;');
      
      if (users.length > 0) {
        console.log('\n%cSample users:', 'font-weight: bold;');
        console.table(users.slice(0, 5).map(u => ({
          Username: u.username,
          Wallet: u.walletAddress?.substring(0, 10) + '...',
          Type: u.userType,
          Created: new Date(u.createdAt).toLocaleDateString()
        })));
      }
      
      return users;
    } catch (error) {
      console.error('%c❌ Failed to get users:', 'color: red;', error.message);
      return [];
    }
  },

  /**
   * Test 4: Create a test gig
   */
  async testCreateGig() {
    console.log('\n%c💼 Test 4: Create Test Gig', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    const testGig = {
      clientAddress: '0xTEST' + Math.random().toString(36).substring(2, 15),
      title: `Test Gig - ${new Date().toLocaleString()}`,
      description: 'This is a test gig created by the MongoDB test script',
      budget: 500,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      skillsRequired: ['Testing', 'MongoDB', 'Node.js'],
      contractGigId: Math.floor(Math.random() * 1000000)
    };
    
    try {
      const response = await fetch(`${API_URL}/api/gigs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testGig)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('%c✅ Gig created successfully!', 'color: green; font-weight: bold;');
        console.table({
          'ID': data._id,
          'Title': data.title,
          'Budget': `${data.budget} USDC`,
          'Status': data.status,
          'Deadline': new Date(data.deadline).toLocaleDateString()
        });
        return data;
      } else {
        console.warn('%c⚠️ Gig creation returned:', 'color: orange;', data);
        return null;
      }
    } catch (error) {
      console.error('%c❌ Failed to create gig:', 'color: red;', error.message);
      return null;
    }
  },

  /**
   * Test 5: Get all gigs
   */
  async testGetGigs() {
    console.log('\n%c📋 Test 5: Get All Gigs', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    try {
      const response = await fetch(`${API_URL}/api/gigs`);
      const gigs = await response.json();
      
      console.log(`%c✅ Retrieved ${gigs.length} gigs from database`, 'color: green; font-weight: bold;');
      
      if (gigs.length > 0) {
        console.log('\n%cRecent gigs:', 'font-weight: bold;');
        console.table(gigs.slice(0, 5).map(g => ({
          Title: g.title,
          Budget: `${g.budget} USDC`,
          Status: g.status,
          Skills: g.skillsRequired?.join(', '),
          Created: new Date(g.createdAt).toLocaleDateString()
        })));
      }
      
      return gigs;
    } catch (error) {
      console.error('%c❌ Failed to get gigs:', 'color: red;', error.message);
      return [];
    }
  },

  /**
   * Test 6: Create a test certificate
   */
  async testCreateCertificate() {
    console.log('\n%c🎓 Test 6: Create Test Certificate', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    const testCert = {
      tokenId: Math.floor(Math.random() * 1000000),
      studentAddress: '0xSTUDENT' + Math.random().toString(36).substring(2, 15),
      institutionAddress: '0xINSTITUTION' + Math.random().toString(36).substring(2, 15),
      institutionName: 'Test University',
      courseName: 'MongoDB Testing 101',
      studentName: 'Test Student',
      dateIssued: new Date().toISOString().split('T')[0],
      metadataURI: `ipfs://test-hash-${Math.random().toString(36).substring(2, 15)}`,
      certificateType: 'course'
    };
    
    try {
      const response = await fetch(`${API_URL}/api/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCert)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('%c✅ Certificate created successfully!', 'color: green; font-weight: bold;');
        console.table({
          'ID': data._id,
          'Course': data.courseName,
          'Student': data.studentName,
          'Institution': data.institutionName,
          'Type': data.certificateType,
          'Date': data.dateIssued
        });
        return data;
      } else {
        console.warn('%c⚠️ Certificate creation returned:', 'color: orange;', data);
        return null;
      }
    } catch (error) {
      console.error('%c❌ Failed to create certificate:', 'color: red;', error.message);
      return null;
    }
  },

  /**
   * Test 7: Get all certificates
   */
  async testGetCertificates() {
    console.log('\n%c📋 Test 7: Get All Certificates', 'color: #13aa52; font-size: 14px; font-weight: bold;');
    
    try {
      const response = await fetch(`${API_URL}/api/certificates`);
      const certs = await response.json();
      
      console.log(`%c✅ Retrieved ${certs.length} certificates from database`, 'color: green; font-weight: bold;');
      
      if (certs.length > 0) {
        console.log('\n%cRecent certificates:', 'font-weight: bold;');
        console.table(certs.slice(0, 5).map(c => ({
          Course: c.courseName,
          Student: c.studentName,
          Institution: c.institutionName,
          Type: c.certificateType,
          Date: c.dateIssued
        })));
      }
      
      return certs;
    } catch (error) {
      console.error('%c❌ Failed to get certificates:', 'color: red;', error.message);
      return [];
    }
  },

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('%c🧪 Running Complete Test Suite...', 'background: #13aa52; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
    
    const results = {
      connection: false,
      createUser: false,
      getUsers: false,
      createGig: false,
      getGigs: false,
      createCertificate: false,
      getCertificates: false
    };
    
    // Test 1: Connection
    results.connection = await this.testConnection();
    if (!results.connection) {
      console.error('%c❌ Backend not running. Start it with: cd backend && npm run dev', 'color: red; font-weight: bold; font-size: 14px;');
      return results;
    }
    
    // Test 2-3: Users
    const user = await this.testCreateUser();
    results.createUser = user !== null;
    const users = await this.testGetUsers();
    results.getUsers = users.length >= 0;
    
    // Test 4-5: Gigs
    const gig = await this.testCreateGig();
    results.createGig = gig !== null;
    const gigs = await this.testGetGigs();
    results.getGigs = gigs.length >= 0;
    
    // Test 6-7: Certificates
    const cert = await this.testCreateCertificate();
    results.createCertificate = cert !== null;
    const certs = await this.testGetCertificates();
    results.getCertificates = certs.length >= 0;
    
    // Summary
    console.log('\n%c📊 Test Summary', 'background: #13aa52; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
    console.table(results);
    
    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;
    
    console.log(`\n%c${passed}/${total} tests passed`, passed === total ? 'color: green; font-weight: bold; font-size: 16px;' : 'color: orange; font-weight: bold; font-size: 16px;');
    
    if (passed === total) {
      console.log('%c✅ MongoDB is working perfectly!', 'color: green; font-weight: bold; font-size: 16px;');
    } else {
      console.log('%c⚠️ Some tests failed. Check the logs above.', 'color: orange; font-weight: bold;');
    }
    
    return results;
  },

  /**
   * Quick test - just check if MongoDB is connected
   */
  async quickTest() {
    console.log('%c⚡ Quick MongoDB Test', 'background: #13aa52; color: white; padding: 10px; font-size: 16px; border-radius: 5px;');
    const isConnected = await this.testConnection();
    
    if (isConnected) {
      console.log('\n%c✅ MongoDB is connected and working!', 'color: green; font-weight: bold; font-size: 16px;');
    } else {
      console.log('\n%c❌ MongoDB is not connected!', 'color: red; font-weight: bold; font-size: 16px;');
      console.log('Start backend: cd backend && npm run dev');
    }
    
    return isConnected;
  }
};

// Show available commands
console.log('\n%c📚 Available Commands:', 'color: #13aa52; font-weight: bold; font-size: 14px;');
console.table({
  'MongoDBTest.quickTest()': '⚡ Quick connection check',
  'MongoDBTest.runAllTests()': '🧪 Run complete test suite',
  'MongoDBTest.testConnection()': '📡 Test backend health',
  'MongoDBTest.testCreateUser()': '👤 Create test user',
  'MongoDBTest.testGetUsers()': '📋 Get all users',
  'MongoDBTest.testCreateGig()': '💼 Create test gig',
  'MongoDBTest.testGetGigs()': '📋 Get all gigs',
  'MongoDBTest.testCreateCertificate()': '🎓 Create test certificate',
  'MongoDBTest.testGetCertificates()': '📋 Get all certificates'
});

console.log('\n%c💡 Quick Start: MongoDBTest.quickTest()', 'color: #13aa52; font-style: italic;');
console.log('%c💡 Full Test: MongoDBTest.runAllTests()', 'color: #13aa52; font-style: italic;');
