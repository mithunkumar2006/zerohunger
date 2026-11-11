#!/usr/bin/env node

/**
 * Health Check Script
 * Verifies that both frontend and backend are running correctly
 */

import axios from 'axios';

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:5174';

async function checkBackend() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 5000 });
    console.log('✅ Backend:', response.data.message);
    console.log(`   URL: ${BACKEND_URL}`);
    return true;
  } catch (error) {
    console.error('❌ Backend:', error.message);
    console.error(`   Expected at: ${BACKEND_URL}`);
    return false;
  }
}

async function checkFrontend() {
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    if (response.status === 200) {
      console.log('✅ Frontend is running');
      console.log(`   URL: ${FRONTEND_URL}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Frontend:', error.message);
    console.error(`   Expected at: ${FRONTEND_URL}`);
    return false;
  }
}

async function checkAPIs() {
  try {
    console.log('\n📡 Checking API Endpoints...\n');
    
    const endpoints = [
      '/api/analytics',
      '/api/donations',
      '/api/users/restaurants',
      '/api/users/ngos',
      '/api/users/volunteers',
    ];

    for (const endpoint of endpoints) {
      try {
        await axios.get(`${BACKEND_URL}${endpoint}`, { timeout: 3000 });
        console.log(`✅ ${endpoint}`);
      } catch (error) {
        console.log(`⚠️  ${endpoint} - ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error checking APIs:', error.message);
  }
}

async function main() {
  console.log('\n🌱 Food Rescue Network - Health Check\n');
  console.log('═'.repeat(50));

  const backendOk = await checkBackend();
  const frontendOk = await checkFrontend();

  if (backendOk) {
    await checkAPIs();
  }

  console.log('\n═'.repeat(50));
  console.log('\n📋 Status Summary:');
  console.log(`   Backend:  ${backendOk ? '✅ OK' : '❌ DOWN'}`);
  console.log(`   Frontend: ${frontendOk ? '✅ OK' : '❌ DOWN'}`);

  if (backendOk && frontendOk) {
    console.log('\n🚀 All systems operational!');
    console.log(`\n   👉 Open: ${FRONTEND_URL}`);
    process.exit(0);
  } else {
    console.log('\n⚠️  Some services are not running.');
    console.log('\n📝 To start:');
    console.log('   Terminal 1: node server/server.js');
    console.log('   Terminal 2: npm run --prefix frontend start');
    process.exit(1);
  }
}

main();
