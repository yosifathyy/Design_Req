import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Copy, AlertTriangle, CheckCircle } from "lucide-react";

export const RLSFixGuide: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const rlsFixSQL = `-- =====================================================
-- FIX USER CREATION ISSUES (RLS POLICIES)
-- =====================================================
-- Run this in your Supabase SQL Editor to fix user creation issues

-- Option 1: Disable RLS on users table (simple but less secure)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Option 2: Create proper RLS policies (more secure)
-- First enable RLS if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own records
CREATE POLICY "Users can insert own records" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow authenticated users to view all users (for messaging)
CREATE POLICY "Users can view all users" ON users
FOR SELECT USING (true);

-- Allow users to update their own records
CREATE POLICY "Users can update own records" ON users
FOR UPDATE USING (auth.uid() = id);

-- Allow admin users to do everything
CREATE POLICY "Admins can do everything" ON users
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'super-admin')
  )
);

SELECT 'RLS policies created successfully!' as status;`;

  const quickFixSQL = `-- QUICK FIX: Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

SELECT 'Users table RLS disabled - user creation should now work!' as status;`;

  return (
    <Card className="border-2 border-orange-500 bg-orange-50 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-bold text-orange-800">
            🔧 RLS Policy Fix Required
          </h3>
        </div>

        <div className="text-sm text-orange-800 space-y-2">
          <p>
            <strong>Issue:</strong> Row Level Security (RLS) policies are
            preventing user record creation. This is why the foreign key error
            persists.
          </p>
          <p>
            <strong>Solution:</strong> Run one of the SQL scripts below in your
            Supabase SQL Editor to fix this issue.
          </p>
        </div>

        {/* Quick Fix Option */}
        <div className="space-y-2">
          <h4 className="font-medium text-orange-800">
            🚀 Quick Fix (Recommended for Development)
          </h4>
          <div className="relative">
            <pre className="bg-orange-100 p-3 rounded text-xs overflow-x-auto">
              {quickFixSQL}
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(quickFixSQL)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Comprehensive Fix Option */}
        <div className="space-y-2">
          <h4 className="font-medium text-orange-800">
            🔒 Secure Fix (Recommended for Production)
          </h4>
          <div className="relative">
            <pre className="bg-orange-100 p-3 rounded text-xs overflow-x-auto max-h-64">
              {rlsFixSQL}
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(rlsFixSQL)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-orange-100 p-3 rounded space-y-2">
          <h4 className="font-medium text-orange-800">📋 Instructions:</h4>
          <ol className="list-decimal list-inside text-sm text-orange-700 space-y-1">
            <li>Go to your Supabase Dashboard</li>
            <li>Navigate to SQL Editor</li>
            <li>Copy and paste one of the SQL scripts above</li>
            <li>Run the script</li>
            <li>Try sending a message again</li>
          </ol>
        </div>

        <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">
            After running the SQL, user records will be created automatically
            and messages should send successfully.
          </span>
        </div>
      </div>
    </Card>
  );
};

export default RLSFixGuide;
