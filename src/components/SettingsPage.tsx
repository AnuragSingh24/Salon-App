import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, User, Bell, Shield, Palette, Globe, LogOut, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { usePreferences } from '../context/PreferencesContext';

interface SettingsPageProps {
  setCurrentPage: (page: string) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setUserRole: (role: string) => void;
  userRole: string;
}

export function SettingsPage({ setCurrentPage, setIsAuthenticated, setUserRole, userRole }: SettingsPageProps) {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    language: 'en',
    timezone: 'UTC-5'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    appointmentReminders: true
  });

  // const [preferences, setPreferences] = useState({
  //   theme: 'light',
  //   currency: 'USD',
  //   dateFormat: 'MM/DD/YYYY',
  //   timeFormat: '12h'
  // });

  const { preferences, setPreferences } = usePreferences();


  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setPasswordMessage(null);

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage("All fields are required");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage("New passwords do not match");
      return;
    }

    try {
      setPasswordLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch("api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setPasswordMessage("Password changed successfully ✅");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      localStorage.removeItem("token");
      localStorage.removeItem("role")
      setIsAuthenticated(false);
      setCurrentPage("login");

    } catch (error: any) {
      setPasswordMessage(error.message);
    } finally {
      setPasswordLoading(false);
    }
  };


  const handleLogout = () => {
    // 1. Remove auth data
    localStorage.removeItem("token");
    sessionStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    // OR if you prefer explicit false
    sessionStorage.setItem("isLoggedIn", "false");

    // 2. Reset app state
    setIsAuthenticated(false);
    setUserRole("customer");
    setCurrentPage("home");
  };


  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Profile saved:', profileData);
  };

  const handleSaveNotifications = () => {
    // Save notifications logic here
    console.log('Notifications saved:', notifications);
  };

  const handleSavePreferences = () => {
    // Save preferences logic here
    console.log('Preferences saved:', preferences);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-secondary/30 to-accent/20 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-light text-foreground">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              {/* <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Preferences</span>
              </TabsTrigger> */}
              <TabsTrigger value="security" className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={profileData.language}
                        onValueChange={(value) => setProfileData({ ...profileData, language: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={profileData.timezone}
                        onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                          <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                          <SelectItem value="UTC+0">UTC (UTC+0)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            {/* <TabsContent value="notifications">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Notification Preferences</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive promotional offers and updates</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, marketingEmails: checked })}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Reminders</p>
                      <p className="text-sm text-muted-foreground">Get reminded about upcoming appointments</p>
                    </div>
                    <Switch
                      checked={notifications.appointmentReminders}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, appointmentReminders: checked })}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent> */}

            {/* Preferences Tab */}
            {/* <TabsContent value="preferences">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Display Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={preferences.theme}
                        onValueChange={(value) =>
                          setPreferences({ ...preferences, theme: value as any })
                        }
                      />

                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Select value={preferences.currency} onValueChange={(value) => setPreferences({ ...preferences, currency: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Date Format</Label>
                      <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Time Format</Label>
                      <Select value={preferences.timeFormat} onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12h">12 Hour</SelectItem>
                          <SelectItem value="24h">24 Hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button onClick={handleSavePreferences} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </Card>
            </TabsContent> */}

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold">Security Settings</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Change Password</h4>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                          }
                        />
                      </div>
                      {passwordMessage && (
                        <p className="text-sm text-red-500">{passwordMessage}</p>
                      )}

                      <Button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      >
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Account Actions</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Sign Out</p>
                          <p className="text-sm text-muted-foreground">Sign out of your account</p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>

                      {userRole === 'admin' && (
                        <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/20">
                          <div>
                            <p className="font-medium text-destructive">Admin Access</p>
                            <p className="text-sm text-muted-foreground">You currently have administrator privileges</p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => {
                              setUserRole('customer');
                              setCurrentPage('home');
                            }}
                          >
                            Switch to Customer
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}