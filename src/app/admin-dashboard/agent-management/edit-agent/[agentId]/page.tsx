"use client";

import React, { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import NotificationProfile from "@/components/NotificationProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Download, FileText, Upload, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { fetchWithAuth } from "@/components/utils/fetchwitAuth";
import Swal from 'sweetalert2';
import { usersApi } from "@/api/users";
import Router from "next/navigation";
import { useRouter } from "next/navigation";

const token = localStorage.getItem('access_token');

export default function Page() {
  const router = useRouter();
  const { agentId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: '',
    idImage: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await usersApi.getUserData(agentId as string);
        console.log('Fetched user data:', data); // Debug log
        
        // Check if data.user exists, if not, try data directly
        const userInfo = data.user || data;
        
        setUserData(userInfo);
        setFormData({
          first_name: userInfo.first_name || '',
          last_name: userInfo.last_name || '',
          email: userInfo.email || '',
          phone: userInfo.phone || '',
          status: userInfo.status || 'Active',
          idImage: null,
        });
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(`Failed to load user data: ${err.message}`);
      }
    };

    if (agentId) {
      fetchUserData();
    }
  }, [agentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Add loading state
    setIsSubmitting(true);

    // Validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all required fields',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
      return;
    }

    // Confirmation dialog
    const result = await Swal.fire({
      title: 'Confirm Update',
      text: 'Are you sure you want to save these changes?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, save changes'
    });

    if (result.isConfirmed) {
      try {
        const data = await usersApi.updateUser(agentId as string, formData);
        setUserData(data.user);
        
        // Success message
        Swal.fire({
          title: 'Success!',
          text: 'User information updated successfully',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (err) {
        console.error("Failed to update user:", err);
        Swal.fire({
          title: 'Error',
          text: `Failed to update user: ${err.message}`,
          icon: 'error',
          confirmButtonColor: '#3085d6',
        });
      } finally {
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/admin-dashboard/agent-management");
      }, 1500);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  // Render error or loading state if applicable
  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

   if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
   }
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <h1 className="text-xl font-semibold text-primary">Agent Management</h1>
        <div className="flex items-center gap-4">
          <NotificationProfile
            profileLink="/agent-dashboard/settings"
            notificationLink="/agent-dashboard/notifications"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <BackLink>
            <ArrowLeft className="h-4 w-4" />
            {userData ? `View User - ${userData.first_name} ${userData.last_name}` : 'Loading...'}
          </BackLink>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-6">Edit Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1">Phone no.</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

              

                <div className="col-span-2 mt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
