// Test the authentication service directly
import { AuthService } from './src/services/auth.service';

async function testAuth() {
  console.log('Testing authentication...');
  
  // Test sign up
  console.log('1. Testing sign up...');
  const signUpResult = await AuthService.signUp('officer@test.com', 'password123', 'officer');
  console.log('Sign up result:', signUpResult);
  
  // Test sign in
  console.log('2. Testing sign in...');
  const signInResult = await AuthService.signIn('officer@test.com', 'password123');
  console.log('Sign in result:', signInResult);
  
  // Test current user
  console.log('3. Testing current user...');
  const currentUser = await AuthService.getCurrentUser();
  console.log('Current user:', currentUser);
  
  // Test sign out
  console.log('4. Testing sign out...');
  const signOutResult = await AuthService.signOut();
  console.log('Sign out result:', signOutResult);
}

testAuth().catch(console.error);
