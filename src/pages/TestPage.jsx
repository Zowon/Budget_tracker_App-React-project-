import React from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import FormField from '../components/inputs/FormField';
import Button from '../components/inputs/Button';
import Card from '../components/layout/Card';

const TestPage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Component Test Page</h1>
      
      <Card padding="large">
        <h2>Form Components Test</h2>
        
        <FormField
          label="Test Email"
          type="email"
          name="testEmail"
          placeholder="test@example.com"
          icon="mail"
        />
        
        <FormField
          label="Test Password"
          type="password"
          name="testPassword"
          placeholder="Enter password"
          icon="eye"
        />
        
        <Button variant="primary" size="large" fullWidth>
          Test Button
        </Button>
      </Card>
      
      <Card padding="medium" style={{ marginTop: '20px' }}>
        <h2>Auth Layout Test</h2>
        <p>This tests the AuthLayout component</p>
      </Card>
    </div>
  );
};

export default TestPage; 